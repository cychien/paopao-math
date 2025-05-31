import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { getUserPermissionData } from "~/services/auth/permissions";
import { LockScreen } from "~/components/business/LockScreen";

type LoaderData = {
  user: {
    id: string;
    email: string;
    name: string | null;
    purchases: Array<{
      id: string;
      status: string;
      hasLifetimeAccess: boolean;
      purchasedAt: Date;
    }>;
  } | null;
  hasAccess: boolean;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { user, hasPurchase } = await getUserPermissionData(request);

  return json<LoaderData>({ user, hasAccess: hasPurchase });
};

export default function CourseOverviewPage() {
  const { user, hasAccess } = useLoaderData<LoaderData>();

  // 如果用戶未登入或沒有訪問權限，顯示 LockScreen
  if (!user || !hasAccess) {
    return (
      <div className="max-w-4xl">
        <LockScreen />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* 歡迎訊息
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🎉 歡迎來到學測總複習班！
        </h1>
        <p className="text-gray-600 mb-4">
          嗨 {user.name || user.email}，感謝您購買我們的課程！
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h2 className="font-medium text-green-900 mb-2">✅ 您的訪問權限</h2>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• 終身訪問所有課程內容</li>
            <li>• 免費獲得未來更新</li>
            <li>• 多裝置同步學習進度</li>
          </ul>
        </div>
      </div> */}

      {/* 課程統計 */}
      {/* <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">200+</div>
          <div className="text-gray-600">精講影片</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">4</div>
          <div className="text-gray-600">主要章節</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
          <div className="text-gray-600">完成進度</div>
        </div>
      </div> */}

      {/* 快速導航 */}
      {/* <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            📚 課程章節
          </h3>
          <div className="space-y-3">
            <Link
              to="/course/content"
              className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded transition-colors"
            >
              <span>第一章：函數與極限</span>
              <span className="text-green-600 text-sm">✓ 已解鎖</span>
            </Link>
            <Link
              to="/course/content"
              className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded transition-colors"
            >
              <span>第二章：微分</span>
              <span className="text-green-600 text-sm">✓ 已解鎖</span>
            </Link>
            <Link
              to="/course/content"
              className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded transition-colors"
            >
              <span>第三章：積分</span>
              <span className="text-green-600 text-sm">✓ 已解鎖</span>
            </Link>
            <Link
              to="/course/content"
              className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded transition-colors"
            >
              <span>第四章：機率統計</span>
              <span className="text-green-600 text-sm">✓ 已解鎖</span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            🎯 學習工具
          </h3>
          <div className="space-y-3">
            <Link
              to="/course/exams"
              className="block w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
            >
              📝 模擬測驗
            </Link>
            <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded transition-colors">
              📊 學習進度
            </button>
            <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded transition-colors">
              💡 重點筆記
            </button>
            <Link
              to="/course/entrance-exams"
              className="block w-full text-left p-3 bg-yellow-50 hover:bg-yellow-100 rounded transition-colors"
            >
              🏆 歷屆試題
            </Link>
          </div>
        </div>
      </div> */}

      {/* 購買資訊 */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📋 您的購買記錄
        </h3>
        <div className="space-y-2">
          {user.purchases.map((purchase) => (
            <div
              key={purchase.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded"
            >
              <div>
                <span className="font-medium">學測總複習班</span>
                <span className="text-sm text-gray-500 ml-2">
                  購買於{" "}
                  {new Date(purchase.purchasedAt).toLocaleDateString("zh-TW")}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    purchase.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {purchase.status === "ACTIVE" ? "有效" : purchase.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
