import { Image } from "~/components/ui/image";
import { Award, BookOpen, FileText, GraduationCap, Medal, Star, Users, CheckCircle2 } from "lucide-react";
import { FileEditIcon, LibraryIcon, UserMultipleIcon } from "@hugeicons/core-free-icons";
import Icon from "~/components/ui/icon";
import logoSrc from "~/assets/logo.png";

function TeacherSectionNew() {
  const credentials = [
    {
      icon: GraduationCap,
      title: "30+ 年教學經驗",
      description: "台北市知名高中數學教師",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: BookOpen,
      title: "暢銷參考書作者",
      description: "多本高中數學總複習教材編著",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: FileText,
      title: "命題審題專家",
      description: "模擬試題與段考命題經驗豐富",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Medal,
      title: "學測趨勢掌握",
      description: "深入研究歷年大考命題方向",
      color: "bg-amber-100 text-amber-600",
    },
  ];

  const achievements = [
    "台灣師範大學數學系碩士",
    "台北市優良教師獎",
    "編著多本暢銷參考書（累計銷售 10 萬冊以上）",
    "指導學生考取台清交成醫科逾百人",
    "YouTube 教學頻道訂閱破萬",
    "學生平均提升 4.2 級分",
  ];

  const books = [
    {
      title: "高中數學總複習",
      publisher: "龍騰文化",
      year: "2024",
      sales: "50,000+",
    },
    {
      title: "學測數學攻略",
      publisher: "翰林出版",
      year: "2023",
      sales: "35,000+",
    },
    {
      title: "數學一點通",
      publisher: "南一書局",
      year: "2022",
      sales: "25,000+",
    },
  ];

  return (
    <section className="py-20 lg:py-24 relative overflow-hidden bg-[#fbfcfe]">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-purple-100/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-[350px] h-[350px] bg-blue-100/20 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50/70 border border-brand-200/70 mb-6">
            <Icon icon={UserMultipleIcon} className="w-4 h-4 text-brand-600" />
            <span className="text-sm font-medium text-brand-700">關於講師</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            名師親授
            <span className="text-brand-600"> 三十年教學結晶</span>
          </h2>

          <p className="text-lg text-gray-600 leading-[1.7]">
            錢寶明老師深耕高中數學教育 30 餘年，編著多本暢銷參考書，
            <br className="hidden sm:inline" />
            充分掌握大考趨勢，累積幫助數千名學生達成目標
          </p>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start max-w-7xl mx-auto">

          {/* Left Column - Image & Quick Facts */}
          <div className="space-y-8">
            {/* Teacher Image */}
            <div className="relative group">
              {/* Decorative Background Elements */}
              {/* <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-brand-200 to-brand-100 rounded-3xl -z-10 group-hover:scale-110 transition-transform duration-500" /> */}
              {/* <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-gradient-to-br from-purple-200 to-purple-100 rounded-3xl -z-10 group-hover:scale-110 transition-transform duration-500" /> */}

              {/* Main Image Container */}
              <div className="relative aspect-[1/1] rounded-3xl overflow-hidden shadow-2xl shadow-gray-300/50 border-4 border-white">
                <Image
                  alt="錢寶明老師"
                  imageId="paopao_jz9i86.jpg"
                  provider="cloudinary"
                  priority={false}
                  className="w-full h-full"
                  imgClassName="object-cover w-full h-full object-left"
                  sizes="(min-width:1024px) 40vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent" />

                {/* Name Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5" />
                    <span className="text-sm font-semibold uppercase tracking-wide">資深數學教師</span>
                  </div>
                  <div className="text-3xl font-bold mb-1">錢寶明</div>
                  <div className="text-sm text-white/80">30+ 年教學經驗 • 暢銷書作者</div>
                </div>
              </div>

              {/* Floating Stats Card */}
              {/* <div className="absolute -right-4 top-1/4 bg-white rounded-2xl p-6 shadow-2xl shadow-brand-600/20 border-2 border-brand-100 max-w-[200px]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center">
                    <Users className="w-6 h-6 text-brand-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900">5K+</div>
                    <div className="text-xs text-gray-600 font-medium">學生教授</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-gray-900">5.0 / 5.0</span>
                  <span className="text-gray-500">評分</span>
                </div>
              </div> */}
            </div>

            {/* Books Published */}
            {/* <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">出版著作</h3>
                  <p className="text-sm text-gray-600">累計銷售 10 萬冊以上</p>
                </div>
              </div>

              <div className="space-y-4">
                {books.map((book, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group">
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 mb-1">{book.title}</div>
                      <div className="text-sm text-gray-600">{book.publisher} • {book.year}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-brand-600">{book.sales}</div>
                      <div className="text-xs text-gray-500">銷售</div>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
          </div>

          {/* Right Column - Credentials & Description */}
          <div className="space-y-8">
            {/* Quote */}
            <div className="relative p-8 bg-gradient-to-br from-brand-50 to-blue-50 rounded-3xl border-2 border-brand-200">
              <div className="absolute top-6 left-6 text-6xl text-brand-200 font-serif leading-none">"</div>
              <div className="relative z-10 pt-8">
                <p className="text-xl font-semibold text-gray-800 leading-relaxed mb-4 italic">
                  我深知學生學習的痛點。這堂課，濃縮了我 30 年來的教學經驗與解題心法，希望能在你準備學測的關鍵時刻，成為真正幫得上忙的那一份教材。
                </p>
                <div className="flex items-center gap-3.5">
                  <img src={logoSrc} alt="錢寶明老師" className="h-9 rounded-full translate-y-0.5" />
                  {/* <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-bold text-lg">
                    錢
                  </div> */}
                  <div>
                    <div className="font-medium text-gray-900">錢寶明</div>
                    <div className="text-sm text-gray-600">寶哥高中數學創辦人</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Credentials Grid */}
            {/* <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">專業資歷</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {credentials.map((credential, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-100/30 transition-all duration-300 cursor-pointer group"
                  >
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${credential.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <credential.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">{credential.title}</h4>
                      <p className="text-sm text-gray-600 leading-snug">{credential.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}

            {/* Description */}
            <div className="space-y-6 text-gray-700 leading-[1.7] px-3">
              <p>
                曾參與多本高中數學總複習教材、單元輔導講義的編寫，並負責各式段考、學測模擬試題的命題與審題工作，充分掌握大考趨勢。
              </p>
              <p>
                我的教學風格紮實細膩，重視基礎觀念的建立，循序漸進地引導學生掌握數學核心能力。
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-brand-200/70 px-3">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: LibraryIcon, label: "多本教材作者", desc: "總複習 & 輔導講義" },
                  { icon: FileEditIcon, label: "命題審題經驗", desc: "模擬試題 & 段考" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-100/80 flex items-center justify-center">
                      <Icon icon={item.icon} className="w-5 h-5 text-brand-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{item.label}</div>
                      <div className="text-sm text-gray-500">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements Checklist */}
            {/* <div className="bg-white rounded-3xl p-8 border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-brand-600" />
                主要成就
              </h3>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-3 group">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <span className="text-gray-700 leading-snug">{achievement}</span>
                  </div>
                ))}
              </div>
            </div> */}
          </div>
        </div>

        {/* Bottom Trust Bar */}
        {/* <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-3xl p-8 lg:p-12 text-white text-center shadow-2xl shadow-brand-600/30">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold mb-2">30+</div>
                <div className="text-brand-100 font-medium">年教學經驗</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">10萬+</div>
                <div className="text-brand-100 font-medium">參考書累計銷量</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">5,000+</div>
                <div className="text-brand-100 font-medium">學生成功見證</div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}

export { TeacherSectionNew };
