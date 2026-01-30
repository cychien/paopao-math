import { useRouteLoaderData } from "react-router";
import type { loader } from "./_course.learn.$moduleSlug.$lessonSlug";
import { cn } from "~/utils/style";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { buttonVariants } from "~/components/ui/Button";
import { FreePreviewBadge, PremiumBadge } from "~/components/course/identity-badge";
import { InternalLink } from "~/components/course/internal-link";

function Page() {
  const loaderData = useRouteLoaderData<typeof loader>(
    "routes/_course.learn.$moduleSlug.$lessonSlug",
  );
  if (!loaderData) {
    return null;
  }

  const { lesson, prev, next, isCustomer, isFree } = loaderData;
  if (!lesson) {
    return null;
  }

  const canAccessPrivate = isCustomer || isFree;

  return (
    <div className="px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto flex max-w-2xl gap-x-20 pt-4 lg:max-w-6xl">
          <div className="w-full flex-1">
            {!canAccessPrivate && (
              <div>
                {lesson.isVisible ? <FreePreviewBadge /> : <PremiumBadge />}
              </div>
            )}

            <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-3xl font-bold">{lesson.title}</h1>
              {lesson.summary && (
                <p className="mt-4 text-gray-500 sm:hidden">{lesson.summary}</p>
              )}
              {(prev || next) && (
                <div className="mt-4 flex flex-shrink-0 items-center sm:mt-0">
                  <InternalLink
                    to={
                      prev ? `/learn/${lesson.module.slug}/${prev.slug}` : ""
                    }
                    data-disabled={!prev}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "icon" }),
                      "group rounded-r-none active:bg-gray-100 data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed data-[disabled=true]:bg-gray-100",
                    )}
                  >
                    <ArrowLeft className="size-4 translate-y-px group-data-[disabled=true]:text-gray-400/60" />
                  </InternalLink>

                  <InternalLink
                    to={
                      next ? `/learn/${lesson.module.slug}/${next.slug}` : ""
                    }
                    data-disabled={!next}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "icon" }),
                      "group -ml-[1px] rounded-l-none active:bg-gray-100 data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed data-[disabled=true]:bg-gray-100",
                    )}
                  >
                    <ArrowRight className="size-4 translate-y-px group-data-[disabled=true]:text-gray-400/60" />
                  </InternalLink>
                </div>
              )}
            </div>

            {lesson.summary && (
              <p className="mt-4 hidden text-gray-500 sm:block">
                {lesson.summary}
              </p>
            )}

            {lesson.isVisible && (
              <div
                className={cn(
                  !lesson.summary && "mt-12!",
                  "mt-8 w-full max-w-none flex-1 [&>*:first-child]:mt-0! [&>*:first-child>*]:mt-0! [&>*:last-child]:mb-0! [&>*:last-child>*]:mb-0!",
                  "prose prose-h2:text-2xl prose-h2:mt-15 prose-h3:text-xl prose-h3:mt-10 prose-ul:list-disc prose-ol:list-decimal prose-li:my-1 prose-a:text-sky-700 prose-a:underline prose-a:underline-offset-2 prose-a:cursor-pointer prose-p:my-6 prose-img:my-0 prose-figure:my-0",
                  "[&>*:not(figure)+figure]:mt-8! [&>figure+*:not(figure)]:mt-8! [&>figure+figure]:mt-6!",

                  // figure, component special spacing
                  "[&>*:not(figure,.component)+.component]:mt-10! [&>*:not(figure,.component)+figure]:mt-10! [&>.component+*:not(figure,.component)]:mt-10! [&>figure+*:not(figure,.component)]:mt-10!",
                  "[&>.component+.component]:mt-6! [&>.component+figure]:mt-6! [&>figure+.component]:mt-6! [&>figure+figure]:mt-6!",

                  // image
                  "[&_.image-container]:relative [&_.image-container]:aspect-video [&_.image-container]:overflow-hidden [&_.image-container]:rounded-[5px] [&_.image-container]:bg-gray-100",
                  "[&_.image-img]:h-full [&_.image-img]:w-full [&_.image-img]:bg-gray-100 [&_.image-img]:object-contain",

                  // video
                  "[&_.video-container]:relative [&_.video-container]:aspect-video [&_.video-container]:w-full [&_.video-container]:overflow-hidden [&_.video-container]:rounded-[5px] [&_.video-container]:bg-gray-100",
                  "[&_.video-iframe]:absolute [&_.video-iframe]:top-0 [&_.video-iframe]:left-0 [&_.video-iframe]:h-full [&_.video-iframe]:w-full [&_.video-iframe]:border-0",

                  // file
                  "[&_.file-attachment-container]:border-border [&_.file-attachment-container]:relative [&_.file-attachment-container]:block [&_.file-attachment-container]:min-h-20 [&_.file-attachment-container]:rounded-md [&_.file-attachment-container]:border [&_.file-attachment-container]:bg-gray-50 [&_.file-attachment-container]:p-2 [&_.file-attachment-container]:no-underline [&_.file-attachment-container]:hover:border-gray-300",
                  "[&_.file-attachment-content]:flex [&_.file-attachment-content]:gap-4",
                  "[&_.file-attachment-icon-container]:flex [&_.file-attachment-icon-container]:aspect-square [&_.file-attachment-icon-container]:w-20 [&_.file-attachment-icon-container]:flex-shrink-0 [&_.file-attachment-icon-container]:items-center [&_.file-attachment-icon-container]:justify-center [&_.file-attachment-icon-container]:rounded-md [&_.file-attachment-icon-container]:bg-gray-200/60 [&_.file-attachment-icon-container]:text-gray-500",
                  "[&_.file-attachment-icon>svg]:size-8",
                  "[&_.file-attachment-name]:text-sm [&_.file-attachment-name]:font-semibold",
                  "[&_.file-attachment-type]:mt-1 [&_.file-attachment-type]:text-xs [&_.file-attachment-type]:text-gray-500",
                  "[&_.file-attachment-size]:mt-1 [&_.file-attachment-size]:text-xs [&_.file-attachment-size]:text-gray-400",
                  "[&_.file-attachment-indicator]:absolute [&_.file-attachment-indicator]:top-3 [&_.file-attachment-indicator]:right-3 [&_.file-attachment-indicator]:-translate-y-0.5 [&_.file-attachment-indicator]:text-gray-400 [&_.file-attachment-indicator>svg]:size-4",
                )}
                dangerouslySetInnerHTML={{ __html: lesson.contentHtml ?? "" }}
              />
            )}

            {!lesson.isVisible && (
              <div className="mt-8">
                <div className="font-medium">完整內容僅限會員</div>
              </div>
            )}

            {(prev || next) && (
              <div className="mt-12">
                <Separator />
                <div className="mt-6 flex justify-between">
                  <InternalLink
                    to={
                      prev ? `/course/${lesson.module.slug}/${prev.slug}` : ""
                    }
                    className={cn(
                      "border-border flex w-[48%] cursor-pointer flex-col items-start gap-1 rounded-md border p-3 shadow-xs transition-colors hover:bg-gray-50 active:bg-gray-100 sm:w-[45%]",
                      !prev && "invisible",
                    )}
                  >
                    <div className="text-sm font-medium text-gray-400">
                      前一章
                    </div>
                    <span className="flex items-center gap-2 text-sm font-medium">
                      {prev?.title}
                    </span>
                  </InternalLink>

                  <InternalLink
                    to={
                      next ? `/course/${lesson.module.slug}/${next.slug}` : ""
                    }
                    className={cn(
                      "border-border flex w-[48%] cursor-pointer flex-col items-end gap-1 rounded-md border p-3 shadow-xs transition-colors hover:bg-gray-50 active:bg-gray-100 sm:w-[45%]",
                      !next && "invisible",
                    )}
                  >
                    <div className="text-sm font-medium text-gray-400">
                      下一章
                    </div>
                    <span className="flex items-center gap-2 text-sm font-medium">
                      {next?.title}
                    </span>
                  </InternalLink>
                </div>
              </div>
            )}
          </div>
          <div className="hidden w-66 pt-4 lg:block">
            <div className="sticky top-18 text-sm">
              <div className="font-medium">重點段落</div>
              <div className="mt-4">Table of contents here</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
