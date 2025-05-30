import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { verifyMagicLink } from "~/services/auth/magic-link";
import { createUserSession } from "~/services/auth/session";
import { getUserWithPurchases } from "~/services/database/users";

type LoaderData = {
  success: boolean;
  error?: string;
  needsPurchase?: boolean;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return json<LoaderData>({
      success: false,
      error: "無效的驗證連結",
    });
  }

  try {
    // 驗證 Magic Link token
    const result = await verifyMagicLink(token);

    if (!result.success || !result.user) {
      return json<LoaderData>({
        success: false,
        error: "驗證連結已過期或無效",
      });
    }

    // 檢查用戶是否有購買記錄
    const userWithPurchases = await getUserWithPurchases(result.user.email);

    if (!userWithPurchases) {
      return json<LoaderData>({
        success: false,
        needsPurchase: true,
        error: "此信箱尚未購買課程，請先完成購買才能登入",
      });
    }

    // 檢查是否有有效的購買記錄
    const hasValidPurchase = userWithPurchases.purchases.some(
      (purchase) => purchase.status === "ACTIVE" && purchase.hasLifetimeAccess
    );

    if (!hasValidPurchase) {
      return json<LoaderData>({
        success: false,
        needsPurchase: true,
        error: "您的購買記錄無效或已過期，請聯繫客服或重新購買",
      });
    }

    // 建立用戶 session 並重導向
    return await createUserSession(
      userWithPurchases.id,
      userWithPurchases.email,
      "/course"
    );
  } catch (error) {
    console.error("Magic Link 驗證失敗:", error);
    return json<LoaderData>({
      success: false,
      error: "驗證過程發生錯誤",
    });
  }
};

export default function VerifyPage() {
  const data = useLoaderData<typeof loader>();

  if (data.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                🎉 登入成功！
              </h1>
              <p className="mt-2 text-gray-600">歡迎回到寶哥高中數學</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => (window.location.href = "/")}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                🚀 開始學習
              </button>

              <div className="bg-brand-50 border border-brand-200 rounded-md p-3">
                <p className="text-xs text-brand-700">
                  您已成功登入，可以開始使用所有課程功能了！
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 驗證失敗
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {data.needsPurchase ? "🛒 需要購買課程" : "❌ 驗證失敗"}
            </h1>
            <p className="mt-2 text-gray-600">
              {data.needsPurchase
                ? "請先購買課程才能登入"
                : "登入連結無效或已過期"}
            </p>
            {data.error && (
              <p className="mt-1 text-sm text-red-600">{data.error}</p>
            )}
          </div>

          <div className="space-y-3">
            {data.needsPurchase ? (
              <>
                <a
                  href="/purchase"
                  className="block w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-center"
                >
                  🛒 立即購買課程
                </a>
                <a
                  href="/"
                  className="block text-gray-600 hover:text-gray-800 text-sm"
                >
                  ← 返回首頁體驗免費內容
                </a>
              </>
            ) : (
              <>
                <a
                  href="/auth/login"
                  className="block w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-center"
                >
                  🔄 重新申請登入連結
                </a>
                <a
                  href="/"
                  className="block text-gray-600 hover:text-gray-800 text-sm"
                >
                  ← 返回首頁
                </a>
              </>
            )}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-xs text-yellow-700">
              {data.needsPurchase ? (
                <>
                  <strong>說明：</strong>
                  <br />
                  • 只有購買過課程的用戶才能登入
                  <br />
                  • 未購買用戶可體驗免費內容
                  <br />• 購買後會自動發送登入連結
                </>
              ) : (
                <>
                  <strong>常見原因：</strong>
                  <br />
                  • 連結已過期 (30分鐘)
                  <br />
                  • 連結已使用過
                  <br />• 連結格式錯誤
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
