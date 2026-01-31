import { useLoaderData, Link } from "react-router";
import { getCourseByAppSlug } from "~/operations/get-course-by-app-slug";
import { Lesson } from "~/components/course/Lesson";
import { Button } from "~/components/ui/Button/Button";
import { ArrowRight, Sparkles } from "lucide-react";
import Icon from "~/components/ui/icon";
import { SparklesIcon } from "@hugeicons/core-free-icons";
import { ModuleConnector } from "~/components/course/ModuleConnector";
import { usePurchase } from "~/hooks/use-purchase";

// Default app slug for single-tenant mode
const DEFAULT_APP_SLUG = "paopao-math";

export async function loader() {
  // 從數據庫獲取課程數據
  const course = await getCourseByAppSlug(DEFAULT_APP_SLUG, {
    configId: undefined,
    isAdmin: false,
  });

  if (!course) {
    throw new Error("Course not found");
  }

  // 返回完整的 course 大綱
  return { course };
}

export default function Page() {
  const { course } = useLoaderData<typeof loader>();
  const { purchase, isLoading } = usePurchase();

  // 將 course.modules 轉換為 Lesson 組件期望的格式
  // 只顯示公開的模組（模組是 public 的，底下的 lesson 也都是 public 的）
  const syllabus = course.modules
    .filter((module) => module.isPublic)
    .map((module) => {
      const totalDuration = module.lessons.reduce(
        (sum, lesson) => sum + (lesson.durationSec || 0),
        0
      );

      return {
        name: module.title,
        description: module.summary || undefined,
        slug: module.slug,
        totalDuration,
        examCount: 0,
        chapters: module.lessons.map((lesson) => ({
          name: lesson.title,
          duration: lesson.durationSec || 0,
          slug: lesson.slug,
          examCount: 0,
        })),
      };
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="relative isolate overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 -z-10 opacity-30">
            <div className="absolute inset-0 bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:20px_20px] [--pattern-fg:var(--color-gray-900)]/5" />
          </div>

          <div className="container mx-auto px-4 py-16 sm:py-24 text-center">
            <div className="mx-auto max-w-2xl">
              <div className="mb-6 flex justify-center">
                <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-600 ring-1 ring-inset ring-brand-500/10 flex items-center gap-1.5">
                  <Icon icon={SparklesIcon} className="size-4" />
                  免費試讀體驗
                </span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                探索精選課程內容
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                我們精選了部分優質課程供您免費體驗。親自感受教學品質，為您的學習旅程做出最好的選擇
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button 
                  size="lg" 
                  className="rounded-full px-8 text-base shadow-lg shadow-brand-500/20"
                  onClick={purchase}
                  disabled={isLoading}
                >
                  {isLoading ? "處理中..." : "解鎖完整課程"} <ArrowRight className="ml-2 size-5" />
                </Button>
                {/* <Button asChild variant="ghost" size="lg" className="text-base text-gray-700">
                  <Link to="/learn">
                    返回課程總覽
                  </Link>
                </Button> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-8 gap-x-8 max-w-7xl mx-auto">
            {syllabus.map((module, index) => (
              <div
                key={module.slug}
                className="relative group"
              >
                <ModuleConnector index={index} total={syllabus.length} />

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden h-full z-10 relative">
                  <div className="p-6">
                    <Lesson lesson={module} index={index} isPreview={true} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {syllabus.length === 0 && (
            <div className="text-center py-24 bg-white rounded-xl border border-gray-200 shadow-sm max-w-3xl mx-auto">
              <div className="text-gray-400 mb-4">
                <Sparkles className="size-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">目前沒有公開的試讀內容</h3>
              <p className="mt-2 text-gray-500">請稍後再回來查看，或直接瀏覽完整課程大綱。</p>
              <div className="mt-6">
                <Button 
                  variant="outline"
                  onClick={purchase}
                  disabled={isLoading}
                >
                  {isLoading ? "處理中..." : "查看完整課程方案"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
