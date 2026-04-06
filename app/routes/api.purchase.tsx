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
    <title>付款跳轉中...</title>
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
    <p>正在導向付款頁面，請稍候...</p>
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
    <title>購買前請輸入 Email</title>
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 40px auto; padding: 0 16px;">
    <h1 style="font-size: 24px; margin-bottom: 8px;">購買前請先填寫 Email</h1>
    <p style="color: #555; margin-bottom: 20px;">此 Email 會用來建立購買資格，並帶入 PayUni 結帳頁。</p>
    ${
      error
        ? `<p style="background: #fef2f2; color: #b91c1c; padding: 10px 12px; border-radius: 8px; margin-bottom: 16px;">${escapeHtml(error)}</p>`
        : ""
    }
    <form method="post" action="/api/purchase">
      <label for="email" style="display: block; font-weight: 600; margin-bottom: 8px;">Email</label>
      <input
        id="email"
        type="email"
        name="email"
        required
        value="${escapeHtml(currentEmail)}"
        style="width: 100%; box-sizing: border-box; height: 44px; padding: 0 12px; border: 1px solid #d1d5db; border-radius: 8px; margin-bottom: 16px;"
      />
      <button
        type="submit"
        style="width: 100%; height: 44px; border: 0; border-radius: 8px; background: #111827; color: #fff; font-weight: 600; cursor: pointer;"
      >
        繼續前往付款
      </button>
    </form>
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
