import {
  data,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from "react-router";
import type { Route } from "./+types/root.tsx";

import "./tailwind.css";
import { Header } from "./components/layout/Header";
import { FlashProvider } from "./context/flash-context";
import { cn } from "./utils/style";
import { getCustomerSession } from "./services/customer-session.server";
import { prisma } from "~/services/database/prisma.server";
import { FooterSection } from "./components/layout/FooterSection/FooterSection.js";

export const links: Route.LinksFunction = () => [
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

export async function loader({ request }: Route.LoaderArgs) {
  // 檢查用戶是否已登入
  const { customerId } = await getCustomerSession(request);

  let user = null;
  if (customerId) {
    const customer = await prisma.appCustomer.findUnique({
      where: { id: customerId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (customer) {
      user = {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        hasCourseAccess: true, // Customer always has access
      };
    }
  }

  return data({ user });
}

export async function action({ request }: Route.ActionArgs) {
  console.error(`Unexpected ${request.method} request to root route. URL: ${request.url}`);
  return data(
    {
      error: "Invalid request. Webhooks should be sent to /api/webhooks/lemon-squeezy"
    },
    { status: 400 }
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const loaderData = useLoaderData<typeof loader>();
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
        <FlashProvider>
          {/* All pages has minimal height 100% */}
          <div
            className={cn("flex flex-col h-full", {
              wide: location.pathname.startsWith("/course"),
            })}
          >
            <Header user={loaderData?.user ?? null} />
            <div className="flex-1">{children}</div>
            <FooterSection />
          </div>
        </FlashProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
