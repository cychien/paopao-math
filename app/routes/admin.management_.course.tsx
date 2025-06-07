import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { requireAdmin } from "~/services/auth/session";
import {
  getAllLessonsWithDetails,
  getCourseStats,
} from "~/services/database/course";
import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Play,
  BookOpen,
  ArrowLeft,
  TableOfContents,
  BarChart3,
  BookA,
} from "lucide-react";
import { Button } from "~/components/ui/Button";

type LoaderData = {
  lessons: Awaited<ReturnType<typeof getAllLessonsWithDetails>>;
  stats: Awaited<ReturnType<typeof getCourseStats>>;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireAdmin(request);

  const [lessons, stats] = await Promise.all([
    getAllLessonsWithDetails(),
    getCourseStats(),
  ]);

  return json<LoaderData>({
    lessons,
    stats,
  });
};

export default function CourseManagementPage() {
  const { lessons, stats } = useLoaderData<LoaderData>();
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(
    new Set()
  );

  const toggleLesson = (lessonId: string) => {
    const newExpanded = new Set(expandedLessons);
    if (newExpanded.has(lessonId)) {
      newExpanded.delete(lessonId);
    } else {
      newExpanded.add(lessonId);
    }
    setExpandedLessons(newExpanded);
  };

  return (
    <div className="container mx-auto py-8">
      {/* 返回按鈕和標題 */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link
            to="/admin/management"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回管理中心
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">課程管理</h1>
        <p className="text-gray-600">管理所有課程內容、章節和教學影片</p>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center">
              <BookA className="size-5 text-brand-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm">單元總數</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.lessons}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center">
              <TableOfContents className="size-5 text-brand-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm">章節總數</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.chapters}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center">
              <BookOpen className="size-5 text-brand-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm">觀念講解總數</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.teachings}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="size-5 text-brand-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm">突破關卡總數</p>
              <p className="text-2xl font-bold text-gray-900">{stats.exams}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 課程列表 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-300">
        <div className="px-6 py-4 border-b border-gray-300 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">課程列表</h2>
          <Button>
            <Plus className="w-4 h-4" />
            新增課程
          </Button>
        </div>

        <div className="divide-y divide-gray-300">
          {lessons.map((lesson) => {
            const isExpanded = expandedLessons.has(lesson.id);
            const totalTeachings = lesson.chapters.reduce(
              (sum, chapter) => sum + chapter.teachings.length,
              0
            );
            const totalExams = lesson.chapters.reduce(
              (sum, chapter) => sum + chapter.exams.length,
              0
            );
            const totalDuration = lesson.chapters.reduce(
              (sum, chapter) =>
                sum +
                chapter.teachings.reduce(
                  (chapterSum, teaching) => chapterSum + teaching.duration,
                  0
                ) +
                chapter.exams.reduce(
                  (chapterSum, exam) => chapterSum + exam.duration,
                  0
                ),
              0
            );

            return (
              <div key={lesson.id} className="p-6">
                {/* 課程標題行 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => toggleLesson(lesson.id)}
                      className="flex items-center space-x-2 hover:bg-gray-200 rounded-lg p-2 -m-2 cursor-pointer"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {lesson.name}
                        </h3>
                        {lesson.description && (
                          <p className="text-gray-600 text-sm mt-1">
                            {lesson.description}
                          </p>
                        )}
                      </div>
                    </button>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right space-y-1">
                      <div className="text-sm text-gray-600">
                        {lesson.chapters.length} 章節 • {totalTeachings}{" "}
                        教學影片 • {totalExams} 練習題
                      </div>
                      <div className="text-sm text-gray-500">
                        總時長: {Math.floor(totalDuration / 60)} 分鐘
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="icon" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="outline">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* 展開的章節內容 */}
                {isExpanded && (
                  <div className="mt-6 ml-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-medium text-gray-700">
                        章節列表
                      </h4>
                      <button className="inline-flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">
                        <Plus className="w-3 h-3 mr-1" />
                        新增章節
                      </button>
                    </div>

                    <div className="space-y-4">
                      {lesson.chapters.map((chapter) => (
                        <div
                          key={chapter.id}
                          className="bg-gray-50 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-gray-900">
                                {chapter.name}
                              </h5>
                              <p className="text-sm text-gray-600 mt-1">
                                {chapter.teachings.length} 教學影片 •{" "}
                                {chapter.exams.length} 練習題
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600 hover:text-brand-600">
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600 hover:text-red-600">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* 影片列表 */}
                          {(chapter.teachings.length > 0 ||
                            chapter.exams.length > 0) && (
                            <div className="mt-3 space-y-2">
                              {chapter.teachings.map((teaching, index) => (
                                <div
                                  key={teaching.id}
                                  className="flex items-center justify-between text-sm bg-white rounded p-2"
                                >
                                  <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 bg-brand-100 rounded flex items-center justify-center">
                                      <Play className="w-3 h-3 text-brand-600" />
                                    </div>
                                    <span className="text-gray-700">
                                      教學影片 {index + 1}
                                    </span>
                                    <span className="text-gray-500">
                                      ({Math.floor(teaching.duration / 60)}:
                                      {(teaching.duration % 60)
                                        .toString()
                                        .padStart(2, "0")}
                                      )
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <button className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-brand-600">
                                      <Edit className="w-3 h-3" />
                                    </button>
                                    <button className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-red-600">
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                              {chapter.exams.map((exam, index) => (
                                <div
                                  key={exam.id}
                                  className="flex items-center justify-between text-sm bg-white rounded p-2"
                                >
                                  <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center">
                                      <svg
                                        className="w-3 h-3 text-orange-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                                        />
                                      </svg>
                                    </div>
                                    <span className="text-gray-700">
                                      練習題 {index + 1}
                                    </span>
                                    <span className="text-gray-500">
                                      ({Math.floor(exam.duration / 60)}:
                                      {(exam.duration % 60)
                                        .toString()
                                        .padStart(2, "0")}
                                      )
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <button className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-brand-600">
                                      <Edit className="w-3 h-3" />
                                    </button>
                                    <button className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-red-600">
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
