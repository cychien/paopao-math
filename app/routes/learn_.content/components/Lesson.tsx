import { Link } from "react-router";
import { Clock, BookOpen } from "lucide-react";
import { cn } from "~/utils/style";

interface LessonProps {
  lesson: {
    name: string;
    description?: string;
    slug: string;
    totalDuration: number;
    examCount: number;
    chapters: Array<{
      name: string;
      duration: number;
      slug: string;
      examCount: number;
    }>;
  };
  index: number;
  isLoggedIn?: boolean;
}

export function Lesson({ lesson, index, isLoggedIn = true }: LessonProps) {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours} 小時 ${minutes} 分鐘`;
    }
    return `${minutes} 分鐘`;
  };

  return (
    <div className="space-y-4">
      {/* 模組標題和描述 */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {lesson.name}
            </h3>
            {lesson.description && (
              <p className="mt-1 text-sm text-gray-600">{lesson.description}</p>
            )}
          </div>
          <div className="flex-shrink-0 flex items-center space-x-1 text-sm text-gray-500">
            <Clock className="size-4" />
            <span>{formatDuration(lesson.totalDuration)}</span>
          </div>
        </div>
      </div>

      {/* 章節列表 */}
      {lesson.chapters.length > 0 && (
        <div className="space-y-1">
          {lesson.chapters.map((chapter, chapterIndex) => (
            <Link
              key={chapter.slug}
              to={
                isLoggedIn
                  ? `/learn/content/${lesson.slug}/${chapter.slug}`
                  : "/login"
              }
              className={cn(
                "block py-2.5 px-3 rounded-lg transition-colors",
                "hover:bg-gray-50 border border-transparent hover:border-gray-200"
              )}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="flex-shrink-0 text-sm font-medium text-gray-400 mt-0.5">
                    {chapterIndex + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {chapter.name}
                    </h4>
                  </div>
                </div>
                {chapter.duration > 0 && (
                  <div className="flex-shrink-0 flex items-center space-x-1 text-xs text-gray-500">
                    <Clock className="size-3" />
                    <span>{Math.round(chapter.duration / 60)} 分</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* 無章節提示 */}
      {lesson.chapters.length === 0 && (
        <div className="py-8 text-center text-sm text-gray-500">
          <BookOpen className="size-8 mx-auto mb-2 text-gray-400" />
          <p>課程內容即將推出</p>
        </div>
      )}
    </div>
  );
}
