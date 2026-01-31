import type { Route } from "./+types/auth.verify";
import { prisma } from "~/services/database/prisma.server";
import { redirect } from "react-router";
import { verifyOTP } from "~/services/auth/otp.server";
import {
  createCustomerSession,
  customerSessionStorage,
} from "~/services/customer-session.server";

/**
 * Verify OTP code and create customer session
 */
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const challengeId = url.searchParams.get("c");
  const otp = url.searchParams.get("otp");

  if (!challengeId || !otp) {
    return redirect("/auth/login?error=invalid_verification");
  }

  // Get client IP for rate limiting
  const ipAddress =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // Verify OTP
  const result = await verifyOTP(challengeId, otp, ipAddress);

  if (!result.success || !result.customerId || !result.appId) {
    // Redirect back to login with error
    const errorParam = result.error
      ? encodeURIComponent(result.error)
      : "verification_failed";
    return redirect(`/auth/login?error=${errorParam}&c=${challengeId}`);
  }

  // Create customer session
  const cookie = await createCustomerSession({
    customerId: result.customerId,
    appId: result.appId,
    request,
  });

  // Set flash message for welcome toast
  const session = await customerSessionStorage.getSession(cookie);
  session.flash("welcome", "true");
  const newCookie = await customerSessionStorage.commitSession(session);

  console.log(`✅ Login successful for: ${result.email}`);

  // Redirect to course home with session cookie
  return redirect("/learn", {
    headers: {
      "Set-Cookie": newCookie,
    },
  });
}

export default function AuthVerifyPage() {
  // This should not render as loader always redirects
  return (
    <div className="flex flex-1 items-center justify-center">
      <p>驗證中...</p>
    </div>
  );
}
