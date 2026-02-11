import { Button } from "~/components/ui/Button";
import { Link } from "react-router";
import { Check, Sparkles } from "lucide-react";
import { ArrowRight02Icon, ArrowRightIcon, CheckmarkCircle03Icon, Tick01Icon } from "@hugeicons/core-free-icons";
import Icon from "~/components/ui/icon";
import { usePurchase } from "~/hooks/use-purchase";

function PricingCard() {
  const { purchase, isLoading } = usePurchase();

  const features = [
    "超過 200 部詳解影片",
    "實體學習參考書",
    "好題分享",
    "學習進度規劃表",
    "歷屆大考試題及講解",
    "考前模擬測驗",
    "免費加入互動討論區"
  ];

  return (
    <div className="relative group">
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-brand-200 via-brand-100 to-brand-200 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />

      <div className="relative p-8 lg:p-10 rounded-3xl bg-white border border-gray-200 shadow-2xl shadow-gray-200/50 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-brand-50 to-transparent rounded-bl-full -mr-10 -mt-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-gray-50 to-transparent rounded-tr-full -ml-8 -mb-8 pointer-events-none" />

        {/* Header */}
        <div className="relative z-10">
          {/* Badge */}
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-300 text-amber-700 text-sm font-medium py-1.5 px-4">
              <Sparkles className="w-4 h-4" />
              早鳥限定
            </span>
            <span className="text-sm text-gray-400 font-medium">省 NT$2,599</span>
          </div>

          {/* Title and Price */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">學測總複習班</h3>
              <p className="text-gray-500 mt-2">解鎖全課程與未來功能更新</p>
            </div>
            <div className="text-right">
              <div className="text-gray-400 text-sm line-through font-medium">NT$ 5,499</div>
              <div className="flex items-baseline gap-1 justify-end">
                <span className="text-2xl font-bold text-gray-900">NT$</span>
                <span className="text-5xl font-bold text-gray-900 tracking-tight">2,900</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* Features */}
        <div className="relative z-10">
          <div className="text-sm font-medium text-gray-900 uppercase tracking-wide mb-5">課程包含</div>
          <div className="space-y-3">
            {features.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-3"
              >
                <Icon icon={CheckmarkCircle03Icon} className="w-5 h-5 text-success-600 flex-shrink-0" />
                <span className="text-[15px] font-medium text-gray-700">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* CTA */}
        <Button
          className="relative z-10 w-full h-14 text-lg font-semibold rounded-xl shadow-lg shadow-brand-600/20 hover:shadow-brand-600/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2"
          size="lg"
          onClick={purchase}
          disabled={isLoading}
        >
          {isLoading ? "處理中..." : "立即購買"}
          <Icon icon={ArrowRight02Icon} className="size-5 translate-y-px" />
        </Button>

        {/* Trust badges */}
        <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-400 flex-wrap">
          <span className="flex items-center gap-1">
            <Icon icon={Tick01Icon} className="size-5" />
            7 天退款保證
          </span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span className="flex items-center gap-1">
            <Icon icon={Tick01Icon} className="size-5" />
            安全付款
          </span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span className="flex items-center gap-1">
            <Icon icon={Tick01Icon} className="size-5" />
            年使用權限
          </span>
        </div>
      </div>
    </div>
  );
}

export { PricingCard };
