import { Link } from "react-router";
import { Lock } from "~/components/icons/Lock";
import { buttonVariants } from "~/components/ui/Button";
import { cn } from "~/utils/style";

function LockScreen() {
  return (
    <div className="max-w-2xl px-6 py-6 bg-brand-600 rounded-md">
      <div className="size-12 bg-brand-100 rounded-md flex items-center justify-center border-2 border-brand-50">
        <Lock className="size-6 text-brand-600" />
      </div>
      <div className="mt-3 text-bg-primary text-lg font-semibold tracking-wider">
        完整內容僅限會員
      </div>
      <p className="mt-3 text-gray-300 font-medium">
        想要繼續深入學習？購買課程，解鎖後續所有精彩內容！
      </p>
      <div className="mt-5 flex items-center">
        <Link
          to="/purchase"
          className={cn(
            buttonVariants({ size: "sm" }),
            "bg-brand-100 text-text-primary hover:bg-bg-brand-secondary-hover lg:w-auto h-[38px]"
          )}
        >
          立即購買
        </Link>
        <p className="ml-3 text-gray-300 text-sm">7 日內可全額退款</p>
      </div>
    </div>
  );
}

export { LockScreen };
