import { json, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { canUserAccessPath } from "~/services/auth/permissions";
import { getAllLessonsWithDetails } from "~/services/database/course";
import { Lesson } from "./components/Lesson";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const path = url.pathname;

  // 檢查用戶是否能訪問此路徑（即是否登入）
  const canAccess = await canUserAccessPath(request, path);

  // 從數據庫獲取課程數據
  const lessons = await getAllLessonsWithDetails();

  // 轉換數據格式以匹配前端組件需求
  const syllabus = lessons.map((lesson) => {
    const totalDuration = lesson.chapters.reduce(
      (sum, chapter) =>
        sum +
        chapter.teachings.reduce(
          (tSum, teaching) => tSum + teaching.duration,
          0
        ) +
        chapter.exams.reduce((eSum, exam) => eSum + exam.duration, 0),
      0
    );

    const examCount = lesson.chapters.reduce(
      (sum, chapter) => sum + chapter.exams.length,
      0
    );

    return {
      name: lesson.name,
      description: lesson.description || undefined, // 將 null 轉換為 undefined
      slug: lesson.slug,
      totalDuration,
      examCount,
      chapters: lesson.chapters.map((chapter) => {
        const chapterDuration =
          chapter.teachings.reduce(
            (sum, teaching) => sum + teaching.duration,
            0
          ) + chapter.exams.reduce((sum, exam) => sum + exam.duration, 0);

        return {
          name: chapter.name,
          duration: chapterDuration,
          slug: chapter.slug,
          examCount: chapter.exams.length,
        };
      }),
    };
  });

  return json({ syllabus, isLoggedIn: canAccess });
}

export default function Page() {
  const { syllabus, isLoggedIn } = useLoaderData<typeof loader>();

  return (
    <div className="divide-y-1 divide-gray-200">
      <div className="pb-6">
        {/* <h1 className="text-sm text-gray-500">課程</h1> */}
        <h1 className="text-xl font-semibold">課程</h1>
      </div>

      <div className="py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 max-w-7xl items-start">
          {syllabus.map((lesson, index) => (
            <div
              key={lesson.slug}
              className="bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <div className="p-4">
                <Lesson lesson={lesson} index={index} isLoggedIn={isLoggedIn} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
