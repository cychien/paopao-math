import checkIconSrc from "~/assets/check.svg";
import { Button } from "~/components/ui/Button";
import { Link } from "@remix-run/react";

function PricingCard() {
  return (
    <div
      className="p-6 lg:p-8 rounded-2xl bg-bg-primary border border-[rgba(0,0,0,0.08)]"
      style={{
        boxShadow:
          "0px 12px 16px -4px var(--Colors-Effects-Shadows-shadow-lg_01, rgba(10, 13, 18, 0.08)), 0px 4px 6px -2px var(--Colors-Effects-Shadows-shadow-lg_02, rgba(10, 13, 18, 0.03)), 0px 2px 2px -1px var(--Colors-Effects-Shadows-shadow-lg_03, rgba(10, 13, 18, 0.04))",
      }}
    >
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="block lg:hidden">
          <div className="lg:hidden font-inter font-semibold space-x-0.5 flex items-start">
            <span className="text-4xl pt-1.5 leading-[44px]">NT$</span>
            <span className="text-5xl leading-[60px]">4,995</span>
          </div>
          <div className="text-gray-600 -translate-y-1 line-through">
            NT$ 7,999
          </div>
        </div>
        <div className="mt-4 lg:mt-0">
          <div className="flex space-x-2 items-center">
            <div className="text-xl font-semibold leading-[30px]">
              學測總複習班
            </div>
            <div className="rounded-full bg-[#FEFAF1] border border-[#F7D07D] text-[#825B08] text-sm font-medium py-0.5 px-2.5">
              早鳥價
            </div>
          </div>
          <p className="text-text-tertiary mt-1 lg:mt-0.5">
            解鎖全課程與未來功能更新
          </p>
        </div>
        <div className="hidden lg:block">
          <div className="flex font-inter font-semibold space-x-0.5">
            <span className="text-4xl pt-2 leading-[44px]">NT$</span>
            <span className="text-6xl leading-[72px]">4,995</span>
          </div>
          <div className="text-gray-600 text-right -translate-y-1 line-through">
            NT$ 7,999
          </div>
        </div>
      </div>

      <div className="-mx-6 lg:-mx-8 mt-8 mb-8 lg:mt-6 lg:mb-6 h-px bg-border-secondary" />

      <div>
        <div className="font-semibold">解鎖內容</div>
        <div className="mt-6 grid lg:grid-cols-2 lg:gap-x-8 gap-y-4">
          <div className="flex space-x-3 items-center">
            <img
              src={checkIconSrc}
              alt="check icon"
              className="w-6 h-6 flex-shrink-0"
            />
            <span className="text-text-tertiary">完整總複習課程</span>
          </div>
          <div className="flex space-x-3 items-center">
            <img
              src={checkIconSrc}
              alt="check icon"
              className="w-6 h-6 flex-shrink-0"
            />
            <span className="text-text-tertiary">實體學習參考書</span>
          </div>
          <div className="flex space-x-3 items-center">
            <img
              src={checkIconSrc}
              alt="check icon"
              className="w-6 h-6 flex-shrink-0"
            />
            <span className="text-text-tertiary">定期模擬測驗</span>
          </div>
          <div className="flex space-x-3 items-center">
            <img
              src={checkIconSrc}
              alt="check icon"
              className="w-6 h-6 flex-shrink-0"
            />
            <span className="text-text-tertiary">歷屆大考試題及講解</span>
          </div>
          <div className="flex space-x-3 items-center">
            <img
              src={checkIconSrc}
              alt="check icon"
              className="w-6 h-6 flex-shrink-0"
            />
            <span className="text-text-tertiary">問答專區解惑</span>
          </div>
          <div className="flex space-x-3 items-center">
            <img
              src={checkIconSrc}
              alt="check icon"
              className="w-6 h-6 flex-shrink-0"
            />
            <span className="text-text-tertiary">
              超過 <span className="font-inter">200</span> 部詳解影片
            </span>
          </div>
        </div>
      </div>

      <div className="-mx-6 lg:-mx-8 mt-8 mb-6 lg:mt-10 lg:mb-8 h-px bg-border-secondary" />

      <Link to="/purchase">
        <Button className="w-full py-3 h-12 text-base" size="lg">
          立即購買
        </Button>
      </Link>
    </div>
  );
}

export { PricingCard };
