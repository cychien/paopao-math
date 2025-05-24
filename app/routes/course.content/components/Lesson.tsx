import format from "format-duration";
import { Clock } from "lucide-react";
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
};

function Lesson({ lesson, index }: LessonProps) {
  const [mode, setMode] = React.useState<"normal" | "detailed">("normal");

  const isLocked = lesson.chapters.length === 0;

  return (
    <div key={lesson.slug} className="max-xl:space-y-5 xl:flex gap-16">
      <div className="xl:w-[300px]">
        <div className="text-sm text-brand-500 font-medium">
          第 {index + 1} 單元
        </div>
        <div className="text-xl font-semibold mt-1 flex items-center">
          {lesson.name}
          {isLocked && <Lock className="ml-2 size-4 text-[#FBBF24]" />}
        </div>

        {!isLocked && (
          <>
            {mode === "normal" && (
              <Button
                size="sm"
                variant="link"
                className="px-0 font-normal text-gray-500"
                onClick={() => {
                  setMode("detailed");
                }}
              >
                展開主題
              </Button>
            )}

            {mode === "detailed" && (
              <>
                <p className="max-sm:hidden text-sm mt-4 text-gray-500 leading-[24px]">
                  {lesson.description}
                </p>
                {!isLocked && (
                  <div className="mt-4">
                    <StatsBar
                      chapterCount={lesson.chapters.length}
                      examCount={lesson.examCount}
                      totalDuration={lesson.totalDuration}
                    />
                  </div>
                )}
                <Button
                  size="sm"
                  variant="link"
                  className="mt-2 px-0 font-normal text-gray-500"
                  onClick={() => {
                    setMode("normal");
                  }}
                >
                  收合主題
                </Button>
              </>
            )}
          </>
        )}
      </div>
      {!isLocked && mode === "detailed" && (
        <Syllabus lessonSlug={lesson.slug} chapters={lesson.chapters} />
      )}
    </div>
  );
}

type StatsBarProps = {
  chapterCount: number;
  examCount: number;
  totalDuration: number;
};

function StatsBar({ chapterCount, examCount, totalDuration }: StatsBarProps) {
  return (
    <div className="flex text-sm text-gray-500 divide-x-dot-3">
      <div className="pr-2">{chapterCount} 單元</div>
      <div className="px-2">{examCount} 例題</div>
      <div className="flex items-center px-2">
        <Clock className="size-4 text-gray-400 translate-y-px" />
        <span className="ml-1">{format(totalDuration * 1000)}</span>
      </div>
      <div className="flex items-center pl-2">進度 0%</div>
    </div>
  );
}

export { Lesson };
