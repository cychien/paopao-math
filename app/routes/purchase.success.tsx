import { Link, useSearchParams } from "react-router";
import { Button } from "~/components/ui/Button";

export default function PurchaseSuccessPage() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const email = searchParams.get("email");
  const isFailed = status === "failed";

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col justify-center px-6 py-16">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          {isFailed ? "付款尚未完成" : "付款成功"}
        </h1>
        <p className="mt-3 text-gray-600">
          {isFailed
            ? "我們沒有收到成功付款通知，請稍後再試，或聯繫客服協助。"
            : email
              ? `已為 ${email} 建立/更新購買資格，現在可以登入上課。`
              : "我們已收到付款通知，現在可以用購買信箱登入上課。"}
        </p>
        <div className="mt-6">
          <Link to="/auth/login">
            <Button className="w-full">前往登入</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
