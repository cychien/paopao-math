import { webcrypto } from "node:crypto";
import prisma from "~/services/database/prisma.server";
import { createCookieSessionStorage } from "react-router";
import { SignJWT, jwtVerify } from "jose";

// Polyfill for jose library in Node.js environment
if (typeof globalThis.crypto === "undefined") {
  globalThis.crypto = webcrypto as Crypto;
}

export const previewSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__preview",
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    secrets: [process.env.SESSION_SECRET || "default-secret-change-me"],
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 6, // 6 hours
  },
});

export const { getSession, commitSession, destroySession } =
  previewSessionStorage;

export interface PreviewSessionData {
  workspaceId: string | null;
  userId: string | null;
}

// Generate a session token for URL-based authentication (works in iframes)
export async function generateSessionToken(
  data: Partial<PreviewSessionData>,
): Promise<string> {
  const HS_SECRET = Buffer.from(process.env.PREVIEW_SECRET!, "base64");

  const token = await new SignJWT(data as any)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer("minutesite")
    .setExpirationTime("6h")
    .sign(HS_SECRET);

  return token;
}

// Verify and decode session token from URL
export async function verifySessionToken(
  token: string,
): Promise<PreviewSessionData> {
  try {
    const HS_SECRET = Buffer.from(process.env.PREVIEW_SECRET!, "base64");
    const { payload } = await jwtVerify(token, HS_SECRET, {
      issuer: "minutesite",
    });

    return {
      workspaceId: (payload.workspaceId as string) || null,
      userId: (payload.userId as string) || null,
    };
  } catch {
    return { workspaceId: null, userId: null };
  }
}

export async function getPreviewSession(
  request: Request,
): Promise<PreviewSessionData> {
  // Try to get session from URL parameter first (for iframe compatibility)
  const url = new URL(request.url);
  const sessionToken = url.searchParams.get("s");

  if (sessionToken) {
    const data = await verifySessionToken(sessionToken);
    if (data.workspaceId) {
      return data;
    }
  }

  // Fallback to cookie-based session
  const session = await getSession(request.headers.get("cookie"));

  const workspaceId = session.get("workspaceId") || null;
  const userId = session.get("userId") || null;

  return { workspaceId, userId };
}

export async function setPreviewSession(
  request: Request,
  data: Partial<PreviewSessionData>,
): Promise<string> {
  const session = await getSession(request.headers.get("cookie"));

  if (data.workspaceId !== undefined) {
    session.set("workspaceId", data.workspaceId);
  }

  if (data.userId !== undefined) {
    session.set("userId", data.userId);
  }

  return await commitSession(session);
}

export async function checkIsAdmin({
  slug,
  request,
}: {
  slug: string;
  request: Request;
}) {
  const { workspaceId } = await getPreviewSession(request);
  // TODO: query in efficient way
  const isAppBelongsToWorkspace = !!(
    workspaceId &&
    (await prisma.app.findFirst({
      where: {
        slug,
        workspaceId: workspaceId!,
      },
    }))
  );

  const queryMode = new URL(request.url).searchParams.get("mode");
  const configId = new URL(request.url).searchParams.get("configId");

  const isAdmin = !!queryMode && !!configId && isAppBelongsToWorkspace;

  return isAdmin;
}
