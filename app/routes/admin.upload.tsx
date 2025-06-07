import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireAdmin } from "~/services/auth/session";

type LoaderData = {
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
  };
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireAdmin(request);

  return json<LoaderData>({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
};

export default function AdminUploadPage() {
  const { user } = useLoaderData<LoaderData>();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">管理教學內容</h1>
        <p className="text-gray-600">
          歡迎，{user.name || user.email}！您可以在這裡管理所有教學內容。
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* 管理課程區塊 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">管理課程</h2>
              <p className="text-gray-600 text-sm">
                管理課程內容、章節和教學影片
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">課程管理功能</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 新增/編輯課程章節</li>
                <li>• 上傳教學影片</li>
                <li>• 管理課程資料</li>
                <li>• 設定課程順序</li>
              </ul>
            </div>

            <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
              開始管理課程
            </button>
          </div>
        </div>

        {/* 管理歷屆聯考題區塊 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                管理歷屆聯考題
              </h2>
              <p className="text-gray-600 text-sm">
                管理歷年學測、指考等聯考題庫
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">題庫管理功能</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 上傳歷屆試題</li>
                <li>• 新增解題影片</li>
                <li>• 分類題目類型</li>
                <li>• 設定難易度</li>
              </ul>
            </div>

            <button className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
              開始管理題庫
            </button>
          </div>
        </div>
      </div>

      {/* 當前用戶角色信息 */}
      <div className="mt-8 text-center">
        <div className="text-sm text-gray-500">
          當前用戶角色：
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
            {user.role === "ADMIN" ? "管理員" : user.role}
          </span>
        </div>
      </div>
    </div>
  );
}
