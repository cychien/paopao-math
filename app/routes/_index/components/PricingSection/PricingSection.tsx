import { FAQ } from "./FAQ";
import { PricingCard } from "./PricingCard";

function PricingSection() {
  return (
    <section className="bg-bg-secondary py-16 lg:py-24">
      <div className="container mx-auto">
        <h3 className="font-semibold text-brand-500 text-sm lg:text-base">
          收費
        </h3>
        <div className="mt-3 text-3xl lg:text-4xl font-semibold">
          年費買斷，全年暢學與持續更新
        </div>
        <p className="mt-4 lg:mt-5 text-lg text-text-tertiary">
          只要 <span className="font-inter">NT$4,995</span> /年 ，買斷全年內容 +
          更新，無需額外訂閱
        </p>
        <div className="mt-12 lg:mt-16 lg:flex lg:space-x-16">
          <div className="lg:w-[400px] lg:max-w-[400px] xl:w-[560px] xl:max-w-[560px] lg:py-8">
            <FAQ />
          </div>
          <div className="flex-1 mt-12 lg:mt-0">
            <PricingCard />
          </div>
        </div>
      </div>
    </section>
  );
}

export { PricingSection };
