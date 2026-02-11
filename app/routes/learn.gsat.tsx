import { useLoaderData } from "react-router";

// Mock data for the "Past Exams"
// In a real app, this would come from a database (e.g., Prisma)
const MOCK_EXAMS = [
  {
    id: "1",
    title: "113 學測數學 A",
    subtitle: "2024 年度學科能力測驗",
    description: "完整收錄 113 學年度學測數學 A 考科全部題目，包含詳細解析、關鍵概念說明，以及每題的答對率統計。特別針對高鑑別度題目提供多種解法比較。",
    date: "2024-01-21",
    imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=2070&auto=format&fit=crop",
    tags: ["數學 A", "學測"],
    difficulty: "medium",
  },
  {
    id: "2",
    title: "112 學測數學 A",
    subtitle: "2023 年度學科能力測驗",
    description: "112 學年度學測數學 A 完整試題與詳解。本年度考題涵蓋多項式、機率統計、向量與空間幾何等核心單元，整體難度適中但鑑別度高。",
    date: "2023-01-14",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop",
    tags: ["數學 A", "學測"],
    difficulty: "medium",
  },
  {
    id: "3",
    title: "111 學測數學 A",
    subtitle: "2022 年度學科能力測驗",
    description: "111 學年度學測數學 A 考題分析。這份考卷特別注重跨單元整合能力，多題結合函數、數列與極限概念，是練習綜合應用的絕佳教材。",
    date: "2022-01-22",
    imageUrl: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?q=80&w=2070&auto=format&fit=crop",
    tags: ["數學 A", "學測"],
    difficulty: "hard",
  },
  {
    id: "4",
    title: "113 學測數學 B",
    subtitle: "2024 年度學科能力測驗",
    description: "113 學年度學測數學 B 考科完整試題。著重於生活情境應用與數據分析，題型活潑且具實用性。適合社會組同學作為複習與演練教材。",
    date: "2024-01-21",
    imageUrl: "https://images.unsplash.com/photo-1620247408892-23b2d18227b4?q=80&w=2070&auto=format&fit=crop",
    tags: ["數學 B", "學測"],
    difficulty: "easy",
  },
  {
    id: "5",
    title: "112 學測數學 B",
    subtitle: "2023 年度學科能力測驗",
    description: "112 學年度學測數學 B 試題與詳解。本次考題特色在於大量融入圖表判讀與統計推論，貼近 108 課綱素養導向精神。",
    date: "2023-01-14",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop",
    tags: ["數學 B", "學測"],
    difficulty: "easy",
  },
  {
    id: "6",
    title: "111 學測數學 B",
    subtitle: "2022 年度學科能力測驗",
    description: "111 學年度學測數學 B 完整收錄。考題設計著重邏輯推理與數據解讀能力，多題結合社會議題與生活情境，展現數學的實用價值。",
    date: "2022-01-22",
    imageUrl: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=2070&auto=format&fit=crop",
    tags: ["數學 B", "學測"],
    difficulty: "medium",
  },
];

export const loader = async () => {
  // Simulate DB fetch
  return { exams: MOCK_EXAMS };
};

const difficultyColors = {
  easy: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  hard: "bg-red-100 text-red-800",
};

const difficultyLabels = {
  easy: "基礎",
  medium: "中等",
  hard: "困難",
};

export default function ExamsPage() {
  const { exams } = useLoaderData<typeof loader>();

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
                完整收錄
              </span>
              <h1 className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl">
                歷屆學測試題
              </h1>
              <p className="text-sm text-gray-600 max-w-xl leading-[1.7]">
                收錄近年學測數學 A、數學 B 完整試題與詳細解析，幫助你掌握考試趨勢與命題重點。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="pb-12 sm:pb-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg hover:border-gray-300"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                  <img
                    src={exam.imageUrl}
                    alt={exam.title}
                    className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">
                      {exam.title}
                    </h2>
                    <p className="text-sm text-white/90 drop-shadow">
                      {exam.subtitle}
                    </p>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                    {exam.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex gap-2">
                      {exam.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                        difficultyColors[exam.difficulty as keyof typeof difficultyColors]
                      }`}
                    >
                      {difficultyLabels[exam.difficulty as keyof typeof difficultyLabels]}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {exams.length === 0 && (
            <div className="text-center py-24 bg-white rounded-xl border border-gray-200 shadow-sm max-w-3xl mx-auto">
              <div className="text-gray-400 mb-4">
                <svg
                  className="size-12 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">目前沒有歷屆試題</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
