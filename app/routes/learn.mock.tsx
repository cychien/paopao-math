import { useLoaderData } from "react-router";

// Mock data for the "Mock Exams"
// In a real app, this would come from a database (e.g., Prisma)
const MOCK_EXAMS = [
  {
    id: "1",
    title: "學測數學 A 模擬試題 (一)",
    subtitle: "完整仿真 · 108 課綱",
    description: "完全依照學測數學 A 考試規格設計的全真模擬試題。題型分布、難度配置與時間控制都貼近實際考試，讓你提前體驗正式考場的節奏與壓力。",
    date: "2024-01-15",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop",
    tags: ["數學 A", "全真模擬"],
    questionCount: 18,
    duration: 100,
  },
  {
    id: "2",
    title: "學測數學 A 模擬試題 (二)",
    subtitle: "完整仿真 · 108 課綱",
    description: "第二回全真模擬考題，特別加強多選題與混合題型的訓練。涵蓋三角函數、向量、矩陣與空間概念等高鑑別度單元，適合衝刺階段使用。",
    date: "2024-01-10",
    imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=2070&auto=format&fit=crop",
    tags: ["數學 A", "全真模擬"],
    questionCount: 18,
    duration: 100,
  },
  {
    id: "3",
    title: "學測數學 A 模擬試題 (三)",
    subtitle: "完整仿真 · 108 課綱",
    description: "第三回模擬考題著重跨章節整合能力。多題結合數列、函數與極限概念，訓練你在有限時間內快速判斷題型並選擇最佳解法。",
    date: "2024-01-05",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop",
    tags: ["數學 A", "全真模擬"],
    questionCount: 18,
    duration: 100,
  },
  {
    id: "4",
    title: "學測數學 B 模擬試題 (一)",
    subtitle: "完整仿真 · 108 課綱",
    description: "專為數學 B 考科設計的全真模擬試題。著重生活情境應用、數據分析與統計推論，幫助社會組同學掌握素養導向命題趨勢。",
    date: "2024-01-12",
    imageUrl: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?q=80&w=2070&auto=format&fit=crop",
    tags: ["數學 B", "全真模擬"],
    questionCount: 18,
    duration: 100,
  },
  {
    id: "5",
    title: "學測數學 B 模擬試題 (二)",
    subtitle: "完整仿真 · 108 課綱",
    description: "第二回數學 B 模擬試題，強化圖表判讀與邏輯推理能力。題材涵蓋社會議題、經濟分析與科學數據，展現數學的實用價值。",
    date: "2024-01-08",
    imageUrl: "https://images.unsplash.com/photo-1620247408892-23b2d18227b4?q=80&w=2070&auto=format&fit=crop",
    tags: ["數學 B", "全真模擬"],
    questionCount: 18,
    duration: 100,
  },
  {
    id: "6",
    title: "進階挑戰題組 (一)",
    subtitle: "高難度綜合演練",
    description: "精選高鑑別度題型組成的挑戰試題。每題都經過精心設計，涵蓋多個單元概念，適合追求頂標、前標的同學作為衝刺練習。",
    date: "2024-01-03",
    imageUrl: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=2070&auto=format&fit=crop",
    tags: ["進階練習", "綜合題"],
    questionCount: 15,
    duration: 80,
  },
];

export const loader = async () => {
  // Simulate DB fetch
  return { exams: MOCK_EXAMS };
};

export default function MockExamsPage() {
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
                實戰演練
              </span>
              <h1 className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl">
                仿真模擬考題
              </h1>
              <p className="text-sm text-gray-600 max-w-xl leading-[1.7]">
                完全依照學測規格設計的全真模擬試題，提前適應考試節奏與時間壓力。
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

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">題數</span>
                      <span className="font-medium text-gray-900">{exam.questionCount} 題</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">建議時間</span>
                      <span className="font-medium text-gray-900">{exam.duration} 分鐘</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 mt-4 border-t border-gray-100">
                    {exam.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
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
              <h3 className="text-lg font-semibold text-gray-900">目前沒有模擬試題</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
