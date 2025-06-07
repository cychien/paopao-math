import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { LayersTwo } from "~/components/icons/LayersTwo";
import { PlayCircle } from "~/components/icons/PlayCircle";
import { buttonVariants } from "~/components/ui/Button";
import { requireAdmin } from "~/services/auth/session";
import { cn } from "~/utils/style";

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
    <div className="max-w-6xl mx-auto py-16">
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
            <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mr-4">
              <PlayCircle className="size-6 text-brand-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">管理課程</h2>
              <p className="text-gray-600 text-sm">
                管理課程內容、章節和教學影片
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="p-4 bg-gray-100 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">課程管理功能</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 新增/編輯課程章節</li>
                <li>• 上傳教學影片</li>
                <li>• 管理課程資料</li>
                <li>• 設定課程順序</li>
              </ul>
            </div>

            <Link
              to="/admin/management/course"
              className={cn(
                buttonVariants({ size: "lg" }),
                "w-full text-base h-12"
              )}
              prefetch="intent"
            >
              管理課程
            </Link>
          </div>
        </div>

        {/* 管理歷屆聯考題區塊 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mr-4">
              <LayersTwo className="size-6 text-brand-600" />
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

          <div className="flex flex-col gap-4">
            <div className="p-4 bg-gray-100 rounded-lg">
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
