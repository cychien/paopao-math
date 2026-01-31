import { Link } from "react-router";
import { Clock, BookOpen, PlayCircle } from "lucide-react";
import { cn } from "~/utils/style";
import Icon from "~/components/ui/icon";
import { TeachingIcon, Time04Icon } from "@hugeicons/core-free-icons";

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
  isPreview?: boolean;
}

export function Lesson({ lesson, index, isPreview = false }: LessonProps) {
  const formatDuration = (seconds: number, dense: boolean = false) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return dense ? `${hours}小時 ${minutes}分鐘` : `${hours} 小時 ${minutes} 分鐘`;
    }
    return dense ? `${minutes}分鐘` : `${minutes} 分鐘`;
  };

  return (
    <div className="space-y-5">
      {/* 模組標題和描述 */}
      <div>
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-gray-900 leading-snug">
                  {index + 1}. {lesson.name}
                </h3>
                {isPreview && (
                  <span className="inline-flex items-center rounded-md bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-700/10">
                    免費試看
                  </span>
                )}
              </div>
              {lesson.description && (
                <p className="text-sm text-gray-600 leading-relaxed">{lesson.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500 font-medium mt-1">
            <div className="flex items-center gap-1">
              <Icon icon={TeachingIcon} className="size-4 translate-y-px" />
              <span>{lesson.chapters.length} 單元</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon icon={Time04Icon} className="size-4 translate-y-[0.5px]" />
              <span>{formatDuration(lesson.totalDuration, true)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 章節列表 */}
      {lesson.chapters.length > 0 && (
        <div className="space-y-1 bg-gray-50/80 group-hover:bg-gray-50 rounded-lg p-1 border border-gray-200/70">
          {lesson.chapters.map((chapter, chapterIndex) => (
            <Link
              key={chapter.slug}
              to={`/learn/content/${lesson.slug}/${chapter.slug}`}
              className={cn(
                "group flex items-center justify-between gap-4 py-2.5 px-3 rounded-md",
                "hover:bg-blue-50 border border-transparent hover:border-blue-200"
              )}
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0 mt-0.5">
                  <PlayCircle className="size-4 text-brand-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-700 group-hover:text-brand-600 transition-colors truncate">
                    {chapter.name}
                  </h4>
                </div>
              </div>
              {chapter.duration > 0 && (
                <div className="flex-shrink-0 text-xs text-gray-400 group-hover:text-gray-500 font-medium tabular-nums">
                  {formatDuration(chapter.duration)}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* 無章節提示 */}
      {lesson.chapters.length === 0 && (
        <div className="py-8 text-center text-sm text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <BookOpen className="size-8 mx-auto mb-2 text-gray-400" />
          <p>課程內容即將推出</p>
        </div>
      )}
    </div>
  );
}
