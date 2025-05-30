import { LoaderFunctionArgs } from "@remix-run/node";
import { json, Link, useLoaderData } from "@remix-run/react";
import {
  ChevronRight,
  BookOpen,
  PlayCircle,
  BarChart3,
  Clock,
  CheckCircle,
  ArrowLeft,
  VideoIcon,
} from "lucide-react";
import { LockScreen } from "~/components/business/LockScreen";
import { Video } from "~/components/business/Video";
import { buttonVariants } from "~/components/ui/Button";
import { canUserAccessPath } from "~/services/auth/permissions";
import { getChapter } from "~/utils/course.server";
import { cn } from "~/utils/style";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const path = url.pathname;

  const canAccess = await canUserAccessPath(request, path);
  if (!canAccess) {
    return json({ notAccess: true, chapter: null });
  }

  const lessonSlug = params.lesson;
  const chapterSlug = params.chapter;

  if (!lessonSlug || !chapterSlug) {
    return null;
  }

  const chapter = getChapter({ lessonSlug, chapterSlug });

  return json({ notAccess: false, chapter });
}

export default function Page() {
  const data = useLoaderData<typeof loader>();

  if (!data) return null;

  if (data.notAccess) {
    return <LockScreen />;
  }

  const { chapter } = data;

  if (!chapter) return null;

  // 計算章節統計
  const totalVideos = chapter.teachings.length + chapter.exams.length;
  const totalDuration =
    chapter.teachings.reduce((acc, t) => acc + t.duration, 0) +
    chapter.exams.reduce((acc, e) => acc + e.duration, 0);

  return (
    <>
      <div className="divide-y-1 divide-gray-200">
        <div className="pb-3">
          <div>
            <div className="flex items-center justify-between h-8">
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                  <Link to="/course/content" className="hover:text-gray-900">
                    課程
                  </Link>
                  <ChevronRight className="size-4" />
                  <span className="text-gray-700">
                    {chapter.lessonMeta.name}
                  </span>
                  <ChevronRight className="size-4" />
                  <span className="text-gray-900 font-medium">
                    {chapter.name}
                  </span>
                </div>
              </div>

              {/* 右側：下一章按鈕 */}
              {chapter.nextChapter && (
                <Link
                  to={`/course/content/${chapter.lessonMeta.slug}/${chapter.nextChapter.slug}`}
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "bg-brand-600 hover:bg-brand-700"
                  )}
                >
                  下一章節
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
              {/* 章節標題卡片 */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-xl font-semibold">{chapter.name}</h1>

                    {/* 章節統計 */}
                    <div className="mt-4 flex flex-wrap items-center gap-4 translate-x-px">
                      <div className="flex items-center space-x-2">
                        <VideoIcon className="size-4 text-gray-500 translate-y-px" />
                        <span className="text-sm text-gray-600">
                          {totalVideos} 個影片
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="size-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {chapter.exams.length} 個例題
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="size-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {Math.round(totalDuration / 60)} 分鐘
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 學習內容 */}
              <div className="space-y-8 mt-12">
                {/* 觀念講解 */}
                {chapter.teachings.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-brand-100 text-brand-600 rounded-lg flex items-center justify-center">
                        <BookOpen className="size-4" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        觀念講解
                      </h2>
                    </div>

                    <div className="space-y-4">
                      {chapter.teachings.map((teaching) => (
                        <div key={teaching.videoId}>
                          <div className="py-2">
                            <Video videoId={teaching.videoId} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 突破關卡 */}
                {chapter.exams.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-brand-100 text-brand-600 rounded-lg flex items-center justify-center">
                        <BarChart3 className="size-4" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        突破關卡
                      </h2>
                    </div>

                    <div className="space-y-4">
                      {chapter.exams.map((exam) => (
                        <div key={exam.videoId}>
                          <div className="py-2">
                            <Video videoId={exam.videoId} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 右側邊欄：章節導航 */}
            <div className="hidden xl:block w-80">
              <div className="sticky top-8">
                <div className="bg-white border border-gray-200 rounded-md shadow-sm py-5 px-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-1 h-5 bg-brand-500 rounded-full" />
                    <h3 className="font-semibold text-gray-900">
                      {chapter.lessonMeta.name}
                    </h3>
                  </div>

                  <div className="space-y-1">
                    {chapter.lessonMeta.chapters.map((c) => (
                      <Link
                        key={c.slug}
                        to={`/course/content/${chapter.lessonMeta.slug}/${c.slug}`}
                        className={cn(
                          "block py-2 px-3 rounded-lg text-sm transition-colors",
                          chapter.slug === c.slug
                            ? "bg-brand-50 text-brand-700 font-medium"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate">{c.name}</span>
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
