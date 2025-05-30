import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { HoneypotProvider } from "remix-utils/honeypot/react";

import "./tailwind.css";
import { Header } from "./components/layout/Header";
import { FlashProvider } from "./context/flash-context";
import { honeypot } from "./utils/honeypot.server";
import { cn } from "./utils/style";
import { getOptionalUser } from "./services/auth/session";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Noto+Sans+TC:wght@100..900&display=swap",
  },
  { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const honeyProps = await honeypot.getInputProps();

  // 檢查用戶是否已登入並有課程訪問權限
  const user = await getOptionalUser(request);

  return json({
    honeyProps,
    user: user
      ? {
          id: user.id,
          email: user.email,
          name: user.name,
          hasCourseAccess: user.purchases.some(
            (purchase) =>
              purchase.status === "ACTIVE" && purchase.hasLifetimeAccess
          ),
        }
      : null,
  });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>();
  const location = useLocation();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <HoneypotProvider {...data.honeyProps}>
          <FlashProvider>
            {/* All pages has minimal height 100% */}
            <div
              className={cn("flex flex-col h-full", {
                wide: location.pathname.startsWith("/course"),
              })}
            >
              <Header user={data.user} />
              <div className="flex-1">{children}</div>
            </div>
          </FlashProvider>
        </HoneypotProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
