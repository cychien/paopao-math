import { Link } from "react-router";
import { Button } from "~/components/ui/Button";
import { BookOpen, Play, Users, Award, Clock, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

function HeroSection() {
  // Countdown timer for early bird offer (example: 7 days from now)
  const [timeLeft, setTimeLeft] = useState({
    days: 7,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Set target date (example: 7 days from now)
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 7);

      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-gradient-to-b from-gray-50 via-white to-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-100/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/20 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 pt-20 pb-16 lg:pt-28 lg:pb-24">
        {/* Early Bird Badge */}
        <div className="flex justify-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 shadow-sm">
            <Clock className="w-4 h-4 text-orange-600 animate-pulse" />
            <span className="text-sm font-bold text-orange-700">早鳥限定優惠</span>
            <span className="text-xs text-orange-600 font-medium">省 NT$3,004</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">

          {/* Left Column - Value Proposition */}
          <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700 delay-150">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                30 年教學精華
                <span className="block text-brand-600 mt-2">一次掌握學測數學</span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                多年暢銷參考書作者親授，200+ 觀念精講影片，系統化重點統整，助你在最短時間內突破學測難關。
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/purchase" className="focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2 rounded-xl">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-14 px-8 text-lg font-bold rounded-xl shadow-xl shadow-brand-600/30 hover:shadow-2xl hover:shadow-brand-600/40 hover:-translate-y-1 transition-all duration-200"
                >
                  立即購買課程
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>

              <Link to="/learn/preview" className="focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 rounded-xl">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-14 px-8 text-lg font-semibold rounded-xl border-2 hover:bg-gray-50 transition-all duration-200"
                >
                  免費試讀
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-gray-600">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">7 天退款保證</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">終身使用權限</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">持續更新內容</span>
              </div>
            </div>
          </div>

          {/* Right Column - Stats Bento Grid */}
          <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-8 duration-700 delay-300">

            {/* Countdown Timer Card - Spans 2 columns */}
            <div className="col-span-2 bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl p-8 text-white shadow-2xl shadow-orange-500/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm font-semibold uppercase tracking-wide">早鳥優惠倒數</span>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { value: timeLeft.days, label: '天' },
                    { value: timeLeft.hours, label: '時' },
                    { value: timeLeft.minutes, label: '分' },
                    { value: timeLeft.seconds, label: '秒' },
                  ].map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 mb-1">
                        <div className="text-3xl font-bold tabular-nums">{String(item.value).padStart(2, '0')}</div>
                      </div>
                      <div className="text-xs font-medium opacity-90">{item.label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">原價 NT$7,999</span>
                  <span className="text-2xl font-bold">NT$4,995</span>
                </div>
              </div>
            </div>

            {/* Stat Card 1 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-100/50 transition-all duration-300 cursor-pointer group">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-100 text-brand-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">30+</div>
              <div className="text-sm font-medium text-gray-600">年教學經驗</div>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-100/50 transition-all duration-300 cursor-pointer group">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                <Play className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">200+</div>
              <div className="text-sm font-medium text-gray-600">精講影片</div>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-100/50 transition-all duration-300 cursor-pointer group">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-100 text-green-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">完整</div>
              <div className="text-sm font-medium text-gray-600">實體參考書</div>
            </div>

            {/* Stat Card 4 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-100/50 transition-all duration-300 cursor-pointer group">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-100 text-purple-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">5.0</div>
              <div className="text-sm font-medium text-gray-600">學生好評</div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export { HeroSection };
