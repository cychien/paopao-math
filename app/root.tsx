import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { HoneypotProvider } from "remix-utils/honeypot/react";

import "./tailwind.css";
import { Header } from "./components/layout/Header";
import { FlashProvider } from "./context/flash-context";
import { honeypot } from "./utils/honeypot.server";

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

export async function loader() {
  const honeyProps = await honeypot.getInputProps();
  return json({ honeyProps });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>();

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
            <div className="flex flex-col h-full">
              <Header />
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
