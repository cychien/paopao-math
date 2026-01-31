import type { Route } from "./+types/auth.callback.google";
import { redirect } from "react-router";
import {
  exchangeCodeForTokens,
  getGoogleUserInfo,
} from "~/services/auth/google-oauth.server";
import { prisma } from "~/services/database/prisma.server";
import {
  createCustomerSession,
  customerSessionStorage,
} from "~/services/customer-session.server";

const DEFAULT_APP_SLUG = "paopao-math";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  // Handle OAuth errors
  if (error) {
    console.error("Google OAuth error:", error);
    return redirect(`/auth/login?error=google_oauth_failed`);
  }

  if (!code) {
    return redirect("/auth/login?error=invalid_oauth_callback");
  }

  // Get the redirect URI (must match what was used in the authorization request)
  const redirectUri = `${url.origin}/auth/callback/google`;

  // Exchange code for tokens
  const tokens = await exchangeCodeForTokens(code, redirectUri);
  if (!tokens) {
    return redirect("/auth/login?error=google_token_exchange_failed");
  }

  // Get user info from Google
  const userInfo = await getGoogleUserInfo(tokens.access_token);
  if (!userInfo || !userInfo.email) {
    return redirect("/auth/login?error=google_userinfo_failed");
  }

  console.log(`🔐 Google login attempt for: ${userInfo.email}`);

  // Find the app
  const app = await prisma.app.findUnique({
    where: { slug: DEFAULT_APP_SLUG },
    select: { id: true },
  });

  if (!app) {
    return redirect("/auth/login?error=app_not_found");
  }

  // Check if the email exists in AppCustomer (i.e., they have purchased)
  const customer = await prisma.appCustomer.findFirst({
    where: {
      appId: app.id,
      email: userInfo.email,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!customer) {
    console.log(`❌ Google login failed: ${userInfo.email} has not purchased`);
    return redirect(
      "/auth/login?error=no_purchase&email=" + encodeURIComponent(userInfo.email)
    );
  }

  // Update customer name if not set
  if (!customer.name && userInfo.name) {
    await prisma.appCustomer.update({
      where: { id: customer.id },
      data: { name: userInfo.name },
    });
  }

  // Create customer session
  const cookie = await createCustomerSession({
    customerId: customer.id,
    appId: app.id,
    request,
  });

  // Set flash message for welcome toast
  const session = await customerSessionStorage.getSession(cookie);
  session.flash("welcome", "true");
  const newCookie = await customerSessionStorage.commitSession(session);

  console.log(`✅ Google login successful for: ${userInfo.email}`);

  // Redirect to course home with session cookie
  return redirect("/learn", {
    headers: {
      "Set-Cookie": newCookie,
    },
  });
}

export default function GoogleCallbackPage() {
  // This should not render as loader always redirects
  return (
    <div className="flex flex-1 items-center justify-center">
      <p>正在使用 Google 登入...</p>
    </div>
  );
}
