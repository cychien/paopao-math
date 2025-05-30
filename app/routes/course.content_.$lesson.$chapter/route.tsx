import { LoaderFunctionArgs } from "@remix-run/node";
import { json, Link, useLoaderData } from "@remix-run/react";
import { ChevronRight } from "lucide-react";
import { LockScreen } from "~/components/business/LockScreen";
import { Video } from "~/components/business/Video";
import { buttonVariants } from "~/components/ui/Button";
import { canUserAccessPath } from "~/services/auth/permissions";
import { getChapter } from "~/utils/course.server";
import { cn } from "~/utils/style";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const path = url.pathname;

  const canAccess = await canUserAccessPath(request, path);
  if (!canAccess) {
    return json({ notAccess: true, chapter: null });
  }

  const lessonSlug = params.lesson;
  const chapterSlug = params.chapter;

  if (!lessonSlug || !chapterSlug) {
    return null;
  }

  const chapter = getChapter({ lessonSlug, chapterSlug });

  return json({ notAccess: false, chapter });
}

export default function Page() {
  const data = useLoaderData<typeof loader>();

  if (!data) return null;

  if (data.notAccess) {
    return <LockScreen />;
  }

  const { chapter } = data;

  if (!chapter) return null;

  return (
    <div className="flex gap-18">
      <div className="flex-[75%]">
        <div className="max-sm:block flex space-between items-center">
          <div className="flex-1">
            <div className="text-sm text-gray-500 flex items-center space-x-0.5">
              <Link to="/course/content" className="hover:text-gray-900">
                課程
              </Link>
              <ChevronRight className="size-4 text-gray-300 translate-y-px" />
              <div>{chapter.lessonMeta.name}</div>
            </div>
            <h1 className="text-xl font-semibold mt-1">{chapter.name}</h1>
          </div>
          {chapter.nextChapter && (
            <Link
              to={`/course/content/${chapter.lessonMeta.slug}/${chapter.nextChapter.slug}`}
              className={cn(
                buttonVariants({ size: "sm" }),
                "max-sm:mt-4 hover:bg-brand-solid-hover rounded"
              )}
            >
              前往下一章
            </Link>
          )}
        </div>

        <hr className="border-t border-gray-100 mt-6 md:mt-8" />

        <div className="mt-6 md:mt-8 space-y-10">
          {chapter.teachings.map((t, index) => (
            <div key={t.videoId}>
              <div className="font-medium text-gray-800">
                {chapter.teachings.length > 1
                  ? `觀念講解 ${index + 1}`
                  : "觀念講解"}
              </div>
              <div className="mt-3">
                <Video videoId={t.videoId} />
              </div>
            </div>
          ))}
          {chapter.exams.map((e, index) => (
            <div key={e.videoId}>
              <div className="font-medium text-gray-800">
                {chapter.exams.length > 1
                  ? `突破關卡 ${index + 1}`
                  : "突破關卡"}
              </div>
              <div className="mt-3">
                <Video videoId={e.videoId} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-[25%] hidden sticky top-9 self-start xl:block">
        <div className="text-gray-500 text-sm">
          {chapter.lessonMeta.name}大綱
        </div>
        <div className="mt-4 pl-4 text-xs text-gray-400 border-l border-gray-200">
          {chapter.lessonMeta.chapters.map((c) => (
            <a
              key={c.slug}
              href={`/course/content/${chapter.lessonMeta.slug}/${c.slug}`}
              data-active={chapter.slug === c.slug}
              className="block py-1.5 hover:text-gray-900 data-[active=true]:text-gray-900"
            >
              {c.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
