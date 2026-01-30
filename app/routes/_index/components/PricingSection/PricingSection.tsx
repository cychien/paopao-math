import { PricingCard } from "./PricingCard";
import { FAQ } from "./FAQ";
import { HelpCircle } from "lucide-react";
import Icon from "~/components/ui/icon";
import { CreditCardIcon } from "@hugeicons/core-free-icons";

function PricingSection() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-white via-gray-50/50 to-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

      {/* Background decorations */}
      {/* <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      <div className="absolute top-1/3 left-0 w-[300px] h-[300px] bg-brand-50/30 rounded-full blur-[100px] -translate-x-1/2" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-gray-100/50 rounded-full blur-[100px] translate-x-1/3" /> */}

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50/70 border border-brand-200/70 mb-6">
            <Icon icon={CreditCardIcon} className="w-4 h-4 text-brand-600" />
            <span className="text-sm font-medium text-brand-700">課程價格</span>
          </div>
          <h2 className="ext-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
            一次付費，可享一年
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-gray-600">
            簡單透明的價格，買斷全年內容與更新
          </p>
        </div>

        {/* Pricing Card & FAQ Section */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-24 max-w-6xl mx-auto items-start">
          {/* Pricing Card */}
          <div>
            <PricingCard />
          </div>

          {/* FAQ Section */}
          <div>
            <div className="text-center lg:text-left mb-8">
              {/* <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-1.5 mb-6">
                <HelpCircle className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-semibold text-gray-700">常見問題</span>
              </div> */}
              <h3 className="text-lg font-semibold text-gray-400/70">
                常見問題
              </h3>
            </div>
            {/* <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8"> */}
            <div>
              <FAQ />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { PricingSection };
