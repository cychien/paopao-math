import { Image } from "~/components/ui/image";
import { Award, BookOpen, FileText, Users } from "lucide-react";

function TeacherSection() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-50/30 rounded-full blur-[100px] translate-x-1/2" />

      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 max-w-6xl mx-auto">

          {/* Image Side */}
          <div className="w-full lg:w-5/12 flex justify-center">
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-brand-100 rounded-2xl -z-10" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gray-200 rounded-2xl -z-10" />

              {/* Main image container */}
              <div className="relative w-full max-w-sm aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl shadow-gray-300/50">
                <Image
                  alt="錢寶明老師"
                  imageId="paopao_jz9i86.jpg"
                  provider="cloudinary"
                  priority={false}
                  aspectRatio={3/4}
                  className="object-cover w-full h-full"
                  sizes="(min-width:1024px) 40vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />

                {/* Name overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="text-sm font-medium text-white/80 mb-1">高中數學老師</div>
                  <div className="text-2xl font-bold text-white">錢寶明</div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -right-4 top-1/4 bg-white rounded-2xl p-4 shadow-xl shadow-gray-200/50 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
                    <Award className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">30+</div>
                    <div className="text-xs text-gray-500">年教學經驗</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Side */}
          <div className="w-full lg:w-7/12">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 mb-6">
              <Users className="w-4 h-4 text-brand-600" />
              <span className="text-sm font-semibold text-brand-700">關於講師</span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
              名師親授，
              <span className="text-brand-600">30 年</span>
              <br className="hidden sm:inline" />
              教學經驗的結晶
            </h2>

            <div className="space-y-5 text-gray-600 leading-relaxed">
              <p className="text-lg font-semibold text-gray-700 border-l-4 border-brand-200 pl-4 italic">
                「我深知學生學習的痛點。這堂課，濃縮了我 30 年來的教學經驗與解題心法。」
              </p>
              <p>
                曾參與多本高中數學總複習教材、單元輔導講義的編寫，並負責各式段考、學測模擬試題的命題與審題工作，充分掌握大考趨勢。
              </p>
              <p>
                我的教學風格紮實細膩，重視基礎觀念的建立，循序漸進地引導學生掌握數學核心能力。希望在你準備學測的關鍵時刻，成為真正幫得上忙的那一份教材。
              </p>
            </div>

            {/* Credentials */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: BookOpen, label: "多本教材作者", desc: "總複習 & 輔導講義" },
                  { icon: FileText, label: "命題審題經驗", desc: "模擬試題 & 段考" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{item.label}</div>
                      <div className="text-sm text-gray-500">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export { TeacherSection };