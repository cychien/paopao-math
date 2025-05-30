import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  useActionData,
  useNavigation,
  useLoaderData,
} from "@remix-run/react";
import { useState } from "react";
import {
  createCheckoutSession,
  getProductInfo,
} from "~/services/lemonsqueezy/products";
import { validateEmail } from "~/services/auth/magic-link";
import checkIconSrc from "~/assets/check.svg";

type ActionData =
  | { error: string; success: false }
  | { success: true; checkoutUrl: string };

export const loader = async () => {
  // 預載產品資訊
  const productInfo = getProductInfo();
  return json({ productInfo });
};

export const action = async ({
  request,
}: ActionFunctionArgs): Promise<Response> => {
  try {
    const formData = await request.formData();
    const email = formData.get("email")?.toString();
    const name = formData.get("name")?.toString();

    // 驗證 email
    if (!email || !validateEmail(email)) {
      return json(
        { error: "請輸入有效的電子郵件地址", success: false } as const,
        { status: 400 }
      );
    }

    // 建立 Lemon Squeezy checkout
    const result = await createCheckoutSession({
      email,
      name: name || undefined,
      customData: {
        source: "purchase_page",
        timestamp: Date.now(),
      },
    });

    if (!result.success) {
      return json(
        { error: result.error || "建立付款頁面失敗", success: false } as const,
        { status: 500 }
      );
    }

    return json({
      success: true,
      checkoutUrl: result.checkoutUrl!,
    } as const);
  } catch (error) {
    console.error("購買處理失敗:", error);
    return json({ error: "系統錯誤，請稍後再試", success: false } as const, {
      status: 500,
    });
  }
};

export default function PurchasePage() {
  const { productInfo } = useLoaderData<typeof loader>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const isSubmitting = navigation.state === "submitting";

  // 如果有 checkout URL，重導向到 Lemon Squeezy
  if (actionData?.success && actionData.checkoutUrl) {
    window.location.href = actionData.checkoutUrl;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* 頁面標題 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🎯 購買學測總複習班
            </h1>
            <p className="text-xl text-gray-600">
              年費買斷，終身暢學與持續更新
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* 左側：課程資訊 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
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
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    現在只需
                  </span>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600">
                      NT${productInfo.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      一次付清，終身暢學
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 右側：購買表單 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                完成購買
              </h2>

              <Form method="post" className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    電子郵件地址 *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    placeholder="your@email.com"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    購買完成後，課程訪問連結將發送到此信箱
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    姓名 (選填)
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    placeholder="您的姓名"
                  />
                </div>

                {actionData && !actionData.success && (
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
                          {actionData.error}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-gray-400 text-white font-medium py-4 px-6 rounded-lg transition-colors disabled:cursor-not-allowed"
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
                      建立付款頁面中...
                    </div>
                  ) : (
                    <>💳 前往安全付款頁面</>
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
          <div className="text-center mt-12">
            <a
              href="/"
              className="text-brand-600 hover:text-brand-800 font-medium"
            >
              ← 返回首頁
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
