import * as React from "react";
import {
  Outlet,
  redirect,
  data,
} from "react-router";
import type { Route } from "./+types/_course";
import { SidebarProvider } from "~/components/ui/sidebar";
import { Sidebar } from "~/components/course/sidebar";
import { getCourseByAppSlug } from "~/operations/get-course-by-app-slug";
import {
  checkIsCustomer,
  customerSessionStorage,
} from "~/services/customer-session.server";

// Default app slug for single-tenant mode
const DEFAULT_APP_SLUG = "paopao-math";

export async function loader({ request }: Route.LoaderArgs) {
  const isCustomer = await checkIsCustomer({
    slug: DEFAULT_APP_SLUG,
    request,
  });

  const course = await getCourseByAppSlug(DEFAULT_APP_SLUG, {
    configId: undefined,
    isAdmin: false,
  });

  if (!course) {
    throw new Error("Course not found");
  }

  // If course is not free and user is not a customer, redirect to login
  if (!course.isFree && !isCustomer) {
    throw redirect("/login");
  }

  // Get flash messages
  const session = await customerSessionStorage.getSession(
    request.headers.get("cookie"),
  );
  const welcomeFlash = session.get("welcome") || null;

  // Return data with headers to commit the session (flash messages are cleared)
  return data(
    {
      course,
      isCustomer,
      welcomeFlash,
    },
    {
      headers: {
        "Set-Cookie": await customerSessionStorage.commitSession(session),
      },
    },
  );
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { course, isCustomer } = loaderData;
  const canAccessPrivate = isCustomer || course.isFree;

  return (
    <SidebarProvider
      style={{ "--sidebar-width": "18rem" } as React.CSSProperties}
      className="isolate"
    >
      <Sidebar
        modules={course.modules}
        canAccessPrivate={canAccessPrivate}
      />
      <Outlet />
    </SidebarProvider>
  );
}
