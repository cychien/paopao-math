import type { Route } from "./+types/auth.middleware";
import { customerContext } from "./auth-context";
import { getCustomerData } from "~/services/customer-session.server";
import { redirect } from "react-router";

// Default app slug for single-tenant mode
const DEFAULT_APP_SLUG = "paopao-math";

export const authMiddleware: Route.MiddlewareFunction = async ({
  request,
  context,
}, next) => {
  // Load customer session data once
  const customerData = await getCustomerData({
    slug: DEFAULT_APP_SLUG,
    request,
  });

  // If no customer data (not logged in), redirect to login
  if (!customerData) {
    const url = new URL(request.url);
    const redirectTo = url.pathname + url.search;
    return redirect(`/auth/login?redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  // Set customer data to context for downstream loaders to access
  context.set(customerContext, customerData);

  return next();
};
