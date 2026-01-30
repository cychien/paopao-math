import { Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { buttonVariants } from "~/components/ui/Button";
import { InternalLink } from "~/components/course/internal-link";
import { useLocation } from "react-router";
import { createPortal } from "react-dom";

interface MobileNavProps {
  isCustomer: boolean;
}

export function MobileNav({ isCustomer }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  // const [headerHeight, setHeaderHeight] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const isInCourse =
    location.pathname.startsWith("/course") || location.pathname === "/";

  // Track mount state to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Measure header height when menu opens
  // useEffect(() => {
  //   if (open && buttonRef.current) {
  //     const header = buttonRef.current.closest(".sticky") as HTMLElement | null;
  //     if (header) {
  //       setHeaderHeight(header.offsetHeight);
  //     }
  //   }
  // }, [open]);

  const headerHeight = 56;

  return (
    <>
      {/* Toggle button */}
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        className="relative z-50 flex cursor-pointer items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 sm:hidden"
        aria-label={open ? "關閉選單" : "開啟選單"}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {/* Portal for overlay and dropdown */}
      {mounted &&
        createPortal(
          <>
            {/* Overlay - doesn't cover header */}
            <div
              className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 sm:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              style={{ top: headerHeight }}
              onClick={() => setOpen(false)}
            />

            {/* Dropdown menu - appears below header */}
            <div
              className={`fixed inset-x-0 z-40 transform border-b bg-white shadow-lg transition-all duration-300 ease-in-out sm:hidden ${open
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none -translate-y-2 opacity-0"
                }`}
              style={{ top: headerHeight }}
            >
              <nav className="flex flex-col gap-2 p-4">
                {!isInCourse && (
                  <InternalLink
                    to="/"
                    className="rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 active:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    課程
                  </InternalLink>
                )}
                {!isCustomer && (
                  <>
                    <InternalLink
                      to="/login"
                      className="rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 active:bg-gray-100"
                      onClick={() => setOpen(false)}
                    >
                      登入
                    </InternalLink>
                    <InternalLink
                      to="/purchase"
                      className={buttonVariants({
                        size: "lg",
                        className: "mt-2 w-full",
                      })}
                      onClick={() => setOpen(false)}
                    >
                      購買
                    </InternalLink>
                  </>
                )}
                {isCustomer && (
                  <InternalLink
                    to="/logout"
                    className="rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 active:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    登出
                  </InternalLink>
                )}
              </nav>
            </div>
          </>,
          document.body,
        )}
    </>
  );
}
