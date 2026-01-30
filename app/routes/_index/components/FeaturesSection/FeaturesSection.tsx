import { BookOpen, Play, ClipboardCheck, Sparkles, Check } from "lucide-react";

function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-brand-50/50 rounded-full blur-[100px] -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-gray-100/80 rounded-full blur-[80px] translate-x-1/4" />
      </div>

      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-14 lg:mb-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 mb-6">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span className="text-sm font-semibold text-brand-700">課程特色</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            你唯一需要的總複習教材
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-gray-600">
            用更彈性的時間與更少的費用，搞懂更多觀念，拿到更高分數。
            <br className="hidden sm:inline" />
            我們專注於提供最實質的幫助，拒絕無效刷題。
          </p>
        </div>

        {/* Feature Cards - Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-5 max-w-6xl mx-auto">

          {/* Card 1: Core Value - Large */}
          <div className="md:col-span-4 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100/50 p-8 lg:p-10 border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-brand-100/40 to-transparent rounded-full blur-3xl -mr-20 -mt-20 group-hover:from-brand-200/50 transition-colors duration-500" />
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-sm border border-gray-100 text-brand-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">重點觀念 + 秒懂例題</h3>
              <p className="text-gray-600 leading-relaxed text-lg max-w-xl">
                必考觀念全面統整，高頻題型逐步拆解。我們不教死背公式，而是帶你理解核心解題思路與應試技巧，讓你看到題目就知道如何下手。
              </p>
              {/* Visual element */}
              <div className="mt-8 flex gap-3">
                {["觀念統整", "題型分析", "解題技巧"].map((tag) => (
                  <span key={tag} className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-600">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Video - Dark */}
          <div className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 lg:p-10 text-white hover:shadow-xl hover:shadow-gray-900/30 transition-all duration-300">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_50%)]" />
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-gray-900/80 to-transparent" />
            <div className="relative z-10 h-full flex flex-col">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 text-white mb-6 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                <Play className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3">200+ 精講影片</h3>
              <p className="text-gray-300 leading-relaxed flex-1">
                兩百餘支短片逐題解析，隨時回放強化觀念。
              </p>
              <div className="mt-6 pt-4 border-t border-white/10">
                <span className="text-4xl font-bold text-brand-300">200+</span>
                <span className="text-gray-400 ml-2">部影片</span>
              </div>
            </div>
          </div>

          {/* Card 3: Practice */}
          <div className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-white p-8 lg:p-10 border border-gray-100 hover:border-brand-100 shadow-sm hover:shadow-xl hover:shadow-brand-100/30 transition-all duration-300">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 mb-6 group-hover:scale-110 group-hover:bg-brand-100 transition-all duration-300">
              <ClipboardCheck className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">模擬測驗</h3>
            <p className="text-gray-600 leading-relaxed">
              全真模考 + 重點題庫不定期推送，隨時演練考場實戰。
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-brand-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
              持續更新中
            </div>
          </div>

          {/* Card 4: Price & Value */}
          <div className="md:col-span-4 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-50 to-brand-100/30 p-8 lg:p-10 border border-brand-100 hover:border-brand-200 transition-all duration-300 hover:shadow-xl hover:shadow-brand-100/50">
            <div className="grid md:grid-cols-2 gap-8 items-center h-full">
              <div>
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white text-brand-600 mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">更省的價格，更完整的學習</h3>
                <p className="text-gray-600 leading-relaxed">
                  不需花上萬元補習，一樣從頭到尾完整複習，知識一次打包帶走。
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-100/50">
                <ul className="space-y-4">
                  {[
                    "隨時隨地自主學習",
                    "名師親授，權威可靠",
                    "支援手機、平板與電腦",
                    "自訂進度，高效複習"
                  ].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm font-medium text-gray-700">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center">
                        <Check className="w-3 h-3 text-brand-600" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export { FeaturesSection };