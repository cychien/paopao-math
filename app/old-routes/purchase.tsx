import type { Route } from "./+types/purchase";
import { redirect, data, Form, Link, useNavigation } from "react-router";
import { Check, ArrowLeft, ShieldCheck, Clock } from "lucide-react";
import { checkIsCustomer } from "~/services/customer-session.server";
import { getAppVariantsBySlug } from "~/operations/get-app-variants";
import { createCheckout } from "~/operations/create-checkout.server";
import { Button } from "~/components/ui/Button";

// Default app slug for single-tenant mode
const DEFAULT_APP_SLUG = "paopao-math";

export const loader = async ({ request }: Route.LoaderArgs) => {
  // 檢查用戶是否已是客戶
  const isCustomer = await checkIsCustomer({
    slug: DEFAULT_APP_SLUG,
    request,
  });

  if (isCustomer) {
    throw redirect("/");
  }

  // 獲取產品變體資訊
  const variantData = await getAppVariantsBySlug(DEFAULT_APP_SLUG);

  if (!variantData) {
    throw new Error("App not found");
  }

  return data({
    variants: variantData.variants,
    isPaymentActive: variantData.isPaymentActive,
  });
};

export const action = async ({
  request,
}: Route.ActionArgs): Promise<Response> => {
  try {
    const formData = await request.formData();
    const variantId = formData.get("variantId")?.toString();

    if (!variantId) {
      return Response.json(
        { error: "請選擇購買方案", success: false } as const,
        { status: 400 }
      );
    }

    // Build callback URLs
    const url = new URL(request.url);
    const protocol =
      request.headers.get("x-forwarded-proto") || url.protocol.replace(":", "");
    const origin = `${protocol}://${url.host}`;
    const successUrl = `${origin}/api/webhooks/payuni/return`;
    const notifyUrl = `${origin}/api/webhooks/payuni/notify`;

    // 建立 checkout（Lemon Squeezy or PayUni）
    const result = await createCheckout(
      DEFAULT_APP_SLUG,
      variantId,
      successUrl,
      notifyUrl,
    );

    if (!result.success) {
      return Response.json(
        { error: result.error || "建立付款頁面失敗", success: false } as const,
        { status: 500 }
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
  } catch (error) {
    // If it's a redirect, rethrow it
    if (error instanceof Response) {
      throw error;
    }
    console.error("購買處理失敗:", error);
    return Response.json(
      { error: "系統錯誤，請稍後再試", success: false },
      { status: 500 }
    );
  }
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default function PurchasePage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { variants, isPaymentActive } = loaderData;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // 產品資訊
  const productInfo = {
    name: "學測總複習班",
    description: "針對 108 課綱設計，全方位數學複習計畫",
    price: 4995,
    originalPrice: 7999,
    features: [
      {
        title: "超過 200 部詳解影片",
        desc: "每題都有詳細解說，觀念通透",
      },
      {
        title: "實體學習參考書",
        desc: "精編教材，寄送到府",
      },
      {
        title: "歷屆大考試題及講解",
        desc: "完整收錄，掌握考試趨勢",
      },
      {
        title: "定期模擬測驗",
        desc: "實戰演練，檢視學習成效",
      },
      {
        title: "問答專區解惑",
        desc: "遇到問題隨時發問，老師親自解答",
      },
      {
        title: "一年無限觀看",
        desc: "隨時隨地，想看就看",
      },
    ],
  };

  // Get the first (and likely only) variant for single product
  const variant = variants[0];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-[#2D241F]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-[#2D241F] mb-6 tracking-tight">
            投資你的未來，從現在開始
          </h1>
          <p className="text-lg text-[#5D5753] max-w-2xl mx-auto leading-relaxed">
            加入寶哥數學，用最有效率的方式掌握學測數學
          </p>
        </div>

        {!isPaymentActive || !variant ? (
          <div className="max-w-md mx-auto bg-white rounded-2xl p-8 shadow-sm border border-[#EBE5E0] text-center">
            <div className="w-16 h-16 bg-[#FAF9F6] rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-[#5D5753]" />
            </div>
            <h3 className="text-xl font-bold text-[#2D241F] mb-2">
              目前尚未開放購買
            </h3>
            <p className="text-[#5D5753] mb-6">
              抱歉，目前課程暫時關閉註冊。請稍後再回來查看。
            </p>
            <Link to="/">
              <Button variant="outline" className="w-full">
                返回首頁
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Product Details */}
            <div className="lg:col-span-7 space-y-8">
              <div className="bg-white rounded-3xl p-8 border border-[#EBE5E0] shadow-sm">
                <div className="mb-8">
                  <span className="inline-flex items-center rounded-full bg-[#FAF9F6] px-3 py-1 text-sm font-medium text-[#2D241F] border border-[#EBE5E0] mb-4">
                    學測衝刺首選
                  </span>
                  <h2 className="text-3xl font-bold text-[#2D241F] mb-2">
                    {productInfo.name}
                  </h2>
                  <p className="text-[#5D5753] text-lg">
                    {productInfo.description}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-y-6 gap-x-8">
                  {productInfo.features.map((feature, index) => (
                    <div key={index} className="flex gap-4 items-start">
                      <div className="flex-shrink-0 mt-1">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#2D241F]">
                          {feature.title}
                        </h4>
                        <p className="mt-1 text-sm text-[#5D5753]">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ / Trust section */}
              <div className="bg-[#FAF9F6] rounded-3xl p-8 border border-[#EBE5E0]">
                <h3 className="text-lg font-bold text-[#2D241F] mb-6 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  為什麼選擇我們？
                </h3>
                <ul className="space-y-4">
                  <li className="flex gap-3 text-[#5D5753] text-sm">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>
                      <strong className="text-[#2D241F]">品質保證：</strong>{" "}
                      由經驗豐富的數學名師親自授課
                    </span>
                  </li>
                  <li className="flex gap-3 text-[#5D5753] text-sm">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>
                      <strong className="text-[#2D241F]">無限重播：</strong>{" "}
                      不懂的地方隨時暫停、倒帶，直到聽懂為止
                    </span>
                  </li>
                  <li className="flex gap-3 text-[#5D5753] text-sm">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>
                      <strong className="text-[#2D241F]">完整講義：</strong>{" "}
                      搭配實體講義學習，效果加倍（購買後寄送）
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column: Checkout Summary (Pro Card Style) */}
            <div className="lg:col-span-5 sticky top-24">
              <div className="bg-white rounded-3xl border-2 border-[#EBE5E0] overflow-hidden relative shadow-sm">
                <div className="absolute top-0 right-0">
                  <div className="bg-[#2D241F] text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl">
                    Popular
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  {/* Price Header */}
                  <div>
                    <h3 className="text-xl font-bold text-[#2D241F] mb-1">
                      完整課程方案
                    </h3>
                    <p className="text-[#5D5753] text-sm mb-6">
                      包含所有影音課程與實體講義
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-[#2D241F] tracking-tight">
                        NT$ {(variant.price / 100).toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-2 text-[#5D5753] text-sm flex items-center gap-2">
                      <span className="line-through opacity-60">
                        原價 NT$ {productInfo.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded">
                        省下 NT$ {(productInfo.originalPrice - variant.price / 100).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="h-px w-full bg-[#EBE5E0]" />

                  {/* Summary */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-[#5D5753] text-sm">一次付費，永久觀看（一年期）</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-[#5D5753] text-sm">包含實體講義寄送運費</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-[#5D5753] text-sm">7 天滿意保證</span>
                    </div>
                  </div>

                  {/* Action Form */}
                  <Form method="post" className="space-y-4 pt-2">
                    <input type="hidden" name="variantId" value={variant.id} />

                    {actionData && "error" in actionData && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2 items-start text-red-700 text-sm">
                        <svg
                          className="h-5 w-5 text-red-400 flex-shrink-0"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{actionData.error}</span>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-14 text-lg font-bold bg-[#2D241F] hover:bg-[#1a1512] text-white shadow-lg transition-all duration-200 rounded-xl"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span>準備付款...</span>
                        </div>
                      ) : (
                        "立即升級"
                      )}
                    </Button>
                  </Form>

                  {/* Security Footnote */}
                  <div className="pt-2">
                    <p className="text-xs text-center text-[#9CA3AF]">
                      所有交易均通過 SSL 加密保護，安全無虞。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
