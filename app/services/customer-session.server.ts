import { prisma } from "~/services/database/prisma.server";
import { createCookieSessionStorage } from "react-router";
import { randomBytes, createHash as createHashCrypto } from "node:crypto";
import { getAppBySlug, getCustomerById } from "./cache/cached-queries.server";

export const customerSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__customer_session",
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    secrets: [process.env.SESSION_SECRET || "default-secret-change-me"],
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
});

export const { getSession, commitSession, destroySession } =
  customerSessionStorage;

function createHash(input: string) {
  return createHashCrypto("sha256").update(input).digest("base64url");
}

export interface CustomerSessionData {
  customerId: string | null;
  appId: string | null;
}

const SESSION_TTL_DAYS = 30;

function nowPlusDays(days: number) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

export async function createCustomerSession({
  customerId,
  appId,
  request,
}: {
  customerId: string;
  appId: string;
  request: Request;
}): Promise<string> {
  // Generate a random token for the database session
  const token = randomBytes(32).toString("base64url");
  const tokenHash = createHash(token);

  // Create session in database
  await prisma.customerSession.create({
    data: {
      customerId,
      appId,
      tokenHash,
      expiresAt: nowPlusDays(SESSION_TTL_DAYS),
      userAgent: request.headers.get("user-agent") ?? undefined,
    },
  });

  // Store token hash in cookie session
  const session = await getSession(request.headers.get("cookie"));
  session.set("tokenHash", tokenHash);

  return await commitSession(session);
}

export async function getCustomerSession(
  request: Request,
): Promise<CustomerSessionData> {
  const session = await getSession(request.headers.get("cookie"));
  const tokenHash = session.get("tokenHash");

  if (!tokenHash) {
    return { customerId: null, appId: null };
  }

  // Find session in database
  const dbSession = await prisma.customerSession.findUnique({
    where: { tokenHash },
    select: {
      id: true,
      customerId: true,
      appId: true,
      expiresAt: true,
    },
  });

  if (!dbSession || dbSession.expiresAt < new Date()) {
    // Session expired or not found
    return { customerId: null, appId: null };
  }

  // Update last used at
  await prisma.customerSession.update({
    where: { id: dbSession.id },
    data: { lastUsedAt: new Date() },
  });

  return {
    customerId: dbSession.customerId,
    appId: dbSession.appId,
  };
}

export async function destroyCustomerSession(
  request: Request,
): Promise<string> {
  const session = await getSession(request.headers.get("cookie"));
  const tokenHash = session.get("tokenHash");

  if (tokenHash) {
    // Delete session from database
    await prisma.customerSession.deleteMany({
      where: { tokenHash },
    });
  }

  return await destroySession(session);
}

export async function checkIsCustomer({
  slug,
  request,
}: {
  slug: string;
  request: Request;
}): Promise<boolean> {
  const { customerId, appId } = await getCustomerSession(request);

  if (!customerId || !appId) {
    return false;
  }

  // Use cached queries for per-request deduplication
  const [app, customer] = await Promise.all([
    getAppBySlug(slug),
    getCustomerById(customerId, appId),
  ]);

  if (!app || app.id !== appId || !customer) {
    return false;
  }

  return true;
}

export async function getCustomerData({
  slug,
  request,
}: {
  slug: string;
  request: Request;
}): Promise<{
  customerId: string;
  appId: string;
  email: string;
  name: string | null;
  isFree: boolean;
} | null> {
  const { customerId, appId } = await getCustomerSession(request);

  if (!customerId || !appId) {
    return null;
  }

  // Use cached queries for per-request deduplication
  const [app, customer] = await Promise.all([
    getAppBySlug(slug),
    getCustomerById(customerId, appId),
  ]);

  if (!app || app.id !== appId || !customer) {
    return null;
  }

  return {
    customerId: customer.id,
    appId: app.id,
    email: customer.email,
    name: customer.name,
    isFree: app.isFree,
  };
}
