import { useLoaderData } from "react-router";
import { cn } from "~/utils/style";

// Mock data for the "Good Questions"
// In a real app, this would come from a database (e.g., Prisma)
const MOCK_QUESTIONS = [
  {
    id: "1",
    title: "112 學測數學 A 詳解",
    subtitle: "精選高難度幾何題解析",
    description: "針對 112 年學測數學 A 考卷中，答對率最低的幾何題目進行深度剖析。不僅提供標準解法，還包含了快速破題的直觀思考路徑，幫助你在考場上節省寶貴時間。",
    date: "2023-11-15",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop",
    tags: ["幾何", "學測複習"],
  },
  {
    id: "2",
    title: "數列與級數的陷阱",
    subtitle: "常見錯誤觀念釐清",
    description: "整理了學生在處理等差、等比級數時最常犯的邏輯錯誤。透過三個經典例題，讓你徹底搞懂數列極限的收斂條件，避免在多選題中失分。",
    date: "2023-10-28",
    imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=2070&auto=format&fit=crop",
    tags: ["數列", "觀念澄清"],
  },
  {
    id: "3",
    title: "三角函數圖形變換",
    subtitle: "振幅、週期與相移",
    description: "利用動態圖形概念來講解 y = A sin(Bx + C) + D 的各個係數對圖形的影響。掌握這個核心概念，面對複雜的三角函數圖形題也能迎刃而解。",
    date: "2023-10-10",
    imageUrl: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?q=80&w=2070&auto=format&fit=crop",
    tags: ["三角函數", "圖形分析"],
  },
  {
    id: "4",
    title: "排列組合：分堆問題",
    subtitle: "巴斯卡三角形的應用",
    description: "分堆問題總是讓人頭痛？到底是 C 幾取幾？要不要除以階乘？我們用最直白的方式歸納了三種常見的分堆情境，讓你不再混淆。",
    date: "2023-09-25",
    imageUrl: "https://images.unsplash.com/photo-1620247408892-23b2d18227b4?q=80&w=2070&auto=format&fit=crop",
    tags: ["排列組合", "機率"],
  },
];

export const loader = async () => {
  // Simulate DB fetch
  return { questions: MOCK_QUESTIONS };
};

export default function GoodQuestionsPage() {
  const { questions } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 mb-8 sm:mb-12">
        <div className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-30">
            <div className="absolute inset-0 bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:20px_20px] [--pattern-fg:var(--color-gray-900)]/5" />
          </div>

          <div className="px-8 py-6">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                不定時更新
              </span>
              <h1 className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl">
                好題分享與深度解析
              </h1>
              <p className="text-sm text-gray-600 max-w-xl leading-[1.7]">
                不定時整理精選數學題目、歷屆考題詳解以及易錯觀念澄清。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      {/* <div className="pb-12 sm:pb-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {questions.map((question) => (
              <div
                key={question.id}
                className="group flex flex-col bg-[#F9FAFB] rounded-[32px] p-8 transition-all duration-300 hover:shadow-lg border border-transparent hover:border-gray-200"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors">
                    {question.title}
                  </h2>
                  <h3 className="text-lg font-medium text-gray-500 mb-4">
                    {question.subtitle}
                  </h3>
                  <p className="text-gray-600 leading-relaxed line-clamp-3 mb-6">
                    {question.description}
                  </p>
                  <div className="flex gap-2 mb-2">
                    {question.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto overflow-hidden rounded-2xl relative aspect-[4/3] w-full">
                  <img
                    src={question.imageUrl}
                    alt={question.title}
                    className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}
    </div>
  );
}
