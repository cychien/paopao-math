import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { Menu, X } from "lucide-react";
import logoSrc from "~/assets/logo-with-text.svg";
import { Button } from "~/components/ui/Button";

function Header() {
  const [isMenuPoppedOut, setIsMenuPoppedOut] = React.useState(false);
  const headerRef = React.useRef<HTMLDivElement>(null);

  return (
    <div ref={headerRef} className="relative isolate z-10">
      <header className="bg-white py-4.5">
        <NavigationMenu.Root className="container mx-auto flex items-center">
          <div className="flex items-center space-x-10">
            <a href="/">
              <span className="sr-only">寶哥高中數學</span>
              <img src={logoSrc} alt="Logo" className="h-[37px] w-auto" />
            </a>
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-5">
            <a href="/" className="font-medium text-text-tertiary">
              課程製作進度
            </a>
            <Button size="lg">搶先卡位</Button>
          </div>

          {/* Mobile menu */}
          <div className="flex flex-1 justify-end space-x-3 lg:hidden">
            <Dialog.Root
              open={isMenuPoppedOut}
              onOpenChange={(open) => {
                setIsMenuPoppedOut(open);
              }}
              modal={false}
            >
              <Dialog.Trigger asChild>
                <Button
                  className="translate-x-1"
                  variant="ghost"
                  iconButton
                  onClick={() => {
                    setIsMenuPoppedOut((prev) => !prev);
                  }}
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
                  <div className="absolute right-0 flex w-full flex-col bg-white pb-5 pt-2 shadow outline-none data-[state=closed]:duration-100 data-[state=open]:duration-200 data-[state=closed]:ease-in data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 data-[state=open]:ease-slider-in lg:hidden">
                    <NavigationMenu.Root
                      orientation="vertical"
                      className="container mx-auto divide-border-secondary"
                    >
                      <NavigationMenu.List className="space-y-2">
                        {/* Simple item */}
                        <NavigationMenu.Item>
                          <NavigationMenu.Link
                            href="#"
                            className="-mx-3 block h-full rounded-lg px-3 py-2 font-medium text-text-tertiary hover:bg-bg-primary-hover"
                          >
                            課程製作進度
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
