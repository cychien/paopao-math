import checkIconSrc from "~/assets/check.svg";
import { Button } from "~/components/ui/Button";

function PricingCard() {
  return (
    <div
      className="p-6 lg:p-8 rounded-2xl bg-bg-primary border border-[rgba(0,0,0,0.08)]"
      style={{
        boxShadow:
          "0px 12px 16px -4px var(--Colors-Effects-Shadows-shadow-lg_01, rgba(10, 13, 18, 0.08)), 0px 4px 6px -2px var(--Colors-Effects-Shadows-shadow-lg_02, rgba(10, 13, 18, 0.03)), 0px 2px 2px -1px var(--Colors-Effects-Shadows-shadow-lg_03, rgba(10, 13, 18, 0.04))",
      }}
    >
      <div className="lg:flex lg:justify-between">
        <div className="lg:hidden font-inter font-semibold space-x-0.5 flex items-start">
          <span className="text-4xl pt-1.5 leading-[44px]">NT$</span>
          <span className="text-5xl leading-[60px]">4999</span>
        </div>
        <div className="mt-4 lg:mt-0">
          <div className="flex space-x-2 items-center">
            <div className="text-xl font-semibold leading-[30px]">
              終身暢學版
            </div>
            <div className="rounded-full bg-[#FEFAF1] border border-[#F7D07D] text-[#825B08] text-sm font-medium py-0.5 px-2.5">
              早鳥價
            </div>
          </div>
          <p className="text-text-tertiary mt-1 lg:mt-0.5">
            永久解鎖全課程與未來功能更新
          </p>
        </div>
        <div className="hidden lg:flex font-inter font-semibold space-x-0.5">
          <span className="text-4xl pt-2 leading-[44px]">NT$</span>
          <span className="text-6xl leading-[72px]">4999</span>
        </div>
      </div>

      <div className="mt-8 mb-8 lg:mt-6 lg:mb-6 h-px bg-border-secondary" />

      <div>
        <div className="font-semibold">解鎖內容</div>
        <div className="mt-6 grid lg:grid-cols-2 lg:gap-x-8 gap-y-4">
          <div className="flex space-x-3 items-center">
            <img
              src={checkIconSrc}
              alt="check icon"
              className="w-6 h-6 flex-shrink-0"
            />
            <span className="text-text-tertiary">獨家重點整理及例題</span>
          </div>
          <div className="flex space-x-3 items-center">
            <img
              src={checkIconSrc}
              alt="check icon"
              className="w-6 h-6 flex-shrink-0"
            />
            <span className="text-text-tertiary">
              <span className="font-inter">200+</span> 精講影片
            </span>
          </div>
          <div className="flex space-x-3 items-center">
            <img
              src={checkIconSrc}
              alt="check icon"
              className="w-6 h-6 flex-shrink-0"
            />
            <span className="text-text-tertiary">題庫持續更新</span>
          </div>
          <div className="flex space-x-3 items-center">
            <img
              src={checkIconSrc}
              alt="check icon"
              className="w-6 h-6 flex-shrink-0"
            />
            <span className="text-text-tertiary">多裝置支援</span>
          </div>
          <div className="flex space-x-3 items-center">
            <img
              src={checkIconSrc}
              alt="check icon"
              className="w-6 h-6 flex-shrink-0"
            />
            <span className="text-text-tertiary">平台功能持續更新</span>
          </div>
        </div>
      </div>

      <div className="mt-8 mb-6 lg:mt-10 lg:mb-8 h-px bg-border-secondary" />

      <Button className="w-full py-3 mb-2">搶先卡位</Button>
    </div>
  );
}

export { PricingCard };
