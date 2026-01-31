import { Link } from "react-router";
import { Button } from "~/components/ui/Button";
import { ArrowRight, Sparkles, CheckCircle2, TrendingUp, Shield, Zap } from "lucide-react";

function CallToActionSectionNew() {
  return (
    <section className="py-16 lg:py-20 bg-[#fbfcfe] relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-100 to-transparent" />
      <div className="container mx-auto px-6">
        <div className="relative rounded-[2.5rem] bg-gradient-to-br from-brand-900 via-brand-900 to-brand-800 overflow-hidden isolate shadow-2xl">
          {/* Background decorations */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.2),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.15),transparent_50%)]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

          {/* Content */}
          <div className="relative px-8 py-16 sm:px-12 sm:py-20 lg:px-20 lg:py-24">
            <div className="max-w-4xl mx-auto">
              {/* Badge */}
              {/* <div className="flex justify-center mb-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-2.5">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-bold text-white">限時早鳥優惠中 • 省 NT$3,004</span>
                </div>
              </div> */}

              {/* Heading */}
              <div className="text-center space-y-6 mb-12">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  準備好迎戰學測了嗎？
                </h2>
                <p className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-100 to-brand-200">
                  立即加入，開啟高分之路
                </p>
                {/* <p className="text-lg text-brand-300 leading-relaxed max-w-2xl mx-auto">
                  馬上開始系統複習，持續獲得練習題，穩步提升應考實力。
                  <br className="hidden sm:inline" />
                  超過 5,000 名學生已經透過我們的課程達成目標。
                </p> */}
              </div>

              {/* Quick Benefits */}
              {/* <div className="grid sm:grid-cols-3 gap-4 mb-12">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-white font-bold text-sm">平均提升</div>
                    <div className="text-green-400 font-bold text-lg">4.2 級分</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Shield className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-white font-bold text-sm">退款保證</div>
                    <div className="text-blue-400 font-bold text-lg">7 天內</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Zap className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-white font-bold text-sm">使用權限</div>
                    <div className="text-purple-400 font-bold text-lg">終身</div>
                  </div>
                </div>
              </div> */}

              {/* CTA Buttons */}
              {/* <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                <Link to="/purchase" className="w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 rounded-2xl">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto h-16 px-10 text-xl font-bold rounded-2xl bg-white text-gray-900 hover:bg-gray-100 shadow-2xl shadow-black/30 hover:-translate-y-1 transition-all duration-200"
                  >
                    立即購買課程
                    <ArrowRight className="w-6 h-6 ml-2" />
                  </Button>
                </Link>

                <Link
                  to="/course/content"
                  className="group flex items-center gap-2 text-base font-bold text-white/90 hover:text-white transition-colors py-4 px-6"
                >
                  先試讀免費內容
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div> */}
              <div className="my-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/purchase" className="focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 rounded-xl">
                  <Button
                    size="lg"
                    className="h-14 px-8! text-base font-bold rounded-xl bg-white text-gray-900 hover:bg-gray-100 shadow-xl shadow-black/20 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    立即購買課程
                    <ArrowRight className="size-5 ml-1" />
                  </Button>
                </Link>
                <Link
                  to="/learn/preview"
                  className="group flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition-colors py-3 px-4"
                >
                  查看課程大綱
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="pt-10 border-t border-white/10">
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                  <div className="flex items-center gap-2 text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-sm font-medium">7 天無條件退款</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-sm font-medium">一次購買終身使用</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-sm font-medium">持續更新內容</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-sm font-medium">安全付款機制</span>
                  </div>
                </div>
              </div>

              {/* Social Proof */}
              {/* <div className="mt-10 text-center">
                <p className="text-sm text-gray-400">
                  已有 <span className="text-white font-bold">5,000+</span> 位學生加入，平均評分{" "}
                  <span className="text-amber-400 font-bold">5.0 / 5.0</span>
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { CallToActionSectionNew };
