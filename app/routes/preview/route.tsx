import { Outlet } from "react-router";
import { Button } from "~/components/ui/Button/Button";
import { ArrowRight } from "lucide-react";
import Icon from "~/components/ui/icon";
import { SparklesIcon } from "@hugeicons/core-free-icons";
import { usePurchase } from "~/hooks/use-purchase";

export default function PreviewLayout() {
  const { purchase, isLoading } = usePurchase();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="relative isolate overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 -z-10 opacity-30">
            <div className="absolute inset-0 bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:20px_20px] [--pattern-fg:var(--color-gray-900)]/5" />
          </div>

          <div className="container mx-auto px-4 py-16 sm:py-24 text-center">
            <div className="mx-auto max-w-2xl">
              <div className="mb-6 flex justify-center">
                <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-600 ring-1 ring-inset ring-brand-500/10 flex items-center gap-1.5">
                  <Icon icon={SparklesIcon} className="size-4" />
                  免費試讀體驗
                </span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                探索精選課程內容
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                我們精選了部分優質課程供您免費體驗。親自感受教學品質，為您的學習旅程做出最好的選擇
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button
                  size="lg"
                  className="rounded-full px-8 text-base shadow-lg shadow-brand-500/20"
                  onClick={purchase}
                  disabled={isLoading}
                >
                  {isLoading ? "處理中..." : "解鎖完整課程"} <ArrowRight className="ml-2 size-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Outlet />
    </div>
  );
}





