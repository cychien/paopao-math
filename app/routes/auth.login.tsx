import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { useState } from "react";
import {
  validateEmail,
  sendMagicLink,
  getMagicLinkConfig,
} from "~/services/auth/magic-link";
import { sendMagicLinkEmail } from "~/services/email/magic-link-email";
import { getUserWithPurchases } from "~/services/database/users";
import { Button } from "~/components/ui/Button";
import { ArrowLeft, Check, Rocket } from "lucide-react";
import { getOptionalUser } from "~/services/auth/session";

type ActionData =
  | { error: string; success: false }
  | { success: true; message: string; email: string };

export const loader = async ({ request }: { request: Request }) => {
  // 檢查用戶是否已登入並有課程訪問權限
  const user = await getOptionalUser(request);

  if (
    user?.purchases.some(
      (purchase) => purchase.status === "ACTIVE" && purchase.hasLifetimeAccess
    )
  ) {
    throw redirect("/course/overview");
  }

  return json({});
};

export const action = async ({
  request,
}: ActionFunctionArgs): Promise<Response> => {
  try {
    const formData = await request.formData();
    const email = formData.get("email")?.toString();

    // 驗證 email
    if (!email || !validateEmail(email)) {
      return json(
        { error: "請輸入有效的電子郵件地址", success: false } as const,
        { status: 400 }
      );
    }

    // 檢查用戶是否有購買記錄
    const userWithPurchases = await getUserWithPurchases(email);

    if (!userWithPurchases) {
      return json(
        {
          error: "此信箱尚未購買課程，請先完成購買才能登入",
          success: false,
        } as const,
        { status: 403 }
      );
    }

    // 檢查是否有有效的購買記錄
    const hasValidPurchase = userWithPurchases.purchases.some(
      (purchase) => purchase.status === "ACTIVE" && purchase.hasLifetimeAccess
    );

    if (!hasValidPurchase) {
      return json(
        {
          error: "您的購買記錄無效或已過期，請聯繫客服或重新購買",
          success: false,
        } as const,
        { status: 403 }
      );
    }

    // 獲取配置
    const config = getMagicLinkConfig();

    // 獲取客戶端 IP 和 User Agent
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // 生成 Magic Link
    const { url, expiresAt } = await sendMagicLink(
      email,
      config,
      ipAddress,
      userAgent
    );

    // 發送郵件
    const emailSent = await sendMagicLinkEmail(email, url, expiresAt);

    if (!emailSent) {
      return json(
        { error: "郵件發送失敗，請稍後再試", success: false } as const,
        { status: 500 }
      );
    }

    return json({
      success: true,
      message: `登入連結已發送到 ${email}，請檢查您的信箱`,
      email,
    } as const);
  } catch (error) {
    console.error("登入處理失敗:", error);
    return json({ error: "系統錯誤，請稍後再試", success: false } as const, {
      status: 500,
    });
  }
};

export default function LoginPage() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const isSubmitting = navigation.state === "submitting";

  // 更可靠的 email 更新函數
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value.trim());
  };

  // 處理貼上事件
  const handleEmailPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    // 稍微延遲以確保貼上的內容已經更新到 input 中
    setTimeout(() => {
      const target = e.target as HTMLInputElement;
      setEmail(target.value.trim());
    }, 10);
  };

  return (
    <div className="h-full bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">登入</h2>
          <p className="mt-4 text-sm text-gray-600">
            限已購買用戶登入，我們將發送安全的登入連結到您的信箱
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg py-8 px-4 lg:p-8">
          {actionData?.success ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="size-8 text-success-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                郵件已發送！
              </h3>
              <p className="text-sm text-gray-600">{actionData.message}</p>
              <div className="bg-brand-50 border border-brand-200 rounded-md p-3">
                <p className="text-sm text-brand-700">
                  💡
                  提示：請檢查您的垃圾郵件資料夾，有時郵件可能會被誤判為垃圾郵件
                </p>
              </div>
              <Button variant="link" onClick={() => window.location.reload()}>
                重新發送登入連結
              </Button>
            </div>
          ) : (
            <Form method="post" className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  電子郵件地址
                </label>
                <div className="mt-1.5">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    onPaste={handleEmailPaste}
                    onInput={handleEmailChange}
                    required
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm h-10"
                    placeholder="請輸入您的 email"
                  />
                </div>
              </div>

              {actionData && !actionData.success && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
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
                      <p className="text-sm text-red-700">{actionData.error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="group relative w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
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
                      發送中...
                    </>
                  ) : (
                    <>
                      <Rocket className="size-4" /> 發送登入連結
                    </>
                  )}
                </Button>
              </div>
            </Form>
          )}

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              繼續使用即表示您同意我們的服務條款和隱私政策
            </p>
          </div>

          <div className="mt-4 bg-gray-50 border border-gray-200 rounded-md p-3">
            <div className="text-sm text-gray-700">
              <strong>還沒購買課程？</strong>
              <br />
              <p className="mt-2">
                <Link
                  to="/purchase"
                  className="text-gray-600 hover:text-gray-800 underline"
                >
                  點此購買學測總複習班
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Link
            to="/"
            className="text-sm text-brand-600 hover:text-brand-800 flex gap-1 items-center"
          >
            <ArrowLeft className="size-4" /> 返回首頁
          </Link>
        </div>
      </div>
    </div>
  );
}
