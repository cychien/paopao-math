import type { Route } from "./+types/purchase";
import { redirect, data, Form, Link, useNavigation } from "react-router";
import checkIconSrc from "~/assets/check.svg";
import { ArrowLeft } from "lucide-react";
import { checkIsCustomer } from "~/services/customer-session.server";
import { getAppVariantsBySlug } from "~/operations/get-app-variants";
import { createCheckout } from "~/operations/create-checkout.server";

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

    // Build the success redirect URL
    const url = new URL(request.url);
    const protocol =
      request.headers.get("x-forwarded-proto") || url.protocol.replace(":", "");
    const successUrl = `${protocol}://${url.host}/login`;

    // 建立 Lemon Squeezy checkout
    const result = await createCheckout(
      DEFAULT_APP_SLUG,
      variantId,
      successUrl
    );

    if (!result.success) {
      return Response.json(
        { error: result.error || "建立付款頁面失敗", success: false } as const,
        { status: 500 }
      );
    }

    // Redirect to checkout URL
    throw redirect(result.checkoutUrl);
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

export default function PurchasePage({ loaderData, actionData }: Route.ComponentProps) {
  const { variants, isPaymentActive } = loaderData;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // 產品資訊
  const productInfo = {
    name: "學測總複習班",
    price: 4995,
    originalPrice: 7999,
    features: [
      "完整總複習課程",
      "實體學習參考書",
      "定期模擬測驗",
      "歷屆大考試題及講解",
      "問答專區解惑",
      "超過 200 部詳解影片",
    ],
  };

  // Get the first (and likely only) variant for single product
  const variant = variants[0];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* 頁面標題 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              購買學測總複習班
            </h1>
            <p className="text-xl text-gray-600">
              年費買斷，年內暢學與持續更新
            </p>
          </div>

          {!isPaymentActive || !variant ? (
            <div className="bg-white rounded-2xl py-8 px-4 lg:p-8 shadow-lg text-center">
              <p className="text-gray-600">目前尚未開放購買</p>
              <Link
                to="/"
                className="mt-4 inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-800"
              >
                <ArrowLeft className="size-4" /> 返回首頁
              </Link>
            </div>
          ) : (
            <>
              <div className="grid lg:grid-cols-2 gap-8">
                {/* 左側：課程資訊 */}
                <div className="bg-white rounded-2xl py-8 px-4 lg:p-8 shadow-lg">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    課程內容
                  </h2>

                  <div className="space-y-4 mb-8">
                    {productInfo.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <img
                          src={checkIconSrc}
                          alt="check icon"
                          className="w-6 h-6 flex-shrink-0"
                        />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg text-gray-600">原價</span>
                      <span className="text-lg text-gray-400 line-through">
                        NT${productInfo.originalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-bold text-gray-900">
                        現在只需
                      </span>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-green-600">
                          NT${(variant.price / 100).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 右側：購買表單 */}
                <div className="bg-white rounded-2xl py-8 px-4 lg:p-8 shadow-lg">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    完成購買
                  </h2>

                  <Form method="post" className="space-y-6">
                    <input type="hidden" name="variantId" value={variant.id} />

                    <div className="text-sm text-gray-700">
                      <p className="mb-2">購買完成後：</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        <li>您將收到確認郵件</li>
                        <li>使用郵件中的連結登入</li>
                        <li>立即開始學習</li>
                      </ul>
                    </div>

                    {actionData && "error" in actionData && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg
                              className="h-5 w-5 text-red-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-red-700">
                              {actionData?.error}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-gray-400 text-white font-medium py-4 px-6 rounded-lg transition-colors disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                          前往付款頁面...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-1.5 translate-y-px"
                          >
                            <path
                              opacity="0.12"
                              d="M2 8H22V14.6C22 16.8402 22 17.9603 21.564 18.816C21.1805 19.5686 20.5686 20.1805 19.816 20.564C18.9603 21 17.8402 21 15.6 21H8.4C6.15979 21 5.03969 21 4.18404 20.564C3.43139 20.1805 2.81947 19.5686 2.43597 18.816C2 17.9603 2 16.8402 2 14.6V8Z"
                              fill="#fff"
                            />
                            <path
                              d="M2.5 8H21.5M6 12H10M8.4 21H15.6C17.8402 21 18.9603 21 19.816 20.564C20.5686 20.1805 21.1805 19.5686 21.564 18.816C22 17.9603 22 16.8402 22 14.6V9.4C22 7.15979 22 6.03968 21.564 5.18404C21.1805 4.43139 20.5686 3.81947 19.816 3.43597C18.9603 3 17.8402 3 15.6 3H8.4C6.15979 3 5.03968 3 4.18404 3.43597C3.43139 3.81947 2.81947 4.43139 2.43597 5.18404C2 6.03968 2 7.15979 2 9.4V14.6C2 16.8402 2 17.9603 2.43597 18.816C2.81947 19.5686 3.43139 20.1805 4.18404 20.564C5.03968 21 6.15979 21 8.4 21Z"
                              stroke="#fff"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          前往安全付款頁面
                        </div>
                      )}
                    </button>

                    <div className="text-sm text-gray-500 text-center">
                      <p>🔒 安全付款由 Lemon Squeezy 處理</p>
                      <p>支援信用卡、Apple Pay、Google Pay 等多種付款方式</p>
                    </div>
                  </Form>
                </div>
              </div>

              {/* 返回首頁 */}
              <div className="flex justify-center mt-12">
                <Link
                  to="/"
                  className="text-sm text-brand-600 hover:text-brand-800 flex gap-1 items-center"
                >
                  <ArrowLeft className="size-4" /> 返回首頁
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
