import { XCircle, AlertCircle, HelpCircle } from "lucide-react";

export function PainPointsSection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-white">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      <div className="absolute -left-[10%] top-[20%] w-[40%] h-[40%] bg-gray-50 rounded-full blur-[120px] -z-10 opacity-60" />
      <div className="absolute -right-[10%] bottom-[20%] w-[40%] h-[40%] bg-brand-50 rounded-full blur-[120px] -z-10 opacity-40" />
      
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center space-y-16">
          
          {/* Header Title */}
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
              不是你不夠努力，
              <br className="hidden sm:block" />
              <span className="text-brand-600 relative inline-block">
                是沒有人幫你把重點整理好
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-brand-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h2>
          </div>

          {/* Pain Points Cards */}
          <div className="grid gap-6 md:grid-cols-3">
             {/* Card 1 */}
             <div className="group relative p-8 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1">
                <div className="mx-auto mb-6 w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform duration-300">
                  <XCircle className="w-7 h-7" />
                </div>
                <p className="text-lg text-gray-700 font-medium leading-relaxed">
                  每一章都看過，<br/>但題目一變就不會
                </p>
             </div>

             {/* Card 2 */}
             <div className="group relative p-8 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1">
                <div className="mx-auto mb-6 w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform duration-300">
                  <HelpCircle className="w-7 h-7" />
                </div>
                <p className="text-lg text-gray-700 font-medium leading-relaxed">
                  花很多時間複習，<br/>卻不知道哪些真的會考
                </p>
             </div>

             {/* Card 3 */}
             <div className="group relative p-8 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1">
                <div className="mx-auto mb-6 w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform duration-300">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <p className="text-lg text-gray-700 font-medium leading-relaxed">
                  解題時只記公式，<br/>卻不懂為什麼要這樣用
                </p>
             </div>
          </div>

          {/* Solution Statement */}
          <div className="relative py-10 px-6 rounded-3xl bg-gray-50 border border-gray-100 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
             <p className="text-xl md:text-2xl font-medium text-gray-900 leading-relaxed">
               問題不在你，而是缺少一套幫你
               <span className="block mt-4 md:mt-2 md:inline font-bold text-brand-700">
                 「統整觀念 → 對應題型 → 下手解題」
               </span>
               <span className="block mt-2 md:mt-0 md:inline">的方法。</span>
             </p>
          </div>

        </div>
      </div>
    </section>
  );
}
