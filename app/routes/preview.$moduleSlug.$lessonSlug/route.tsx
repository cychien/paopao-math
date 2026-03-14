import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useNavigation, Link } from "react-router";
import { prisma } from "~/services/database/prisma.server";
import { cn } from "~/utils/style";
import { Lock } from "lucide-react";
import { Button } from "~/components/ui/Button/Button";
import { getAppBySlug } from "~/services/cache/cached-queries.server";
import { usePurchase } from "~/hooks/use-purchase";
import Icon from "~/components/ui/icon";
import { SparklesIcon } from "@hugeicons/core-free-icons";

// Default app slug for single-tenant mode
const DEFAULT_APP_SLUG = "paopao-math";

export async function loader({ params }: LoaderFunctionArgs) {
  const { moduleSlug, lessonSlug } = params;

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

  // For preview route, only show content if module is public OR lesson is public
  const isVisible =
    head.module.isPublic === true ||
    (head.module.isPublic === false && head.isPublic === true);

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
    isVisible
      ? prisma.courseLesson.findUnique({
        where: { id: head.id },
        select: {
          contentHtml: true,
        },
      })
      : Promise.resolve(null),
  ]);

  const decorate = (
    l?: { id: string; title: string; slug: string; isPublic: boolean } | null
  ) =>
    l && {
      ...l,
      isVisible:
        head.module.isPublic === true ||
        (head.module.isPublic === false && l.isPublic === true),
    };

  if (!isVisible) {
    return {
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
  const { lesson, prev, next } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const { purchase, isLoading } = usePurchase();

  // 當正在導航時（loading 新頁面），立即隱藏當前內容以避免 iframe 閃爍
  const isNavigating = navigation.state === "loading";

  if (!lesson) {
    return null;
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-4xl mx-auto">
            <nav className="flex items-center gap-2 text-sm">
              <Link
                to="/preview"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                課程大綱
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">{lesson.module.title}</span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">{lesson.title}</span>
              {lesson.isVisible ? (
                <span className="ml-2 inline-flex items-center rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600 ring-1 ring-inset ring-brand-500/10 gap-1">
                  <Icon icon={SparklesIcon} className="size-3" />
                  免費
                </span>
              ) : (
                <span className="ml-2 inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-700/10 gap-1">
                  <Lock className="size-2.5" />
                  付費
                </span>
              )}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn("py-8 sm:py-12", isNavigating && "opacity-0")}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Content Card */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 sm:p-10">
                {/* Content or Paywall */}
                {lesson.isVisible ? (
                  <div
                    className={cn(
                      "prose prose-lg max-w-none",
                      "prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:font-bold prose-h2:tracking-tight",
                      "prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:font-bold",
                      "prose-p:text-gray-700 prose-p:leading-relaxed prose-p:my-4",
                      "prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6",
                      "prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6",
                      "prose-li:my-2 prose-li:text-gray-700",
                      "prose-a:text-brand-600 prose-a:underline prose-a:underline-offset-2 prose-a:font-medium hover:prose-a:text-brand-700",
                      "prose-strong:text-gray-900 prose-strong:font-semibold",
                      "prose-img:rounded-lg prose-img:shadow-sm prose-img:my-6",
                      "prose-figure:my-8",

                      // image
                      "[&_.image-container]:relative [&_.image-container]:aspect-video [&_.image-container]:overflow-hidden [&_.image-container]:rounded-lg [&_.image-container]:bg-gray-100 [&_.image-container]:shadow-sm [&_.image-container]:my-6",
                      "[&_.image-img]:h-full [&_.image-img]:w-full [&_.image-img]:bg-gray-100 [&_.image-img]:object-contain",

                      // video
                      "[&_.video-container]:relative [&_.video-container]:aspect-video [&_.video-container]:w-full [&_.video-container]:overflow-hidden [&_.video-container]:rounded-lg [&_.video-container]:shadow-sm [&_.video-container]:my-6 [&_.video-container]:border [&_.video-container]:border-gray-200",
                      "[&_.video-iframe]:absolute [&_.video-iframe]:top-0 [&_.video-iframe]:left-0 [&_.video-iframe]:h-full [&_.video-iframe]:w-full [&_.video-iframe]:border-0",

                      // file
                      "[&_.file-attachment-container]:border-border [&_.file-attachment-container]:relative [&_.file-attachment-container]:block [&_.file-attachment-container]:min-h-20 [&_.file-attachment-container]:rounded-lg [&_.file-attachment-container]:border [&_.file-attachment-container]:bg-gray-50 [&_.file-attachment-container]:p-4 [&_.file-attachment-container]:no-underline [&_.file-attachment-container]:hover:border-gray-300 [&_.file-attachment-container]:transition-colors [&_.file-attachment-container]:my-4",
                      "[&_.file-attachment-content]:flex [&_.file-attachment-content]:gap-4",
                      "[&_.file-attachment-icon-container]:flex [&_.file-attachment-icon-container]:aspect-square [&_.file-attachment-icon-container]:w-16 [&_.file-attachment-icon-container]:flex-shrink-0 [&_.file-attachment-icon-container]:items-center [&_.file-attachment-icon-container]:justify-center [&_.file-attachment-icon-container]:rounded-md [&_.file-attachment-icon-container]:bg-gray-200/60 [&_.file-attachment-icon-container]:text-gray-500",
                      "[&_.file-attachment-icon>svg]:size-7",
                      "[&_.file-attachment-name]:text-sm [&_.file-attachment-name]:font-semibold [&_.file-attachment-name]:text-gray-900",
                      "[&_.file-attachment-type]:mt-1 [&_.file-attachment-type]:text-xs [&_.file-attachment-type]:text-gray-500",
                      "[&_.file-attachment-size]:mt-1 [&_.file-attachment-size]:text-xs [&_.file-attachment-size]:text-gray-400",
                      "[&_.file-attachment-indicator]:absolute [&_.file-attachment-indicator]:top-4 [&_.file-attachment-indicator]:right-4 [&_.file-attachment-indicator]:text-gray-400 [&_.file-attachment-indicator>svg]:size-4"
                    )}
                    dangerouslySetInnerHTML={{ __html: lesson.contentHtml ?? "" }}
                  />
                ) : (
                  <div className="py-12 text-center">
                    <div className="mx-auto max-w-md">
                      <div className="mb-6 flex justify-center">
                        <div className="rounded-full bg-gradient-to-br from-brand-50 to-brand-100 p-4">
                          <Lock className="size-10 text-brand-600" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        完整內容僅限會員
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-8">
                        解鎖完整課程內容，獲得系統化學習體驗，掌握所有知識點
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                          size="lg"
                          className="rounded-full px-8 shadow-lg shadow-brand-500/20"
                          onClick={purchase}
                          disabled={isLoading}
                        >
                          {isLoading ? "處理中..." : "立即解鎖完整課程"}
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          size="lg"
                          className="rounded-full px-8"
                        >
                          <Link to="/preview">返回試讀列表</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            {(prev || next) && (
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prev ? (
                  <Link
                    to={`/preview/${lesson.module.slug}/${prev.slug}`}
                    className="group flex flex-col gap-2 p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-gray-300"
                  >
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      上一章
                    </div>
                    <div className="text-base font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
                      {prev.title}
                    </div>
                  </Link>
                ) : (
                  <div />
                )}

                {next ? (
                  <Link
                    to={`/preview/${lesson.module.slug}/${next.slug}`}
                    className="group flex flex-col gap-2 p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 text-right"
                  >
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      下一章
                    </div>
                    <div className="text-base font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
                      {next.title}
                    </div>
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
