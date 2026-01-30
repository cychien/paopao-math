import { Star, TrendingUp, Award, Users } from "lucide-react";

function SocialProofSection() {
  const testimonials = [
    {
      name: "王小明",
      school: "建國中學",
      score: "15 級分",
      improvement: "+5 級分",
      text: "寶哥的教學讓我真正理解了數學的核心觀念，不再只是死記公式。從 10 級分進步到 15 級分，順利申請上台大！",
      avatar: "bg-gradient-to-br from-blue-400 to-blue-600",
    },
    {
      name: "林怡君",
      school: "北一女中",
      score: "14 級分",
      improvement: "+4 級分",
      text: "課程內容非常系統化，每個單元都有清楚的解題步驟。影片可以重複觀看，讓我在考前完整複習所有重點。",
      avatar: "bg-gradient-to-br from-purple-400 to-purple-600",
    },
    {
      name: "陳大華",
      school: "師大附中",
      score: "13 級分",
      improvement: "+6 級分",
      text: "原本數學是我最弱的科目，透過寶哥的課程，我找到了學習數學的方法。模擬測驗也幫助我掌握考試節奏。",
      avatar: "bg-gradient-to-br from-green-400 to-green-600",
    },
  ];

  const stats = [
    {
      icon: TrendingUp,
      value: "平均提升 4.2 級分",
      label: "學生成績進步",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: Users,
      value: "5,000+",
      label: "累積學生數",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Award,
      value: "98%",
      label: "學生推薦率",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: Star,
      value: "5.0 / 5.0",
      label: "平均評分",
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-200 mb-6">
            <Star className="w-4 h-4 text-brand-600" />
            <span className="text-sm font-bold text-brand-700">學生實證成果</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            數千位學生的
            <span className="text-brand-600"> 成功見證</span>
          </h2>

          <p className="text-lg text-gray-600 leading-relaxed">
            每年幫助數千名學生突破學測數學瓶頸，平均提升 4.2 級分。
            <br className="hidden sm:inline" />
            看看他們如何透過我們的課程，實現理想大學夢想。
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-100/30 transition-all duration-300 cursor-pointer group"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${stat.bgColor} ${stat.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-brand-300 hover:shadow-2xl hover:shadow-brand-100/40 transition-all duration-300 cursor-pointer"
            >
              {/* Rating Stars */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 leading-relaxed mb-6 line-clamp-4 group-hover:line-clamp-none transition-all duration-300">
                "{testimonial.text}"
              </p>

              {/* Student Info */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                {/* Avatar */}
                <div className={`flex-shrink-0 w-14 h-14 rounded-full ${testimonial.avatar} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                  {testimonial.name.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.school}</div>
                </div>

                {/* Score Badge */}
                <div className="flex-shrink-0 text-right">
                  <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                    <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-xs font-bold text-green-700">{testimonial.improvement}</span>
                  </div>
                  <div className="text-2xl font-bold text-brand-600 mt-1">{testimonial.score}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
            <Award className="w-6 h-6 text-brand-600" />
            <span className="text-sm font-semibold text-gray-700">
              已幫助 <span className="text-brand-600 font-bold">5,000+</span> 位學生達成目標
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export { SocialProofSection };
