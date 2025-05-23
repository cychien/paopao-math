import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { Menu, SquarePlay, X } from "lucide-react";
import logoSrc from "~/assets/logo-with-text.png";
import { Button, buttonVariant } from "~/components/ui/Button";
import { redirect, useLocation } from "@remix-run/react";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/utils/style";
import { PlayCircleSolid } from "~/components/icons/PlayCircleSolid";

function Header() {
  const [isMenuPoppedOut, setIsMenuPoppedOut] = React.useState(false);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const location = useLocation();

  return (
    <div ref={headerRef} className="relative isolate z-20">
      <header
        className={cn("bg-white py-4.5", {
          "border-b border-gray-200": location.pathname !== "/",
        })}
      >
        <NavigationMenu.Root className="container mx-auto flex items-center">
          <div className="flex items-center space-x-10">
            <a href="/">
              <span className="sr-only">寶哥高中數學</span>
              <img src={logoSrc} alt="Logo" className="h-[37px] w-auto" />
            </a>
            <NavigationMenu.List className="hidden lg:flex lg:space-x-8 -translate-y-px">
              <NavigationMenu.Item className="flex items-center space-x-1.5">
                <NavigationMenu.Link
                  href="/course/content"
                  className={cn(
                    "font-medium text-gray-700 hover:text-gray-900 group flex items-center space-x-1.5 transition-colors",
                    {
                      "text-gray-900": location.pathname.startsWith("/course"),
                    }
                  )}
                >
                  <PlayCircleSolid
                    className={cn(
                      "text-gray-400 group-hover:text-[#c1272d] transition-colors",
                      {
                        "text-[#c1272d]":
                          location.pathname.startsWith("/course"),
                      }
                    )}
                  />
                  <span className="-translate-y-px">免費試讀</span>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            </NavigationMenu.List>
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-5 lg:-translate-y-[2px]">
            <a
              href="/login"
              className={cn(
                buttonVariant({ variant: "link" }),
                "text-gray-400 font-medium p-0 hover:text-gray-600"
              )}
            >
              登入
            </a>
          </div>

          {/* <a href="/" className="font-medium text-text-tertiary">
          課程製作進度
        </a> */}

          {/* Mobile menu */}
          <div className="flex flex-1 justify-end space-x-3 lg:hidden -translate-y-[0.5px]">
            <NavigationMenu.Link
              href="/course/content"
              className={cn(
                "font-medium text-gray-700 hover:text-gray-900 group flex items-center space-x-1.5 transition-colors",
                {
                  "text-gray-900": location.pathname.startsWith("/course"),
                }
              )}
            >
              <PlayCircleSolid
                className={cn(
                  "text-gray-400 group-hover:text-[#c1272d] transition-colors",
                  {
                    "text-[#c1272d]": location.pathname.startsWith("/course"),
                  }
                )}
              />
              <span className="-translate-y-px">免費試讀</span>
            </NavigationMenu.Link>

            <Dialog.Root
              open={isMenuPoppedOut}
              onOpenChange={(open) => {
                setIsMenuPoppedOut(open);
              }}
              modal={false}
            >
              <Dialog.Trigger asChild>
                <Button
                  variant="ghost"
                  iconButton
                  onClick={() => {
                    setIsMenuPoppedOut((prev) => !prev);
                  }}
                  className="h-9"
                >
                  {!isMenuPoppedOut ? (
                    <>
                      <span className="sr-only">打開主選單</span>
                      <Menu />
                    </>
                  ) : (
                    <>
                      <span className="sr-only">關閉主選單</span>
                      <X />
                    </>
                  )}
                </Button>
              </Dialog.Trigger>
              <Dialog.Portal container={headerRef.current}>
                <Dialog.Overlay />
                <Dialog.Title className="sr-only">選單</Dialog.Title>
                <Dialog.Content asChild>
                  <div className="absolute right-0 flex w-full flex-col bg-white pb-2 pt-2 shadow outline-none data-[state=closed]:duration-100 data-[state=open]:duration-200 data-[state=closed]:ease-in data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 data-[state=open]:ease-slider-in lg:hidden">
                    <NavigationMenu.Root
                      orientation="vertical"
                      className="container mx-auto divide-border-secondary"
                    >
                      <NavigationMenu.List className="space-y-2">
                        <NavigationMenu.Item>
                          <NavigationMenu.Link
                            href="/login"
                            className={cn(
                              buttonVariant({ variant: "link" }),
                              "-mx-3 block h-full rounded-lg px-3 py-2 font-medium text-text-tertiary hover:bg-bg-primary-hover"
                            )}
                          >
                            登入
                          </NavigationMenu.Link>
                        </NavigationMenu.Item>
                      </NavigationMenu.List>
                    </NavigationMenu.Root>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </NavigationMenu.Root>
      </header>
    </div>
  );
}

export { Header };
