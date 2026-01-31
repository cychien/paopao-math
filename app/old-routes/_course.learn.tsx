import * as React from "react";
import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "~/components/ui/sidebar";
import {
  BadgeCheck,
  BookMarked,
  FileText,
  GraduationCap,
} from "lucide-react";
import { buttonVariants } from "~/components/ui/Button";
import { useRouteLoaderData } from "react-router";
import { FreePreviewBadge } from "~/components/course/identity-badge";
import { useLiveEditing } from "~/context/live-editing-context";
import type { loader } from "./_course";
import { InternalLink } from "~/components/course/internal-link";
import { MobileNav } from "~/components/course/mobile-nav";
import { Badge } from "~/components/ui/badge";

export const handle = { pageId: "home" };

export function meta() {
  return [
    { title: "課程總覽" },
    { name: "description", content: "查看所有課程內容" },
  ];
}

export default function Page() {
  const parentData = useRouteLoaderData<typeof loader>("routes/_course");
  const { course, isCustomer, welcomeFlash } = parentData || {};
  const { liveEditing } = useLiveEditing();
  const homeSettings = liveEditing["home"]
  const canAccessPrivate = isCustomer || course?.isFree;

  // Show welcome toast on successful login
  React.useEffect(() => {
    if (welcomeFlash === "true") {
      // Simple console log for now - can add toast library later if needed
      console.log("歡迎回來！");
    }
  }, [welcomeFlash]);

  if (!course) {
    return null;
  }

  const settings = course.liveSettings;

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
            <span className="text-gray-400">課程</span>
            <span className="text-gray-300">/</span>
            <span>總覽</span>
          </div>
        </div>
        {/* Mobile hamburger menu */}
        {!course.isFree && <MobileNav isCustomer={isCustomer ?? false} />}

        {/* Desktop navigation */}
        <div className="hidden items-center gap-5 px-3 font-medium text-gray-700 sm:flex">
          {!isCustomer && !course.isFree && (
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
          {isCustomer && !course.isFree && (
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

      <div className="xl:mx-auto xl:max-w-[1340px]">
        <div className="relative mx-2">
          <div className="absolute inset-x-0 top-0 -z-10 h-80 overflow-hidden rounded-xl border mask-b-from-60% sm:h-88 md:h-122 lg:h-128">
            <div className="h-full w-full bg-gradient-to-br from-blue-50 to-indigo-100 opacity-40" />
          </div>

          <div className="mx-auto max-w-[1180px] px-6 sm:px-8 xl:max-w-6xl 2xl:px-4">
            <div className="pt-48 pb-12 md:pb-16 lg:py-24">
              <div className="max-w-md">
                {course.isFree && (
                  <Badge className="mb-3">
                    <BadgeCheck />
                    免費課程
                  </Badge>
                )}
                <div className="flex gap-1.5 sm:gap-3">
                  <div className="flex flex-1 flex-shrink-0 items-center">
                    <h1 className="text-[1.375rem] font-semibold tracking-wider sm:text-2xl">
                      {homeSettings?.["title-text"] ||
                        settings?.["home"]?.title?.text ||
                        "課程總覽"}
                    </h1>
                  </div>
                </div>
                {(homeSettings?.summary || settings?.["home"]?.summary) && (
                  <p className="mt-8 leading-7 text-gray-700">
                    {homeSettings?.summary || settings?.["home"]?.summary}
                  </p>
                )}
                <div className="mt-8 flex flex-wrap items-center gap-3 gap-y-2">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="size-4 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-700">
                      {course.modules.length} 大單元
                    </span>
                  </div>
                  <div className="size-1 rounded-full bg-gray-400/50" />
                  <div className="flex items-center gap-1.5">
                    <BookMarked className="size-4 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-700">
                      {course.modules.reduce(
                        (acc, module) => acc + module.lessons.length,
                        0,
                      )}{" "}
                      堂課
                    </span>
                  </div>
                  <div className="size-1 rounded-full bg-gray-400/50" />
                  <div className="flex items-center gap-1.5">
                    <FileText className="size-4 text-gray-500/70" />
                    <span className="text-sm font-semibold text-gray-700">
                      13 篇課外學習資源
                    </span>
                  </div>
                </div>
                {!isCustomer && !course.isFree && (
                  <div className="mt-8">
                    <InternalLink
                      to="/purchase"
                      className={buttonVariants({ size: "lg" })}
                    >
                      購買課程
                    </InternalLink>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-10 lg:space-y-12">
              {course.modules.map((module) => (
                <div key={module.id}>
                  <div className="mb-6 lg:mb-8">
                    <div className="h-px bg-gray-200 opacity-10 mix-blend-difference" />
                  </div>

                  <div className="gap-16 max-md:space-y-9 md:flex lg:gap-24">
                    <div className="shrink-0 grow-0 md:sticky md:top-24 md:w-1/4 md:self-start">
                      <div className="relative inline-block">
                        <h2 className="text-xl font-semibold tracking-wider text-gray-500">
                          {module.title}
                        </h2>
                        <div className="absolute top-0 left-0 h-px w-full -translate-y-[calc(1.5rem+1px)] bg-gray-950 lg:-translate-y-[calc(2rem+1px)]" />
                      </div>
                    </div>
                    <div className="-mt-2 max-w-2xl flex-1">
                      {module.lessons.map((lesson, index) => (
                        <InternalLink
                          key={lesson.id}
                          to={`/learn/${module.slug}/${lesson.slug}`}
                        >
                          {index > 0 && (
                            <div className="my-1 h-px bg-gray-200/80" />
                          )}
                          <div className="cursor-pointer rounded-md py-3 hover:bg-gray-100 active:bg-gray-100 sm:p-4">
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-semibold">
                                {lesson.title}
                              </div>
                              {(module.isPublic || lesson.isPublic) &&
                                !canAccessPrivate && <FreePreviewBadge />}
                            </div>
                            {lesson.summary && (
                              <p className="mt-2 text-[0.8125rem] text-gray-600">
                                {lesson.summary}
                              </p>
                            )}
                          </div>
                        </InternalLink>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
