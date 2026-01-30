import { useState } from "react";
import {
  Award,
  CheckCircle2,
} from "lucide-react";
import Icon from "~/components/ui/icon";
import { Award04Icon, Book02Icon, Calendar01Icon, ChampionIcon, DirectionRight02Icon, NoteIcon, VideoCameraAiIcon } from "@hugeicons/core-free-icons";

function FeaturesSectionNew() {
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const mainFeatures = [
    {
      icon: VideoCameraAiIcon,
      title: "200+ 觀念精講影片",
      description: "兩百餘支短片逐一拆解學測核心觀念與常見題型，每支影片控制在 5–15 分鐘內，專注解決一個關鍵問題。你可以依照自己的進度隨時回放補強。",
      badge: "核心優勢",
      badgeColor: "bg-brand-100 text-brand-700 border-brand-200",
      gradient: "from-brand-50 to-blue-50",
      stats: ["200+ 影片", "5-15 分鐘", "支援離線"],
    },
    {
      icon: Book02Icon,
      title: "實體學習參考書",
      description: "根據多年教學與考試經驗編寫，書中完整收錄必考題型與代表例題，讓你在離線學習時，也能掌握考試真正關心的方向。",
      badge: "實體教材",
      badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
      gradient: "from-purple-50 to-pink-50",
      stats: ["完整講義", "重點統整", "隨書附贈"],
    },
    {
      icon: NoteIcon,
      title: "好題分享",
      description: "不定期挑選具代表性的好題進行解析，透過這些題目，你能更清楚分辨「已理解」與「只是看過」，避免在考前留下模糊地帶。",
      badge: "持續更新",
      badgeColor: "bg-green-100 text-green-700 border-green-200",
      gradient: "from-green-50 to-emerald-50",
      stats: ["模擬試題", "歷屆考題", "即時批改"],
    },
    {
      icon: Calendar01Icon,
      title: "學習進度規劃表",
      description: "依照學測時程與學習節奏設計的進度規劃，幫助你清楚知道現在該做什麼、接下來該補哪裡，讓準備過程不再被時間焦慮牽著走。",
    },
    {
      icon: DirectionRight02Icon,
      title: "考點對照與學習指引",
      description: "每個章節與題型皆清楚標示對應的學測考點，協助你理解「為什麼這裡重要」，能依照清楚的指引，有策略地安排複習重點。",
    },
    {
      icon: ChampionIcon,
      title: "考前衝刺秘笈",
      description: "於考前階段提供多回完整模擬測驗，協助你在接近正式考試的情境下檢視整體準備狀況。並附有詳解，助你及早發現、補強盲區。",
    }
  ];


  const comparisonData = [
    { feature: "觀念精講影片", us: "200+", traditional: "0", online: "50-100" },
    { feature: "實體參考書", us: "✓", traditional: "需額外購買", online: "✗" },
    { feature: "模擬測驗", us: "持續更新", traditional: "有限", online: "有限" },
    { feature: "問答服務", us: "✓", traditional: "課堂限定", online: "✗" },
    { feature: "學習彈性", us: "隨時隨地", traditional: "固定時間", online: "有限" },
    { feature: "總費用", us: "NT$4,995", traditional: "NT$30,000+", online: "NT$8,000+" },
  ];

  return (
    <section id="features" className="py-20 lg:py-32 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-brand-100/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-0 w-[350px] h-[350px] bg-blue-100/20 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="mb-16 text-center">
          {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-200 mb-6">
            <Target className="w-4 h-4 text-brand-600" />
            <span className="text-sm font-bold text-brand-700">完整學習方案</span>
          </div> */}

          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            從理解到實戰的複習方案
          </h2>

          <p className="text-lg text-gray-600 leading-[1.7] max-w-xl mx-auto">
            我們精心安排了一套完整的總複習規劃與教材，
            不必擔心基礎不扎實、範圍太廣，跟隨我們的腳步，一步步掌握學測數學
          </p>
        </div>

        {/* Main Features - 3 Column Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto">
          {mainFeatures.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 border-2 border-gray-200/70"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`} />

              {/* Badge */}
              {/* <div className="mb-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${feature.badgeColor}`}>
                  <Award className="w-3.5 h-3.5" />
                  {feature.badge}
                </span>
              </div> */}

              {/* Icon */}
              <div className={`inline-flex items-center justify-center size-14 rounded-lg mb-6 bg-brand-25`}>
                <Icon icon={feature.icon} className="size-7 text-brand-600" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-[1.7]">{feature.description}</p>

              {/* Stats */}
              {/* <div className="flex flex-wrap gap-2">
                {feature.stats.map((stat, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                    {stat}
                  </span>
                ))}
              </div> */}
            </div>


          ))}
        </div>

        {/* <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {additionalFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-gray-200 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-100/20 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-brand-100 group-hover:text-brand-600 transition-colors duration-300">
                <Icon icon={feature.icon} className="size-6 text-gray-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">{feature.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div> */}

        {/* Additional Features Grid */}
        {/* <div className="mb-20">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">更多貼心服務</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {additionalFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-gray-200 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-100/20 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-brand-100 group-hover:text-brand-600 transition-colors duration-300">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div> */}

        {/* Comparison Table */}
        {/* <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <button
              onClick={() => setIsComparisonOpen(!isComparisonOpen)}
              className="inline-flex items-center gap-2 group underline underline-offset-3 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <div>為什麼選擇我們？</div>
            </button>
          </div>

          <div
            className={`overflow-hidden ${isComparisonOpen
              ? "max-h-[1000px] opacity-100 transition-[max-height,opacity] duration-700 ease-out-cubic"
              : "max-h-0 opacity-0"
              }`}
          >
            <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900"></th>
                      <th className="px-6 py-4 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white">
                          <Icon icon={Award04Icon} className="w-4 h-4" />
                          <span className="font-semibold">寶哥高中數學</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-center font-medium text-gray-600">傳統補習班</th>
                      <th className="px-6 py-4 text-center font-medium text-gray-600">一般線上課程</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {comparisonData.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.feature}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700 font-bold text-sm">
                            {row.us === "✓" ? <CheckCircle2 className="w-4 h-4" /> : null}
                            {row.us}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">{row.traditional}</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">{row.online}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}

export { FeaturesSectionNew };
