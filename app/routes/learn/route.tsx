import { Outlet, useLocation } from "react-router";
import { SidebarItem } from "./SidebarItem";
import { cn } from "~/utils/style";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from "~/components/ui/sidebar";
import logoSrc from "~/assets/logo.png";
import { Home01Icon, Logout03Icon, PanelLeftOpenIcon, PanelRightCloseIcon, SchoolIcon } from "@hugeicons/core-free-icons";
import Icon from "~/components/ui/icon";
import { Button } from "~/components/ui/Button";
import { Separator } from "~/components/ui/separator";
import { authMiddleware } from "~/middleware/auth.middleware";

export const middleware = [authMiddleware];

export const loader = async () => {
  // Customer data is now loaded by middleware and available in context
  return {};
};

export default function Layout() {
  const location = useLocation();

  // 基本導航項目
  const navigations = [
    { icon: SchoolIcon, label: "主課程", link: "/learn/content", exact: false },
    // { icon: File, label: "模擬試題", link: "/learn/exams" },
    // { icon: LayersTwo, label: "歷屆聯考題", link: "/learn/entrance-exams" },
    // { icon: CheckDone, label: "問答討論區", link: "/learn/curated" },
  ];

  const isActive = (link: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === link;
    }
    return location.pathname.startsWith(link);
  };

  return (
    <>
      {/* Desktop Layout with Sidebar */}
      <div className="hidden lg:block">
        <SidebarProvider defaultOpen={true}>
          <Sidebar collapsible="icon" className="border-r">
            <SidebarHeader>
              <SidebarHeaderContent />
            </SidebarHeader>

            <div>
              <Separator className='bg-gray-200' />
            </div>

            <SidebarContent>
              <SidebarGroup>
                <SidebarMenuItem>
                  <SidebarItem
                    icon={Home01Icon}
                    label='總覽'
                    link='/learn'
                    isActive={isActive('/learn', true)}
                  />
                </SidebarMenuItem>

                <SidebarGroupLabel className="text-xs uppercase tracking-wider text-gray-500 font-semibold mt-3">
                  基礎知識
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navigations.map((nav) => (
                      <SidebarMenuItem key={nav.label}>
                        <SidebarItem
                          icon={nav.icon}
                          label={nav.label}
                          link={nav.link}
                          isActive={isActive(nav.link, nav.exact)}
                        />
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarItem
                    icon={Logout03Icon}
                    label='登出'
                    link='/auth/logout'
                    isActive={false}
                  />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>

          <SidebarInset className="bg-white">
            {/* <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-white px-4">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-6" />
              <div className="flex-1" />
            </header> */}
            <main className="flex-1">
              <Outlet />
            </main>
          </SidebarInset>
        </SidebarProvider>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="border-b border-gray-200 overflow-x-auto sticky top-0 bg-white z-10 shadow-sm">
          <div className="container mx-auto flex space-x-3 sm:space-x-4 md:space-x-4">
            {navigations.map((nav) => (
              <a
                key={nav.label}
                href={nav.link}
                className="relative px-1 py-4 font-medium text-gray-500 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-gray-900 group shrink-0 text-sm"
              >
                <span className="flex items-center space-x-1.5">
                  <Icon icon={nav.icon}
                    className={cn('size-5', isActive(nav.link, nav.exact)
                      ? "text-brand-600 scale-110"
                      : "text-gray-500 group-hover/item:text-brand-500 group-hover/item:scale-105")} />
                  <span
                    className={cn(
                      "group-hover:text-gray-700 transition-colors",
                      {
                        "text-gray-700": isActive(nav.link, nav.exact),
                      }
                    )}
                  >
                    {nav.label}
                  </span>
                </span>

                {isActive(nav.link, nav.exact) && (
                  <div className="absolute inset-x-0 bottom-0 h-[3px] bg-brand-500 rounded-t-full" />
                )}
              </a>
            ))}
          </div>
        </div>
        <div className="bg-gradient-to-b from-gray-50 to-transparent h-8" />
        <main className="isolate">
          <div className="container mx-auto py-6 px-4">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}

function SidebarHeaderContent() {
  const { open, toggleSidebar } = useSidebar();

  if (open) {
    return (
      <div className="flex flex-row justify-between items-center">
        <div className="flex items-center gap-2.5 px-2 py-1" >
          <img src={logoSrc} alt="logo" className="h-7 shrink-0" />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold text-gray-900">
              學測總複習班
            </span>
            <span className="truncate text-xs text-gray-500">
              數學課程
            </span>
          </div>
        </div>
        <Button
          data-sidebar="trigger"
          data-slot="sidebar-trigger"
          variant="ghost"
          size="icon"
          className={cn("size-7")}
          onClick={() => {
            toggleSidebar();
          }}
        >
          <Icon icon={PanelLeftOpenIcon} />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>
    )
  }

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className='size-8'
      onClick={() => {
        toggleSidebar();
      }}
    >
      <Icon icon={PanelRightCloseIcon} className='size-4.5' />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}