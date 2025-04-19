import { FAQ } from "./FAQ";
import { PricingCard } from "./PricingCard";

function PricingSection() {
  return (
    <section className="bg-bg-secondary py-16 lg:py-24">
      <div className="container mx-auto">
        <h3 className="font-semibold text-text-brand-secondary text-sm lg:text-base">
          收費
        </h3>
        <div className="mt-3 text-3xl lg:text-4xl font-semibold">
          一次付清，永久解鎖
        </div>
        <p className="mt-4 lg:mt-5 text-lg text-text-tertiary">
          只要 <span className="font-inter">NT$4999</span>
          ，一次買斷即可永久觀看全部內容，無須額外訂閱費用
        </p>
        <div className="mt-12 lg:mt-16 lg:flex lg:space-x-16">
          <div className="lg:w-[560px] lg:max-w-[560px] lg:py-8">
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
