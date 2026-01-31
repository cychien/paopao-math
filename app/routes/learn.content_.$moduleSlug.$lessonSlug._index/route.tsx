import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useNavigation, useFetcher } from "react-router";
import { prisma } from "~/services/database/prisma.server";
import { customerContext } from "~/middleware/auth-context";
import { cn } from "~/utils/style";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { buttonVariants } from "~/components/ui/Button";
import { FreePreviewBadge, PremiumBadge } from "~/components/course/identity-badge";
import { InternalLink } from "~/components/course/internal-link";
import { getAppBySlug } from "~/services/cache/cached-queries.server";
import { Badge } from "~/components/ui/badge";
import { CheckCircleSolid } from "~/components/icons/CheckCircleSolid";

// Default app slug for single-tenant mode
const DEFAULT_APP_SLUG = "paopao-math";

export async function loader({ params, context }: LoaderFunctionArgs) {
  const { moduleSlug, lessonSlug } = params;

  // Get customer data from context (loaded by parent middleware)
  // The middleware ensures customerData is always present (or redirects to login)
  const customerData = context.get(customerContext);
  const isCustomer = true; // Always true since middleware ensures authentication
  const isFree = customerData.isFree;

  // Use cached query for per-request deduplication
  const app = await getAppBySlug(DEFAULT_APP_SLUG);

  if (!app) {
    throw new Error("App not found");
  }

  const head = await prisma.courseLesson.findFirst({
    where: {
      slug: lessonSlug,
      isDraft: false,
      module: { courseId: app.id, slug: moduleSlug, isDraft: false },
    },
    select: {
      id: true,
      title: true,
      summary: true,
      slug: true,
      isPublic: true,
      order: true,
      moduleId: true,
      module: { select: { isPublic: true, id: true, title: true, slug: true } },
    },
  });

  if (!head) {
    throw new Response("Not Found", { status: 404 });
  }

  const isVisible =
    isCustomer || app.isFree
      ? true
      : head.module.isPublic === true ||
      (head.module.isPublic === false && head.isPublic === true);

  // Check if the current lesson is completed
  const isCompleted = await prisma.customerLessonProgress.findFirst({
    where: {
      customerId: customerData.customerId,
      lessonId: head.id,
    },
  });

  // Execute all dependent queries in parallel (prev, next, and content if visible)
  const [prev, next, content] = await Promise.all([
    prisma.courseLesson.findFirst({
      where: {
        moduleId: head.moduleId,
        isDraft: false,
        order: { lt: head.order },
      },
      orderBy: { order: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        isPublic: true,
        order: true,
      },
    }),
    prisma.courseLesson.findFirst({
      where: {
        moduleId: head.moduleId,
        isDraft: false,
        order: { gt: head.order },
      },
      orderBy: { order: "asc" },
      select: {
        id: true,
        title: true,
        slug: true,
        isPublic: true,
        order: true,
      },
    }),
    isVisible ? prisma.courseLesson.findUnique({
      where: { id: head.id },
      select: {
        contentHtml: true,
      },
    }) : Promise.resolve(null),
  ]);

  const decorate = (
    l?: { id: string; title: string; slug: string; isPublic: boolean } | null,
  ) =>
    l && {
      ...l,
      isVisible:
        head.module.isPublic === true ||
        (head.module.isPublic === false && l.isPublic === true),
    };

  if (!isVisible) {
    return {
      isAdmin: false,
      isCustomer,
      isFree,
      isCompleted: !!isCompleted,
      lesson: {
        id: head.id,
        title: head.title,
        summary: head.summary,
        contentHtml: null,
        isPublic: head.isPublic,
        slug: head.slug,
        module: head.module,
        isVisible: false,
      },
      prev: decorate(prev) ?? null,
      next: decorate(next) ?? null,
    };
  }

  return {
    isAdmin: false,
    isCustomer,
    isFree,
    isCompleted: !!isCompleted,
    lesson: {
      ...head,
      ...content,
      isVisible: true,
    },
    prev: decorate(prev),
    next: decorate(next),
  };
}

function Page() {
  const { lesson, prev, next, isCustomer, isFree, isCompleted } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const progressFetcher = useFetcher();

  // 當正在導航時（loading 新頁面），立即隱藏當前內容以避免 iframe 閃爍
  const isNavigating = navigation.state === "loading";

  // Function to mark lesson as complete
  const markLessonComplete = () => {
    if (lesson?.id) {
      progressFetcher.submit(
        { lessonId: lesson.id },
        { method: "POST", action: "/api/progress", encType: "application/json" }
      );
    }
  };

  if (!lesson) {
    return null;
  }

  const canAccessPrivate = isCustomer || isFree;

  return (
    <main className={cn("flex-1 pb-20", isNavigating && "opacity-0")}>
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-10 flex justify-between bg-white/90 px-3 py-2.5 backdrop-blur-sm sm:py-3.5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-1 text-sm font-medium">
            <InternalLink
              to="/learn/content"
              className="text-gray-400 hover:text-gray-950 active:text-gray-950"
            >
              課程
            </InternalLink>
            <span className="text-gray-300">/</span>
            <span className="text-gray-400">{lesson?.module?.title}</span>
            <span className="text-gray-300">/</span>
            <span>{lesson?.title}</span>
          </div>
        </div>
        {/* {!isFree && (
          <MobileNav isCustomer={isCustomer} />
        )} */}
        {/* Desktop navigation */}
        {/* <div className="hidden items-center gap-5 px-3 font-medium text-gray-700 sm:flex">
          {!isCustomer && !isFree && (
            <>
              <div className="text-sm">
                <InternalLink
                  to="/auth/login"
                  className="hover:underline hover:underline-offset-4"
                >
                  登入
                </InternalLink>
              </div>
              <div className="text-sm">
                <InternalLink
                  to="/purchase"
                  className={buttonVariants({ size: "sm" })}
                >
                  購買
                </InternalLink>
              </div>
            </>
          )}
          {isCustomer && !isFree && (
            <div className="text-sm">
              <InternalLink
                to="/auth/logout"
                className="hover:underline hover:underline-offset-4"
              >
                登出
              </InternalLink>
            </div>
          )}
        </div> */}
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto flex max-w-2xl gap-x-20 pt-4 lg:max-w-3xl">
            <div className="w-full flex-1">
              {!canAccessPrivate && (
                <div>
                  {lesson.isVisible ? <FreePreviewBadge /> : <PremiumBadge />}
                </div>
              )}

              <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold">{lesson.title}</h1>
                  {isCompleted && (
                    <div className='mt-3'>
                      <Badge className="bg-success-50 text-success-700 px-1 pr-2 py-1 rounded-full border border-success-600/20">
                        <CheckCircleSolid className="size-4! text-success-600" />
                        已完成
                      </Badge>
                    </div>
                  )}
                </div>

                {lesson.summary && (
                  <p className="mt-4 text-gray-500 sm:hidden">{lesson.summary}</p>
                )}
                {(prev || next) && (
                  <div className="mt-4 flex flex-shrink-0 items-center sm:mt-0">
                    <InternalLink
                      to={
                        prev ? `/learn/content/${lesson.module.slug}/${prev.slug}` : ""
                      }
                      data-disabled={!prev}
                      onClick={prev ? markLessonComplete : undefined}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "icon" }),
                        "group rounded-r-none active:bg-gray-100 data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed data-[disabled=true]:bg-gray-100",
                      )}
                    >
                      <ArrowLeft className="size-4 translate-y-px group-data-[disabled=true]:text-gray-400/60" />
                    </InternalLink>

                    <InternalLink
                      to={
                        next ? `/learn/content/${lesson.module.slug}/${next.slug}` : ""
                      }
                      data-disabled={!next}
                      onClick={next ? markLessonComplete : undefined}
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
                    "[&_.video-container]:relative [&_.video-container]:aspect-video [&_.video-container]:w-full [&_.video-container]:overflow-hidden [&_.video-container]:rounded-[5px]",
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
                        prev ? `/learn/content/${lesson.module.slug}/${prev.slug}` : ""
                      }
                      onClick={prev ? markLessonComplete : undefined}
                      className={cn(
                        "border-border flex w-[48%] cursor-pointer flex-col items-start gap-1 rounded-md border p-3 shadow-xs transition-colors hover:bg-gray-50 active:bg-gray-100 sm:w-[45%]",
                        !prev && "invisible",
                      )}
                    >
                      <div className="text-sm font-medium text-gray-400">
                        完成並返回上一章
                      </div>
                      <span className="flex items-center gap-2 text-sm font-medium">
                        {prev?.title}
                      </span>
                    </InternalLink>

                    <InternalLink
                      to={
                        next ? `/learn/content/${lesson.module.slug}/${next.slug}` : ""
                      }
                      onClick={next ? markLessonComplete : undefined}
                      className={cn(
                        "border-border flex w-[48%] cursor-pointer flex-col items-end gap-1 rounded-md border p-3 shadow-xs transition-colors hover:bg-gray-50 active:bg-gray-100 sm:w-[45%]",
                        !next && "invisible",
                      )}
                    >
                      <div className="text-sm font-medium text-gray-400">
                        完成並前往下一章
                      </div>
                      <span className="flex items-center gap-2 text-sm font-medium">
                        {next?.title}
                      </span>
                    </InternalLink>
                  </div>
                </div>
              )}
            </div>
            {/* <div className="hidden w-66 pt-4 lg:block">
              <div className="sticky top-18 text-sm">
                <div className="font-medium">重點段落</div>
                <div className="mt-4">Table of contents here</div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Page;
