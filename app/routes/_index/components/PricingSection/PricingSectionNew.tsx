import { Button } from "~/components/ui/Button";
import { Link } from "react-router";
import {
  Check,
  X,
  Sparkles,
  BookOpen,
  Video,
  FileText,
  HelpCircle,
  ClipboardCheck,
  Shield,
  Clock,
  Award,
  Zap,
  TrendingUp,
} from "lucide-react";
import { useState, useEffect } from "react";

function PricingSectionNew() {
  const [timeLeft, setTimeLeft] = useState({
    days: 7,
    hours: 0,
    minutes: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 7);
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
        });
      }
    };

    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, []);

  const features = [
    { icon: BookOpen, text: "完整總複習課程", highlight: false },
    { icon: BookOpen, text: "實體學習參考書", highlight: false },
    { icon: Video, text: "超過 200 部詳解影片", highlight: true },
    { icon: ClipboardCheck, text: "定期模擬測驗", highlight: false },
    { icon: FileText, text: "歷屆大考試題及講解", highlight: false },
    { icon: HelpCircle, text: "問答專區解惑", highlight: false },
  ];

  const comparison = [
    {
      feature: "觀念影片",
      us: "200+ 部",
      traditional: "課堂限定",
      online: "50-100 部",
    },
    {
      feature: "實體教材",
      us: true,
      traditional: "需額外購買",
      online: false,
    },
    {
      feature: "模擬測驗",
      us: "持續更新",
      traditional: "有限",
      online: "有限",
    },
    {
      feature: "學習彈性",
      us: "隨時隨地",
      traditional: "固定時間",
      online: "限期觀看",
    },
    {
      feature: "價格",
      us: "NT$4,995",
      traditional: "NT$30,000+",
      online: "NT$8,000+",
    },
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: "平均提升 4.2 級分",
      description: "學生實證成效",
    },
    {
      icon: Shield,
      title: "7 天退款保證",
      description: "不滿意全額退費",
    },
    {
      icon: Zap,
      title: "終身使用權限",
      description: "一次購買永久使用",
    },
  ];

  return (
    <section id="pricing" className="py-20 lg:py-32 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-100/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-orange-100/20 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-200 mb-6">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-bold text-orange-700">限時早鳥優惠</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            一次購買
            <span className="text-brand-600"> 終身受益</span>
          </h2>

          <p className="text-lg text-gray-600 leading-relaxed">
            比傳統補習班更彈性，比一般線上課程更完整。
            <br className="hidden sm:inline" />
            現在加入享早鳥優惠，省下 NT$3,004。
          </p>
        </div>

        {/* Main Pricing Card with Countdown */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-400 via-orange-400 to-brand-400 rounded-[2.5rem] blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

            <div className="relative bg-white rounded-[2rem] border-2 border-gray-200 overflow-hidden shadow-2xl">
              {/* Countdown Banner */}
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-white">
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6" />
                    <div>
                      <div className="text-sm font-semibold uppercase tracking-wide">早鳥優惠倒數</div>
                      <div className="text-xs opacity-90">把握機會，限時優惠即將結束</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 min-w-[70px] text-center">
                        <div className="text-2xl font-bold tabular-nums">{timeLeft.days}</div>
                        <div className="text-xs font-medium opacity-90">天</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 min-w-[70px] text-center">
                        <div className="text-2xl font-bold tabular-nums">{String(timeLeft.hours).padStart(2, '0')}</div>
                        <div className="text-xs font-medium opacity-90">時</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 min-w-[70px] text-center">
                        <div className="text-2xl font-bold tabular-nums">{String(timeLeft.minutes).padStart(2, '0')}</div>
                        <div className="text-xs font-medium opacity-90">分</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Content */}
              <div className="p-8 lg:p-12">
                <div className="grid lg:grid-cols-[1.5fr_1fr] gap-12">
                  {/* Left Side - Features */}
                  <div>
                    {/* Header */}
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 text-amber-700 text-sm font-bold py-2 px-4">
                          <Sparkles className="w-4 h-4" />
                          早鳥限定
                        </span>
                        <span className="text-lg font-bold text-orange-600">省 NT$3,004</span>
                      </div>

                      <h3 className="text-3xl font-bold text-gray-900 mb-2">學測數學總複習班</h3>
                      <p className="text-gray-600">完整課程 + 實體教材 + 終身更新</p>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3 mb-8">
                      <div className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">完整包含</div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {features.map((feature, index) => (
                          <div
                            key={index}
                            className={`flex items-center gap-3 p-4 rounded-xl transition-all ${feature.highlight
                                ? "bg-brand-50 border-2 border-brand-200"
                                : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                              }`}
                          >
                            <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${feature.highlight ? "bg-brand-100" : "bg-white"
                              }`}>
                              <feature.icon className={`w-5 h-5 ${feature.highlight ? "text-brand-600" : "text-gray-600"}`} />
                            </div>
                            <span className={`text-sm font-semibold ${feature.highlight ? "text-brand-700" : "text-gray-700"}`}>
                              {feature.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className="grid sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                      {benefits.map((benefit, index) => (
                        <div key={index} className="text-center">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-100 text-green-600 mb-3">
                            <benefit.icon className="w-6 h-6" />
                          </div>
                          <div className="text-sm font-bold text-gray-900 mb-1">{benefit.title}</div>
                          <div className="text-xs text-gray-600">{benefit.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Side - Price & CTA */}
                  <div className="lg:border-l lg:border-gray-200 lg:pl-12 flex flex-col justify-center">
                    <div className="space-y-8">
                      {/* Pricing */}
                      <div>
                        <div className="text-sm text-gray-500 mb-2">原價</div>
                        <div className="text-2xl text-gray-400 line-through font-semibold mb-4">NT$ 7,999</div>

                        <div className="text-sm font-bold text-orange-600 uppercase tracking-wide mb-2">早鳥優惠價</div>
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-5xl font-bold text-gray-900">NT$ 4,995</span>
                        </div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 border border-green-200">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-bold text-green-700">立即省下 NT$ 3,004</span>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <Link to="/purchase" className="block focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2 rounded-2xl">
                        <Button className="w-full h-16 text-xl font-bold rounded-2xl shadow-xl shadow-brand-600/30 hover:shadow-2xl hover:shadow-brand-600/40 hover:-translate-y-1 transition-all duration-200" size="lg">
                          立即購買課程
                          <svg className="w-6 h-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </Button>
                      </Link>

                      {/* Trust Badges */}
                      <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span>7 天無條件退款保證</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span>一次購買終身使用</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span>持續更新課程內容</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span>安全付款機制</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">與其他方案比較</h3>
            <p className="text-gray-600">看看我們如何提供更好的價值</p>
          </div>

          <div className="bg-white rounded-3xl border-2 border-gray-200 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b-2 border-gray-200">
                    <th className="px-6 py-5 text-left text-base font-bold text-gray-900">比較項目</th>
                    <th className="px-6 py-5 text-center">
                      <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-600/30">
                        <Award className="w-5 h-5" />
                        <span className="font-bold text-base">寶哥高中數學</span>
                      </div>
                    </th>
                    <th className="px-6 py-5 text-center text-base font-semibold text-gray-600">傳統補習班</th>
                    <th className="px-6 py-5 text-center text-base font-semibold text-gray-600">一般線上課程</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {comparison.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-5 text-base font-semibold text-gray-900">{row.feature}</td>
                      <td className="px-6 py-5 text-center">
                        {typeof row.us === 'boolean' ? (
                          row.us ? (
                            <Check className="w-6 h-6 text-green-600 mx-auto" />
                          ) : (
                            <X className="w-6 h-6 text-gray-300 mx-auto" />
                          )
                        ) : (
                          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-50 text-brand-700 font-bold">
                            {row.us}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-center text-gray-600">
                        {typeof row.traditional === 'boolean' ? (
                          row.traditional ? (
                            <Check className="w-6 h-6 text-green-600 mx-auto" />
                          ) : (
                            <X className="w-6 h-6 text-gray-300 mx-auto" />
                          )
                        ) : (
                          row.traditional
                        )}
                      </td>
                      <td className="px-6 py-5 text-center text-gray-600">
                        {typeof row.online === 'boolean' ? (
                          row.online ? (
                            <Check className="w-6 h-6 text-green-600 mx-auto" />
                          ) : (
                            <X className="w-6 h-6 text-gray-300 mx-auto" />
                          )
                        ) : (
                          row.online
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { PricingSectionNew };
