import format from "format-duration";
import {
  Clock,
  ChevronDown,
  ChevronUp,
  BarChart3,
  FileText,
} from "lucide-react";
import { Lock } from "~/components/icons/Lock";
import { Syllabus } from "./Syllabus";
import React from "react";
import { Button } from "~/components/ui/Button";

type LessonProps = {
  lesson: {
    name: string;
    description?: string | undefined;
    slug: string;
    totalDuration: number;
    examCount: number;
    chapters: {
      name: string;
      duration: number;
      slug: string;
      examCount: number;
    }[];
  };
  index: number;
  isLoggedIn: boolean;
};

function Lesson({ lesson, index, isLoggedIn }: LessonProps) {
  const [mode, setMode] = React.useState<"normal" | "detailed">("normal");

  // 根據登入狀態決定是否鎖定
  const isLocked = !isLoggedIn;

  return (
    <div className="space-y-4">
      {/* 單元頭部 */}
      <div className="space-y-3">
        {/* 單元標題行 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-brand-100 text-brand-700 rounded-md font-bold font-inter">
              {index + 1}
            </div>
          </div>

          {isLocked && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-orange-50 border border-orange-300 rounded-md">
              <Lock className="size-4 text-orange-500" />
              <span className="text-xs text-orange-800 font-medium">
                購買限定
              </span>
            </div>
          )}
        </div>

        {/* 課程名稱 */}
        <h3 className="text-lg font-bold text-gray-900 leading-tight">
          {lesson.name}
        </h3>

        {/* 描述 */}
        {lesson.description && (
          <p className="text-gray-600 text-sm leading-relaxed">
            {lesson.description}
          </p>
        )}

        {/* 統計信息 */}
        {!isLocked && (
          <div className="flex flex-wrap gap-4">
            <StatsItem
              icon={<FileText className="size-4" />}
              label="章節"
              value={lesson.chapters.length}
            />
            <StatsItem
              icon={<BarChart3 className="size-4" />}
              label="例題"
              value={lesson.examCount}
            />
            <StatsItem
              icon={<Clock className="size-4" />}
              label="時長"
              value={format(lesson.totalDuration * 1000)}
            />
          </div>
        )}

        {/* 展開按鈕 - 只有登入且有章節時才顯示 */}
        {!isLocked && lesson.chapters.length > 0 && (
          <div className="pt-2">
            <Button
              // size=""
              variant="outline"
              className="w-full justify-center bg-gray-100 border-gray-200 hover:bg-gray-300/40"
              onClick={() => setMode(mode === "normal" ? "detailed" : "normal")}
            >
              {mode === "normal" ? (
                <>
                  <span>查看課程內容</span>
                  <ChevronDown className="size-4" />
                </>
              ) : (
                <>
                  <span>收合課程內容</span>
                  <ChevronUp className="size-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* 展開的課程內容 - 只有登入用戶才能看到 */}
      {!isLocked && mode === "detailed" && lesson.chapters.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 animate-in fade-in-0 duration-200">
          <Syllabus lessonSlug={lesson.slug} chapters={lesson.chapters} />
        </div>
      )}
    </div>
  );
}

type StatsItemProps = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
};

function StatsItem({ icon, label, value }: StatsItemProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="text-gray-400">{icon}</div>
      <span className="text-sm text-gray-600">
        {value} {label}
      </span>
    </div>
  );
}

export { Lesson };
