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
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">上傳教學內容</h1>
        <p className="text-gray-600">
          歡迎，{user.name || user.email}！您可以在這裡上傳和管理教學內容。
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-brand-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            上傳功能開發中
          </h3>
          <p className="text-gray-600 mb-4">
            管理員上傳教學內容的功能正在開發中，敬請期待。
          </p>
          <div className="text-sm text-gray-500">
            當前用戶角色：
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
              {user.role === "ADMIN" ? "管理員" : user.role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
