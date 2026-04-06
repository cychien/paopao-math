import { redirect, data } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import type { Route } from "./+types/api.purchase";
import { createCheckout } from "~/operations/create-checkout.server";
import { getAppVariantsBySlug } from "~/operations/get-app-variants";

const DEFAULT_APP_SLUG = "paopao-math";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const email = url.searchParams.get("email")?.trim();

  if (!email) {
    return renderEmailCollectionPage();
  }

  if (!EMAIL_REGEX.test(email)) {
    return renderEmailCollectionPage("請輸入有效的電子郵件地址", email);
  }

  return startCheckout(request, email);
};

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return renderEmailCollectionPage("僅支援 POST");
  }

  const formData = await request.formData();
  const email = formData.get("email")?.toString().trim() ?? "";

  if (!EMAIL_REGEX.test(email)) {
    return renderEmailCollectionPage("請輸入有效的電子郵件地址", email);
  }

  return startCheckout(request, email);
};

async function startCheckout(request: Request, customerEmail: string) {
  const variantData = await getAppVariantsBySlug(DEFAULT_APP_SLUG);

  if (!variantData || !variantData.isPaymentActive || variantData.variants.length === 0) {
    return data(
      {
        success: false,
        error: "目前尚未開放購買",
      },
      { status: 400 },
    );
  }

  const variant = variantData.variants[0];

  const url = new URL(request.url);
  const protocol =
    request.headers.get("x-forwarded-proto") || url.protocol.replace(":", "");
  const origin = `${protocol}://${url.host}`;
  const successUrl = `${origin}/api/webhooks/payuni/return`;
  const notifyUrl = `${origin}/api/webhooks/payuni/notify`;
  const backUrl = `${origin}/purchase/success`;

  const result = await createCheckout(
    DEFAULT_APP_SLUG,
    variant.id,
    successUrl,
    notifyUrl,
    customerEmail,
    backUrl,
  );

  if (!result.success) {
    return data(
      {
        success: false,
        error: result.error || "建立付款頁面失敗",
      },
      { status: 500 },
    );
  }

  if (result.type === "redirect") {
    throw redirect(result.checkoutUrl);
  }

  return new Response(
    `<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>正在前往付款...</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600&display=swap" rel="stylesheet" />
    <style>
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      body {
        font-family: 'Noto Sans TC', sans-serif;
        min-height: 100dvh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #eef2f7;
        background-image:
          radial-gradient(ellipse 80% 60% at 20% 10%, rgba(51, 65, 85, 0.06) 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 80% 80%, rgba(30, 41, 59, 0.04) 0%, transparent 60%);
      }

      .loader-card {
        text-align: center;
        animation: fade-in 0.4s ease both;
      }

      @keyframes fade-in {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      .spinner {
        width: 40px;
        height: 40px;
        margin: 0 auto 20px;
        border: 3px solid #cbd5e1;
        border-top-color: #334155;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      .loader-card p {
        font-size: 15px;
        color: #1e293b;
        font-weight: 500;
      }

      .loader-card .sub {
        font-size: 13px;
        color: #94a3b8;
        margin-top: 6px;
      }

      noscript button {
        margin-top: 24px;
        padding: 12px 32px;
        border: 0;
        border-radius: 12px;
        background: linear-gradient(135deg, #334155, #1e293b);
        color: #fff;
        font-family: inherit;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
      }
    </style>
  </head>
  <body onload="document.getElementById('payuni-checkout-form')?.submit()">
    <form id="payuni-checkout-form" method="post" action="${escapeHtml(result.formAction)}">
      ${Object.entries(result.formFields)
        .map(
          ([name, value]) =>
            `<input type="hidden" name="${escapeHtml(name)}" value="${escapeHtml(value)}" />`,
        )
        .join("\n")}
    </form>
    <div class="loader-card">
      <div class="spinner"></div>
      <p>正在前往付款頁面</p>
      <p class="sub">請稍候，即將跳轉至 PayUni...</p>
    </div>
    <noscript>
      <button type="submit" form="payuni-checkout-form">點此前往付款</button>
    </noscript>
  </body>
</html>`,
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    },
  );
}

function renderEmailCollectionPage(error?: string, currentEmail = "") {
  return new Response(
    `<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>泡泡數學 — 購買課程</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <style>
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      body {
        font-family: 'Noto Sans TC', sans-serif;
        min-height: 100dvh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #eef2f7;
        background-image:
          radial-gradient(ellipse 80% 60% at 20% 10%, rgba(51, 65, 85, 0.06) 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 80% 80%, rgba(30, 41, 59, 0.04) 0%, transparent 60%);
        padding: 24px 16px;
        position: relative;
        overflow: hidden;
      }

      /* Decorative geometric circles — math / bubble motif */
      body::before, body::after {
        content: '';
        position: fixed;
        border-radius: 50%;
        pointer-events: none;
      }
      body::before {
        width: 340px; height: 340px;
        border: 1.5px solid rgba(51, 65, 85, 0.10);
        top: -80px; right: -60px;
      }
      body::after {
        width: 220px; height: 220px;
        border: 1.5px solid rgba(71, 85, 105, 0.08);
        bottom: -40px; left: -30px;
      }

      .card {
        width: 100%;
        max-width: 420px;
        background: #fff;
        border-radius: 20px;
        padding: 40px 32px 36px;
        box-shadow:
          0 1px 3px rgba(0,0,0,0.04),
          0 8px 32px rgba(0,0,0,0.06);
        position: relative;
        animation: card-enter 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
      }

      @keyframes card-enter {
        from { opacity: 0; transform: translateY(16px) scale(0.98); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
      }

      .badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: linear-gradient(135deg, #e2e8f0, #eef2f7);
        color: #334155;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.04em;
        padding: 5px 12px;
        border-radius: 100px;
        margin-bottom: 20px;
      }

      h1 {
        font-size: 22px;
        font-weight: 700;
        color: #0f172a;
        line-height: 1.4;
        margin-bottom: 6px;
      }

      .subtitle {
        font-size: 14px;
        color: #64748b;
        line-height: 1.6;
        margin-bottom: 28px;
      }

      .error-box {
        background: #fef2f2;
        color: #991b1b;
        font-size: 13px;
        font-weight: 500;
        padding: 12px 14px;
        border-radius: 12px;
        border-left: 3px solid #f87171;
        margin-bottom: 20px;
        animation: shake 0.4s ease-in-out;
      }

      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%      { transform: translateX(-4px); }
        40%      { transform: translateX(4px); }
        60%      { transform: translateX(-3px); }
        80%      { transform: translateX(2px); }
      }

      label {
        display: block;
        font-size: 13px;
        font-weight: 600;
        color: #475569;
        margin-bottom: 8px;
      }

      input[type="email"] {
        width: 100%;
        height: 48px;
        padding: 0 14px;
        font-family: inherit;
        font-size: 15px;
        color: #0f172a;
        background: #f8fafc;
        border: 1.5px solid #cbd5e1;
        border-radius: 12px;
        outline: none;
        transition: border-color 0.2s, box-shadow 0.2s;
        margin-bottom: 20px;
      }

      input[type="email"]:focus {
        border-color: #334155;
        box-shadow: 0 0 0 3px rgba(51, 65, 85, 0.10);
        background: #fff;
      }

      input[type="email"]::placeholder {
        color: #94a3b8;
      }

      button[type="submit"] {
        width: 100%;
        height: 48px;
        border: 0;
        border-radius: 12px;
        background: linear-gradient(135deg, #334155, #1e293b);
        color: #fff;
        font-family: inherit;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: transform 0.15s, box-shadow 0.15s;
      }

      button[type="submit"]:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 16px rgba(30, 41, 59, 0.20);
      }

      button[type="submit"]:active {
        transform: translateY(0);
        box-shadow: none;
      }

      .footer-note {
        text-align: center;
        font-size: 12px;
        color: #94a3b8;
        margin-top: 20px;
        line-height: 1.5;
      }

      .footer-note svg {
        display: inline-block;
        vertical-align: -2px;
        margin-right: 2px;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="badge">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
        寶哥高中數學
      </div>
      <h1>準備好開始學習了嗎？</h1>
      <p class="subtitle">輸入你的 Email，我們會用它建立購買資格並帶入結帳頁面</p>
      ${
        error
          ? `<div class="error-box">${escapeHtml(error)}</div>`
          : ""
      }
      <form method="post" action="/api/purchase">
        <label for="email">電子郵件</label>
        <input
          id="email"
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          value="${escapeHtml(currentEmail)}"
          autofocus
        />
        <button type="submit">前往付款 →</button>
      </form>
      <p class="footer-note">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        付款由 PayUni 安全處理
      </p>
    </div>
  </body>
</html>`,
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    },
  );
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
