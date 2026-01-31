import type { Route } from "./+types/_course.learn.$moduleSlug.$lessonSlug";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { prisma } from "~/services/database/prisma.server";
import { Separator } from "~/components/ui/separator";
import { Outlet } from "react-router";
import { InternalLink } from "~/components/course/internal-link";
import { checkIsCustomer } from "~/services/customer-session.server";
import { buttonVariants } from "~/components/ui/Button";
import { MobileNav } from "~/components/course/mobile-nav";

// Default app slug for single-tenant mode
const DEFAULT_APP_SLUG = "paopao-math";

export async function loader({ params, request }: Route.LoaderArgs) {
  const { moduleSlug, lessonSlug } = params;

  const isCustomer = await checkIsCustomer({
    slug: DEFAULT_APP_SLUG,
    request,
  });

  const app = await prisma.app.findFirst({
    where: {
      slug: DEFAULT_APP_SLUG,
    },
    select: {
      id: true,
      isFree: true,
    },
  });

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

  const [prev, next] = await Promise.all([
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
      isFree: app.isFree,
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

  const lesson = await prisma.courseLesson.findUnique({
    where: { id: head.id },
    select: {
      contentHtml: true,
    },
  });

  return {
    isAdmin: false,
    isCustomer,
    isFree: app.isFree,
    lesson: {
      ...head,
      ...lesson,
      isVisible: true,
    },
    prev: decorate(prev),
    next: decorate(next),
  };
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { lesson, isCustomer, isFree } = loaderData;

  return (
    <main className="flex-1 pb-20">
      <div className="sticky top-0 z-10 flex justify-between bg-white/90 px-3 py-2.5 backdrop-blur-sm sm:py-3.5">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="cursor-pointer" />
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-4"
          />

          <div className="flex items-center gap-2 px-1 text-sm font-medium">
            <InternalLink
              to="/"
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
        {!isFree && (
          <>
            {/* Mobile hamburger menu */}
            <MobileNav isCustomer={isCustomer} />
          </>
        )}
        {/* Desktop navigation */}
        <div className="hidden items-center gap-5 px-3 font-medium text-gray-700 sm:flex">
          {!isCustomer && !isFree && (
            <>
              <div className="text-sm">
                <InternalLink
                  to="/login"
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
                to="/logout"
                className="hover:underline hover:underline-offset-4"
              >
                登出
              </InternalLink>
            </div>
          )}
        </div>
      </div>
      <Outlet />
    </main>
  );
}
