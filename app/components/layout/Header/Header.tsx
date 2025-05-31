import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { Menu, X } from "lucide-react";
import logoSrc from "~/assets/logo-with-text.png";
import { Button, buttonVariants } from "~/components/ui/Button";
import { useLocation, Form, Link } from "@remix-run/react";
import { cn } from "~/utils/style";
import { PlayCircleSolid } from "~/components/icons/PlayCircleSolid";

interface HeaderProps {
  user?: {
    id: string;
    email: string;
    name: string | null;
    hasCourseAccess: boolean;
  } | null;
}

function Header({ user }: HeaderProps) {
  const [isMenuPoppedOut, setIsMenuPoppedOut] = React.useState(false);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const location = useLocation();

  return (
    <div
      ref={headerRef}
      className={cn("relative isolate z-20", { "bg-white": isMenuPoppedOut })}
    >
      <header
        className={cn("py-4.5", {
          "border-b border-gray-200": location.pathname !== "/",
        })}
      >
        <NavigationMenu.Root className="container mx-auto flex items-center">
          <div className="flex items-center space-x-10">
            <Link to="/" className="translate-y-px">
              <span className="sr-only">寶哥高中數學</span>
              <img src={logoSrc} alt="Logo" className="h-[34px] w-auto" />
            </Link>
            {!user && (
              <NavigationMenu.List className="hidden lg:flex lg:space-x-8">
                <NavigationMenu.Item className="flex items-center space-x-1.5">
                  <NavigationMenu.Link asChild>
                    <Link
                      to="/course/content"
                      className={cn(
                        "font-medium text-gray-900 group flex items-center gap-1.5 transition-colors text-sm"
                      )}
                    >
                      <PlayCircleSolid
                        className={cn(
                          "text-gray-400 group-hover:text-[#c1272d] transition-colors translate-y-px",
                          {
                            "text-[#c1272d]":
                              location.pathname.startsWith("/course"),
                          }
                        )}
                      />
                      <span>免費試讀</span>
                    </Link>
                  </NavigationMenu.Link>
                </NavigationMenu.Item>
              </NavigationMenu.List>
            )}
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  嗨，{user.name || user.email}
                </span>
                <Form method="post" action="/auth/logout">
                  <Button
                    type="submit"
                    variant="ghost"
                    size="lg"
                    className="hover:bg-gray-900/5"
                  >
                    登出
                  </Button>
                </Form>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/auth/login"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "lg" }),
                    "hover:bg-gray-900/5"
                  )}
                  prefetch="viewport"
                >
                  登入
                </Link>
                <Link
                  to="/purchase"
                  className={cn(buttonVariants({ size: "lg" }))}
                  prefetch="viewport"
                >
                  立即購買
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu */}
          <div className={"flex flex-1 justify-end space-x-3 lg:hidden"}>
            {!user && (
              <NavigationMenu.Link asChild>
                <Link
                  to="/course/content"
                  className={cn(
                    "font-medium text-gray-900 hover:text-gray-900 group flex items-center gap-1.5 transition-colors text-sm"
                  )}
                >
                  <PlayCircleSolid
                    className={cn(
                      "text-gray-400 group-hover:text-[#c1272d] transition-colors translate-y-px",
                      {
                        "text-[#c1272d]":
                          location.pathname.startsWith("/course"),
                      }
                    )}
                  />
                  <span>免費試讀</span>
                </Link>
              </NavigationMenu.Link>
            )}

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
                  size="sm"
                  className={cn(
                    "h-8 w-8 p-0 text-gray-400 hover:text-gray-600 lg:hidden",
                    {
                      "text-gray-600": isMenuPoppedOut,
                    }
                  )}
                >
                  {isMenuPoppedOut ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Menu className="h-4 w-4" />
                  )}
                </Button>
              </Dialog.Trigger>
              <Dialog.Portal container={headerRef.current}>
                <Dialog.Overlay />
                <Dialog.Title className="sr-only">選單</Dialog.Title>
                <Dialog.Content asChild>
                  <div className="absolute right-0 flex w-full flex-col pb-2 pt-2 shadow outline-none data-[state=closed]:duration-100 data-[state=open]:duration-200 data-[state=closed]:ease-in data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 data-[state=open]:ease-slider-in lg:hidden data-[state=open]:bg-white">
                    <NavigationMenu.Root
                      orientation="vertical"
                      className="container mx-auto divide-border-secondary"
                    >
                      <NavigationMenu.List className="space-y-2">
                        {/* {user?.hasCourseAccess && (
                          <NavigationMenu.Item>
                            <NavigationMenu.Link
                              href="/course"
                              className={cn(
                                buttonVariants({ variant: "link" }),
                                "-mx-3 block h-full rounded-lg px-3 py-2 font-medium text-text-tertiary hover:bg-bg-primary-hover"
                              )}
                            >
                              我的課程
                            </NavigationMenu.Link>
                          </NavigationMenu.Item>
                        )} */}

                        <NavigationMenu.Item>
                          {user ? (
                            <Form method="post" action="/auth/logout">
                              <button
                                type="submit"
                                className={cn(
                                  buttonVariants({ variant: "link" }),
                                  "-mx-3 block h-full rounded-lg px-3 py-2 font-medium text-text-tertiary hover:bg-bg-primary-hover w-full text-left"
                                )}
                              >
                                登出
                              </button>
                            </Form>
                          ) : (
                            <NavigationMenu.Link
                              href="/auth/login"
                              className={cn(
                                buttonVariants({ variant: "link" }),
                                "-mx-3 block h-full rounded-lg px-3 py-2 font-medium text-text-tertiary hover:bg-bg-primary-hover"
                              )}
                            >
                              登入
                            </NavigationMenu.Link>
                          )}
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
