import type { Route } from "./+types/auth.verify";
import { prisma } from "~/services/database/prisma.server";
import { redirect } from "react-router";
import { createHash as createHashCrypto } from "node:crypto";
import {
  createCustomerSession,
  customerSessionStorage,
} from "~/services/customer-session.server";

const DEFAULT_APP_SLUG = "paopao-math";

function createHash(input: string) {
  return createHashCrypto("sha256").update(input).digest("base64url");
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const challengeId = url.searchParams.get("c");
  const token = url.searchParams.get("t");

  if (!challengeId || !token) {
    return redirect("/login?error=invalid_link");
  }

  const tokenHash = createHash(token);

  // Find the challenge
  const challenge = await prisma.emailChallenge.findUnique({
    where: { id: challengeId },
    select: {
      id: true,
      email: true,
      tokenHash: true,
      status: true,
      expiresAt: true,
      appId: true,
    },
  });

  if (!challenge) {
    return redirect("/login?error=invalid_link");
  }

  // Verify token hash matches
  if (challenge.tokenHash !== tokenHash) {
    return redirect("/login?error=invalid_link");
  }

  // Check if challenge is expired
  if (challenge.expiresAt < new Date()) {
    await prisma.emailChallenge.update({
      where: { id: challengeId },
      data: { status: "EXPIRED" },
    });
    return redirect("/login?error=expired");
  }

  // Check if challenge is already consumed
  if (challenge.status !== "PENDING") {
    return redirect("/login?error=already_used");
  }

  // Verify this is a customer login challenge (has appId)
  if (!challenge.appId) {
    return redirect("/login?error=invalid_link");
  }

  // Verify the app matches
  const app = await prisma.app.findUnique({
    where: { slug: DEFAULT_APP_SLUG },
    select: { id: true },
  });

  if (!app || app.id !== challenge.appId) {
    return redirect("/login?error=invalid_link");
  }

  // Find the customer
  const customer = await prisma.appCustomer.findFirst({
    where: {
      appId: app.id,
      email: challenge.email,
    },
    select: {
      id: true,
    },
  });

  if (!customer) {
    return redirect("/login?error=no_access");
  }

  // Mark challenge as consumed
  await prisma.emailChallenge.update({
    where: { id: challengeId },
    data: { status: "CONSUMED" },
  });

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
