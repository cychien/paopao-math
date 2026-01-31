import { Link } from "react-router";
import { Button } from "~/components/ui/Button";
import { ArrowRight, Sparkles } from "lucide-react";

function CallToActionSection() {
  return (
    <section className="px-4 py-6 md:px-6 lg:px-8">
      <div className="relative rounded-3xl lg:rounded-[2.5rem] bg-gradient-to-br from-brand-900 via-brand-900 to-brand-800 overflow-hidden isolate">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative px-6 py-20 sm:px-12 sm:py-28 lg:px-20 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span className="text-sm font-medium text-white/90">限時早鳥優惠中</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
              準備好迎戰學測了嗎？
            </h2>
            <p className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-400">
              立即加入，開啟高分之路
            </p>

            {/* Description */}
            <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-gray-300">
              馬上開始系統複習，持續獲得練習題，穩步提升應考實力。
              <br className="hidden sm:inline" />
              錯過這次，可能就要花更多時間自己摸索。
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/purchase" className="focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 rounded-xl">
                <Button
                  size="lg"
                  className="h-14 px-8! text-base font-bold rounded-xl bg-white text-gray-900 hover:bg-gray-100 shadow-xl shadow-black/20 hover:-translate-y-0.5 transition-all duration-200"
                >
                  立即購買課程
                  <ArrowRight className="w-5 h-5 ml-1" />
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
            <div className="mt-12 pt-8 border-t border-white/10">
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  7 天無條件退款
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  一次購買終身使用
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  持續更新內容
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { CallToActionSection };