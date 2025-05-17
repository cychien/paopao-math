import { json, redirect, useLoaderData } from "@remix-run/react";
import { Clock } from "lucide-react";
import { getSyllabus } from "~/utils/course.server";
import format from "format-duration";
import { LoaderFunctionArgs } from "@remix-run/node";
import { canAccess } from "~/utils/permission";
import { trialPermissions } from "~/data/permission";
import { safeRedirect } from "remix-utils/safe-redirect";

export function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const path = url.pathname;
  const ok = canAccess({
    permissions: trialPermissions,
    pathname: path,
  });
  if (!ok) {
    return redirect(safeRedirect("/"));
  }

  const syllabus = getSyllabus();
  return json({ syllabus });
}

export default function Page() {
  const { syllabus } = useLoaderData<typeof loader>();

  return (
    <div className="divide-y-1 divide-gray-100">
      <div className="pb-6">
        <h1 className="text-sm text-gray-500">課程</h1>
        <h2 className="text-xl font-semibold mt-1">課程總覽</h2>
      </div>
      <div className="pt-6 space-y-8">
        {syllabus.map((lesson, index) => (
          <div key={lesson.slug} className="max-xl:space-y-5 xl:flex gap-16">
            <div>
              <div
                className="size-8 flex items-center justify-center text-gray-500 font-medium border border-gray-200 rounded font-inter"
                style={{
                  boxShadow:
                    "0px 1px 2px 0px var(--Colors-Effects-Shadows-shadow-xs, rgba(10, 13, 18, 0.05))",
                }}
              >
                {index + 1}
              </div>
              <div className="text-xl font-semibold mt-3">{lesson.name}</div>
              <p className="max-sm:hidden max-w-[300px] text-sm mt-4 text-gray-500 leading-[24px]">
                {lesson.description}
              </p>
              <div className="mt-4">
                <StatsBar
                  chapterCount={lesson.chapters.length}
                  examCount={lesson.examCount}
                  totalDuration={lesson.totalDuration}
                />
              </div>
            </div>
            <div className="border border-gray-200 rounded-md flex-1 overflow-hidden">
              {lesson.chapters.map((chapter) => (
                <a
                  key={chapter.slug}
                  href={`/course/content/${lesson.slug}/${chapter.slug}`}
                  className="px-4 py-3 text-sm flex justify-between [&:not(:last-child)]:border-b border-gray-200 hover:bg-gray-100 transition-colors gap-1"
                >
                  <div className="text-gray-700 font-medium">
                    {chapter.name}
                  </div>
                  <div className="flex items-center text-gray-500 space-x-1.5 shrink-0">
                    <span>{chapter.examCount} 例題</span>
                    <div className="size-[3px] bg-gray-200 rounded-full" />
                    <span>{format(chapter.duration * 1000)}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
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
