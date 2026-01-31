import { useLoaderData } from "react-router";
import { LoaderFunctionArgs } from "react-router";
import { canUserAccessPath } from "~/services/auth/permissions";
import { getCourseByAppSlug } from "~/operations/get-course-by-app-slug";
import { Lesson } from "./components/Lesson";

// Default app slug for single-tenant mode
const DEFAULT_APP_SLUG = "paopao-math";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const path = url.pathname;

  // 檢查用戶是否能訪問此路徑（即是否登入）
  const canAccess = await canUserAccessPath(request, path);

  // 從數據庫獲取課程數據
  const course = await getCourseByAppSlug(DEFAULT_APP_SLUG, {
    configId: undefined,
    isAdmin: false,
  });

  if (!course) {
    throw new Error("Course not found");
  }

  // 轉換數據格式以匹配前端組件需求
  const syllabus = course.modules.map((module) => {
    const totalDuration = module.lessons.reduce(
      (sum, lesson) => sum + (lesson.durationSec || 0),
      0
    );

    // 在新的數據結構中，沒有單獨的 exam 概念，所有內容都是 lessons
    const examCount = 0;

    return {
      name: module.title,
      description: module.summary || undefined,
      slug: module.slug,
      totalDuration,
      examCount,
      chapters: module.lessons.map((lesson) => {
        return {
          name: lesson.title,
          duration: lesson.durationSec || 0,
          slug: lesson.slug,
          examCount: 0, // 新結構沒有單獨的 exam
        };
      }),
    };
  });

  return { syllabus, isLoggedIn: canAccess };
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
