import { useLoaderData } from "react-router";
import { LoaderFunctionArgs } from "react-router";
import { getCourseByAppSlug } from "~/operations/get-course-by-app-slug";
import { Lesson } from "./components/Lesson";

// Default app slug for single-tenant mode
const DEFAULT_APP_SLUG = "paopao-math";

export async function loader({ request }: LoaderFunctionArgs) {
  // 從數據庫獲取課程數據
  const course = await getCourseByAppSlug(DEFAULT_APP_SLUG, {
    configId: undefined,
    isAdmin: false,
  });

  if (!course) {
    throw new Error("Course not found");
  }

  // 只顯示公開的模組和課程
  const syllabus = course.modules
    .filter((module) => module.isPublic)
    .map((module) => {
      const publicLessons = module.lessons.filter((lesson) => lesson.isPublic);
      const totalDuration = publicLessons.reduce(
        (sum, lesson) => sum + (lesson.durationSec || 0),
        0
      );

      return {
        name: module.title,
        description: module.summary || undefined,
        slug: module.slug,
        totalDuration,
        examCount: 0,
        chapters: publicLessons.map((lesson) => ({
          name: lesson.title,
          duration: lesson.durationSec || 0,
          slug: lesson.slug,
          examCount: 0,
        })),
      };
    })
    .filter((module) => module.chapters.length > 0); // 只保留有公開課程的模組

  return { syllabus };
}

export default function Page() {
  const { syllabus } = useLoaderData<typeof loader>();

  return (
    <div className="divide-y-1 divide-gray-200">
      <div className="pb-6">
        <h1 className="text-xl font-semibold">免費試讀</h1>
        <p className="text-sm text-gray-500 mt-2">
          體驗精選的免費課程內容
        </p>
      </div>

      <div className="py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 max-w-7xl items-start">
          {syllabus.map((lesson, index) => (
            <div
              key={lesson.slug}
              className="bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <div className="p-4">
                <Lesson lesson={lesson} index={index} isPreview={true} />
              </div>
            </div>
          ))}
        </div>

        {syllabus.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>目前沒有免費試讀內容</p>
          </div>
        )}
      </div>
    </div>
  );
}
