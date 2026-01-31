import { useLoaderData } from "react-router";
import { getCourseByAppSlug } from "~/operations/get-course-by-app-slug";
import { Lesson } from "~/components/course/Lesson";
import { ModuleConnector } from "~/components/course/ModuleConnector";
import { Sparkles } from "lucide-react";

// Default app slug for single-tenant mode
const DEFAULT_APP_SLUG = "paopao-math";

export const loader = async () => {
  // Customer data is now loaded by parent middleware and available in context

  const course = await getCourseByAppSlug(DEFAULT_APP_SLUG, {
    configId: undefined,
    isAdmin: false,
  });

  if (!course) {
    throw new Error("Course not found");
  }

  return { course };
};

export default function LearnContent() {
  const { course } = useLoaderData<typeof loader>();

  // Convert course modules to the format expected by Lesson component
  const syllabus = course.modules.map((module) => {
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
      <div className="bg-white border-b border-gray-200 mb-8 sm:mb-12">
        <div className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-30">
            <div className="absolute inset-0 bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:20px_20px] [--pattern-fg:var(--color-gray-900)]/5" />
          </div>

          <div className="px-8 py-6">
            <h1 className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl">
              主課程
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              循序漸進，掌握每一個核心知識點。請依照順序進行學習。
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="pb-12 sm:pb-16 px-8">
        <div className="">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-8 gap-x-8 max-w-7xl mx-auto">
            {syllabus.map((module, index) => (
              <div
                key={module.slug}
                className="relative group"
              >
                <ModuleConnector index={index} total={syllabus.length} />

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden h-full z-10 relative">
                  <div className="p-6">
                    <Lesson lesson={module} index={index} isPreview={false} />
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
              <h3 className="text-lg font-semibold text-gray-900">目前沒有課程內容</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
