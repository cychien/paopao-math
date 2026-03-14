import { useLoaderData } from "react-router";
import { getCourseByAppSlug } from "~/operations/get-course-by-app-slug";
import { Lesson } from "~/components/course/Lesson";
import { Button } from "~/components/ui/Button/Button";
import { Sparkles } from "lucide-react";
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

  // 將所有 course.modules 轉換為 Lesson 組件期望的格式
  // 章節是否可免費試讀，交由 /preview/:moduleSlug/:lessonSlug loader 判斷
  const syllabus = course.modules
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
  );
}
