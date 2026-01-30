import { Link } from "react-router";
import format from "format-duration";
import { Clock, BarChart3, ChevronRight } from "lucide-react";

type SyllabusProps = {
  lessonSlug: string;
  chapters: Array<{
    name: string;
    duration: number;
    slug: string;
    examCount: number;
  }>;
};

function Syllabus({ lessonSlug, chapters }: SyllabusProps) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-gray-700 mb-3 flex items-center space-x-2">
        <div className="w-1 h-4 bg-brand-500 rounded-full" />
        <span>課程章節</span>
      </div>

      <div className="space-y-2">
        {chapters.map((chapter, index) => (
          <Link
            key={chapter.slug}
            to={`/course/content/${lessonSlug}/${chapter.slug}`}
            className="group block p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-brand-300 hover:bg-brand-50 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex space-x-3 flex-1 min-w-0">
                {/* 章節編號 */}
                <div className="flex-shrink-0 w-6 h-6 bg-gray-200 text-gray-600 rounded-md flex items-center justify-center text-xs font-semibold group-hover:bg-brand-200/80 transition-colors font-inter">
                  {index + 1}
                </div>

                {/* 章節信息 */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 group-hover:text-brand-700 transition-colors text-sm truncate">
                    {chapter.name}
                  </h4>

                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <BarChart3 className="size-3" />
                      <span>{chapter.examCount}</span>
                    </div>

                    <div className="w-0.5 h-0.5 bg-gray-400 rounded-full" />

                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <Clock className="size-3" />
                      <span>{format(chapter.duration * 1000)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 箭頭 */}
              <ChevronRight className="size-4 text-gray-400 group-hover:text-brand-600 transition-colors flex-shrink-0" />
            </div>
          </Link>
        ))}
      </div>

      {chapters.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          <div className="w-10 h-10 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
            <BarChart3 className="size-5 text-gray-400" />
          </div>
          <p className="text-sm">暫無可用章節</p>
        </div>
      )}
    </div>
  );
}

export { Syllabus };
