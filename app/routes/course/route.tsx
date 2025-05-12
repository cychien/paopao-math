import { Outlet, useLocation } from "@remix-run/react";
import { CheckDone } from "~/components/icons/CheckDone";
import { File } from "~/components/icons/File";
import { HomeLine } from "~/components/icons/HomeLine";
import { SidebarItem } from "./SidebarItem";
import { PlayCircle } from "~/components/icons/PlayCircle";
import { cn } from "~/utils/style";

export default function Layout() {
  const location = useLocation();

  return (
    <>
      <div className="container mx-auto h-full hidden lg:block">
        <div className="-mx-5 pr-5 h-full">
          <div className="flex h-full">
            <aside className="w-[252px] px-5 py-9 border-l border-r border-gray-200 h-full">
              <div className="text-gray-500 text-sm font-medium">
                學測總複習班
              </div>
              <div className="mt-4 space-y-1">
                {navigations.map((nav) => (
                  <SidebarItem
                    key={nav.label}
                    icon={nav.icon}
                    label={nav.label}
                    link={nav.link}
                    isActive={location.pathname === nav.link}
                  />
                ))}
              </div>
            </aside>

            <div className="w-12 col-start-2 row-span-5 row-start-1 bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-gray-950)]/5" />

            <main className="flex-1 pl-12 py-9 border-l border-gray-200">
              <Outlet />
            </main>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <div className="border-b border-gray-200 overflow-x-auto">
          <div className="container mx-auto flex space-x-4 md:space-x-6">
            {navigations.map((nav) => (
              <a
                key={nav.label}
                href={nav.link}
                className="relative px-1 py-4 font-medium text-gray-500 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-gray-900 group shrink-0"
              >
                <span className="flex items-center space-x-1.5">
                  <nav.icon
                    className={cn(
                      "size-5 text-gray-400 group-hover:text-brand-500 transition-colors",
                      {
                        "text-brand-500": location.pathname === nav.link,
                      }
                    )}
                  />
                  <span
                    className={cn(
                      "-translate-px group-hover:text-gray-700 transition-colors",
                      {
                        "text-gray-700": location.pathname === nav.link,
                      }
                    )}
                  >
                    {nav.label}
                  </span>
                </span>

                {location.pathname === nav.link && (
                  <div className="absolute inset-x-0 bottom-0 h-[3px] bg-brand-500" />
                )}
              </a>
            ))}
          </div>
        </div>
        <div className="col-start-2 row-span-5 row-start-1 bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-gray-950)]/5 h-12" />
        <main className="border-t border-gray-200">
          <div className="container mx-auto py-4">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}

const navigations = [
  { icon: HomeLine, label: "總覽", link: "/course/overview" },
  { icon: PlayCircle, label: "課程", link: "/course/content" },
  { icon: File, label: "資源下載", link: "/course/resources" },
  { icon: CheckDone, label: "精選問答", link: "/course/qa" },
];
