import { LoaderFunctionArgs } from "react-router";
import { Link, useLoaderData } from "react-router";
import { ChevronRight, Clock } from "lucide-react";
import { LockScreen } from "~/components/business/LockScreen";
import { buttonVariants } from "~/components/ui/Button";
import { canUserAccessPath } from "~/services/auth/permissions";
import { getLessonBySlug } from "~/services/database/course";
import { cn } from "~/utils/style";
import { getCourseByAppSlug } from "~/operations/get-course-by-app-slug";

// Default app slug for single-tenant mode
const DEFAULT_APP_SLUG = "paopao-math";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const path = url.pathname;

  const canAccess = await canUserAccessPath(request, path);
  if (!canAccess) {
    return { notAccess: true, lesson: null, appId: null };
  }

  const moduleSlug = params.lesson; // 模組 slug (對應舊的 lesson)
  const lessonSlug = params.chapter; // 課程 slug (對應舊的 chapter)

  if (!moduleSlug || !lessonSlug) {
    return { notAccess: false, lesson: null, appId: null };
  }

  // 首先獲取 app 來找到 courseId
  const course = await getCourseByAppSlug(DEFAULT_APP_SLUG, {
    configId: undefined,
    isAdmin: false,
  });

  if (!course) {
    return { notAccess: false, lesson: null, appId: null };
  }

  const lesson = await getLessonBySlug(course.id, moduleSlug, lessonSlug);

  return { notAccess: false, lesson, appId: course.id };
}

export default function Page() {
  const data = useLoaderData<typeof loader>();

  if (!data) return null;

  if (data.notAccess) {
    return <LockScreen />;
  }

  const { lesson } = data;

  if (!lesson) return null;

  return (
    <>
      <div className="divide-y-1 divide-gray-200">
        <div className="pb-3">
          <div>
            <div className="lg:flex items-center justify-between lg:h-8">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-500 flex-wrap">
                  <Link to="/course/content" className="hover:text-gray-900">
                    課程
                  </Link>
                  <ChevronRight className="size-4" />
                  <span className="text-gray-700">
                    {lesson.moduleMeta.title}
                  </span>
                  <ChevronRight className="size-4" />
                  <span className="text-gray-900 font-medium">
                    {lesson.title}
                  </span>
                </div>
              </div>

              {/* 右側：下一課按鈕 */}
              {lesson.nextLesson && (
                <Link
                  to={`/course/content/${lesson.moduleMeta.slug}/${lesson.nextLesson.slug}`}
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "max-lg:mt-4 bg-brand-600 hover:bg-brand-700"
                  )}
                >
                  下一課
                  <ChevronRight className="size-4 ml-1" />
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="py-6">
          <div className="flex gap-8 xl:gap-12">
            {/* 主要內容區域 */}
            <div className="flex-1 max-w-4xl">
              {/* 課程標題卡片 */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-xl font-semibold">{lesson.title}</h1>

                    {/* 課程統計 */}
                    {lesson.summary && (
                      <p className="mt-2 text-sm text-gray-600">
                        {lesson.summary}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-4 translate-x-px">
                      {lesson.durationSec && (
                        <div className="flex items-center space-x-2">
                          <Clock className="size-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {Math.round(lesson.durationSec / 60)} 分鐘
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 學習內容 */}
              <div className="space-y-8 mt-12">
                {lesson.contentHtml ? (
                  <div
                    className="prose prose-gray max-w-none"
                    dangerouslySetInnerHTML={{ __html: lesson.contentHtml }}
                  />
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p>課程內容即將推出</p>
                  </div>
                )}
              </div>
            </div>

            {/* 右側邊欄：課程導航 */}
            <div className="hidden xl:block w-80">
              <div className="sticky top-8">
                <div className="bg-white border border-gray-200 rounded-md shadow-sm py-5 px-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-1 h-5 bg-brand-500 rounded-full" />
                    <h3 className="font-semibold text-gray-900">
                      {lesson.moduleMeta.title}
                    </h3>
                  </div>

                  <div className="space-y-1">
                    {lesson.moduleMeta.lessons.map((l) => (
                      <Link
                        key={l.slug}
                        to={`/course/content/${lesson.moduleMeta.slug}/${l.slug}`}
                        className={cn(
                          "block py-2 px-3 rounded-lg text-sm transition-colors",
                          lesson.slug === l.slug
                            ? "bg-brand-50 text-brand-700 font-medium"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate">{l.title}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
