import { useLoaderData, Link } from "react-router";
import { getCourseByAppSlug } from "~/operations/get-course-by-app-slug";
import { Lesson } from "~/components/course/Lesson";
import { ModuleConnector } from "~/components/course/ModuleConnector";
import { Sparkles } from "lucide-react";
import { customerContext } from "~/middleware/auth-context";
import { prisma } from "~/services/database/prisma.server";
import type { LoaderFunctionArgs } from "react-router";
import { buttonVariants } from "~/components/ui/Button";
import Icon from "~/components/ui/icon";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";

// Default app slug for single-tenant mode
const DEFAULT_APP_SLUG = "paopao-math";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  // Customer data is now loaded by parent middleware and available in context
  const customerData = context.get(customerContext);

  const course = await getCourseByAppSlug(DEFAULT_APP_SLUG, {
    configId: undefined,
    isAdmin: false,
  });

  if (!course) {
    throw new Error("Course not found");
  }

  // Load customer's lesson progress
  const progressRecords = await prisma.customerLessonProgress.findMany({
    where: {
      customerId: customerData.customerId,
    },
    select: {
      lessonId: true,
    },
  });

  const completedLessonIds = new Set(progressRecords.map((p: { lessonId: string }) => p.lessonId));

  // Find the first incomplete lesson for "continue learning" button
  let continueLesson: { moduleSlug: string; lessonSlug: string } | null = null;

  for (const module of course.modules) {
    for (const lesson of module.lessons) {
      if (!completedLessonIds.has(lesson.id)) {
        continueLesson = {
          moduleSlug: module.slug,
          lessonSlug: lesson.slug,
        };
        break;
      }
    }
    if (continueLesson) break;
  }

  // If all lessons are complete, fall back to the last lesson
  if (!continueLesson && course.modules.length > 0) {
    const lastModule = course.modules[course.modules.length - 1];
    if (lastModule.lessons.length > 0) {
      const lastLesson = lastModule.lessons[lastModule.lessons.length - 1];
      continueLesson = {
        moduleSlug: lastModule.slug,
        lessonSlug: lastLesson.slug,
      };
    }
  }

  // Get the continue lesson title
  let continueLessonTitle = "";
  let continueLessonModuleTitle = "";
  if (continueLesson) {
    const module = course.modules.find((m) => m.slug === continueLesson.moduleSlug);
    const lesson = module?.lessons.find((l) => l.slug === continueLesson.lessonSlug);
    if (lesson && module) {
      continueLessonTitle = lesson.title;
      continueLessonModuleTitle = module.title;
    }
  }

  const completedLessonIdsArray = Array.from(completedLessonIds);

  return {
    course,
    completedLessonIds: completedLessonIdsArray,
    continueLesson,
    continueLessonTitle,
    continueLessonModuleTitle,
    totalLessons: course.modules.reduce((sum, m) => sum + m.lessons.length, 0),
    completedCount: completedLessonIdsArray.length,
  };
};

export default function LearnContent() {
  const {
    course,
    completedLessonIds,
    continueLesson,
    continueLessonTitle,
    continueLessonModuleTitle,
    totalLessons,
    completedCount,
  } = useLoaderData<typeof loader>();
  const completedLessonIdsSet = new Set<string>(completedLessonIds);

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
        id: lesson.id,
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl">
                  主課程
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  循序漸進，掌握每一個核心知識點。請依照順序進行學習。
                </p>
                <div className="mt-2 flex items-baseline">
                  {/* <div className="text-sm font-medium text-gray-500">
                    學習進度
                  </div> */}
                  <div className="flex items-baseline gap-0.5">
                    <div className="font-medium text-success-700">
                      {completedCount}
                    </div>
                    <span className="text-sm text-gray-400">/</span>
                    <div className="text-gray-400 text-sm font-medium">
                      {totalLessons}
                    </div>
                  </div>
                  <div className="ml-1 text-xs text-gray-500">
                    ({totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0}% 已完成)
                  </div>
                </div>
              </div>
              {continueLesson && (
                <div className="flex gap-4">
                  <div className="text-sm text-gray-600">
                    <div className="text-gray-500/80 text-right">{continueLessonModuleTitle}</div>
                    <div className="mt-0.5 text-gray-500/80 text-right">{continueLessonTitle}</div>
                  </div>
                  <Link
                    to={`/learn/content/${continueLesson.moduleSlug}/${continueLesson.lessonSlug}`}
                    className={buttonVariants()}
                  >
                    繼續學習
                    <Icon icon={ArrowRight02Icon} className="size-4" />
                  </Link>
                </div>
              )}
            </div>
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
                    <Lesson
                      lesson={module}
                      index={index}
                      isPreview={false}
                      completedLessonIds={completedLessonIdsSet}
                    />
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
