import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, Link } from "react-router";
import { getCourseByAppSlug } from "~/operations/get-course-by-app-slug";
import { PlayCircle } from "~/components/icons/PlayCircle";
import { BookOpen, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "~/utils/style";
import { customerContext } from "~/middleware/auth-context";
import { prisma } from "~/services/database/prisma.server";

// Default app slug for single-tenant mode
const DEFAULT_APP_SLUG = "paopao-math";

type LoaderData = {
  course: {
    modules: Array<{
      id: string;
      slug: string;
      title: string;
      summary: string | null;
      order: number;
      lessons: Array<{
        id: string;
        slug: string;
        title: string;
        durationSec: number | null;
        order: number;
      }>;
    }>;
  };
  stats: {
    totalLessons: number;
    totalModules: number;
    totalDuration: number;
    completedLessons: number;
  };
  continueLesson: { moduleSlug: string; lessonSlug: string } | null;
};

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  // Customer data is now loaded by parent middleware and available in context
  const customerData = context.get(customerContext);

  // 從數據庫獲取課程數據
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

  // Calculate statistics
  const totalModules = course.modules.length;
  const totalLessons = course.modules.reduce(
    (sum, module) => sum + module.lessons.length,
    0
  );
  const totalDuration = course.modules.reduce(
    (sum, module) =>
      sum +
      module.lessons.reduce(
        (lessonSum, lesson) => lessonSum + (lesson.durationSec || 0),
        0
      ),
    0
  );
  const completedLessons = completedLessonIds.size;

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

  return {
    course,
    stats: {
      totalLessons,
      totalModules,
      totalDuration,
      completedLessons,
    },
    continueLesson,
  };
};

export default function LearnOverview() {
  const { course, stats, continueLesson } = useLoaderData<LoaderData>();

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours} 小時 ${minutes} 分鐘`;
    }
    return `${minutes} 分鐘`;
  };

  const progressPercentage = stats.totalLessons > 0
    ? Math.round((stats.completedLessons / stats.totalLessons) * 100)
    : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-brand-400 opacity-10 rounded-full blur-3xl"></div>

        <div className="relative p-8 md:p-12">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              歡迎回來！繼續你的學習之旅
            </h1>
            <p className="text-brand-100 text-lg mb-8 max-w-xl">
              探索數學的奧秘，掌握核心概念。準備好開始今天的課程了嗎？
            </p>
            <div className="flex flex-wrap gap-4">
              {continueLesson ? (
                <Link
                  to={`/learn/content/${continueLesson.moduleSlug}/${continueLesson.lessonSlug}`}
                  className="inline-flex items-center px-6 py-3 bg-white text-brand-700 font-semibold rounded-lg shadow-sm hover:bg-brand-50 transition-colors"
                >
                  <PlayCircle className="w-5 h-5 mr-2" />
                  {stats.completedLessons > 0 ? '繼續學習' : '開始學習'}
                </Link>
              ) : (
                <Link
                  to="/learn/content"
                  className="inline-flex items-center px-6 py-3 bg-white text-brand-700 font-semibold rounded-lg shadow-sm hover:bg-brand-50 transition-colors"
                >
                  <PlayCircle className="w-5 h-5 mr-2" />
                  開始學習
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <BookOpen className="size-6" />
          </div>
          <div>
            <div className="text-sm text-gray-500 font-medium">總課程模組</div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalModules}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <PlayCircle className="size-6" />
          </div>
          <div>
            <div className="text-sm text-gray-500 font-medium">課程單元</div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalLessons}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <Clock className="size-6" />
          </div>
          <div>
            <div className="text-sm text-gray-500 font-medium">總時長</div>
            <div className="text-2xl font-bold text-gray-900">{formatDuration(stats.totalDuration)}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <CheckCircle2 className="size-6" />
          </div>
          <div>
            <div className="text-sm text-gray-500 font-medium">學習進度</div>
            <div className="text-2xl font-bold text-gray-900">
              {progressPercentage}%
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              {stats.completedLessons} / {stats.totalLessons} 單元
            </div>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      {/* <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="size-5 text-brand-600" />
            課程模組
          </h2>
          <Link to="/learn/content" className="text-sm font-medium text-brand-600 hover:text-brand-700 hover:underline">
            查看全部
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {course.modules.slice(0, 6).map((module, index) => (
            <Link
              key={module.id}
              to={`/learn/content`}
              className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-brand-200 transition-all duration-300"
            >
              <div className="h-2 bg-brand-500 w-full group-hover:h-3 transition-all duration-300"></div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-bold text-sm group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                    {index + 1}
                  </span>
                  <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                    {module.lessons.length} 單元
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-brand-700 transition-colors line-clamp-2">
                  {module.title}
                </h3>

                {module.summary && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
                    {module.summary}
                  </p>
                )}

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1">
                    <Clock className="size-3.5" />
                    {module.lessons.reduce((acc, curr) => acc + (curr.durationSec || 0), 0) > 0
                      ? `${Math.round(module.lessons.reduce((acc, curr) => acc + (curr.durationSec || 0), 0) / 60)} 分鐘`
                      : '未設定時長'
                    }
                  </span>
                  <span className="text-brand-600 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                    前往學習 &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div> */}
    </div>
  );
}
