import { useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import confetti from "canvas-confetti";
import { Button } from "~/components/ui/Button";

export default function PurchaseSuccessPage() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const email = searchParams.get("email");
  const isFailed = status === "failed";

  useEffect(() => {
    if (!isFailed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [isFailed]);

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#eef2f7] px-4 py-12">
      <div className="relative w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="rounded-[20px] bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_32px_rgba(0,0,0,0.06)] sm:px-10">
          {/* Status icon */}
          <div
            className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full ${
              isFailed
                ? "bg-red-50 text-red-500"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {isFailed ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            )}
          </div>

          <h1 className="text-center text-[22px] font-bold leading-snug text-slate-900">
            {isFailed ? "付款尚未完成" : "付款成功！"}
          </h1>

          <p className="mt-2 text-center text-[14px] leading-relaxed text-slate-500">
            {isFailed
              ? "我們沒有收到成功付款通知，請稍後再試或聯繫客服協助"
              : email
                ? `已為 ${email} 建立購買資格，現在可以登入開始上課`
                : "我們已收到付款通知，現在可以用購買信箱登入上課"}
          </p>

          <div className="mt-7">
            <Link to="/auth/login">
              <Button className="h-12 w-full rounded-xl text-[15px] font-semibold">
                {isFailed ? "返回重試" : "前往登入 →"}
              </Button>
            </Link>
          </div>

          {!isFailed && (
            <p className="mt-4 text-center text-xs text-slate-400">
              付款收據已發送至你的信箱
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
