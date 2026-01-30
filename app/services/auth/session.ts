import { createCookieSessionStorage, redirect } from "react-router";
import { getUserWithPurchases } from "../database/users";

// 創建 cookie session storage
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_paopao_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [process.env.SESSION_SECRET || "fallback-secret"],
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 天
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;

/**
 * 從 request 取得當前用戶 session
 */
export async function getUserSession(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  const userEmail = session.get("userEmail");

  if (!userId || !userEmail) {
    return null;
  }

  return { userId, userEmail };
}

/**
 * 建立用戶 session
 */
export async function createUserSession(
  userId: string,
  userEmail: string,
  redirectTo: string = "/"
) {
  const session = await getSession();
  session.set("userId", userId);
  session.set("userEmail", userEmail);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

/**
 * 登出用戶
 */
export async function logout(request: Request, redirectTo: string = "/") {
  const session = await getSession(request.headers.get("Cookie"));

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

/**
 * 要求用戶登入
 */
export function requireLogin(redirectTo: string = "/auth/login") {
  return redirect(redirectTo);
}

/**
 * 檢查用戶是否有課程訪問權限
 */
export async function requireCourseAccess(request: Request) {
  const userSession = await getUserSession(request);

  if (!userSession) {
    throw requireLogin("/auth/login");
  }

  // 取得用戶購買記錄
  const userWithPurchases = await getUserWithPurchases(userSession.userEmail);

  if (!userWithPurchases) {
    throw requireLogin("/auth/login");
  }

  // 檢查是否有有效的購買記錄
  const hasValidPurchase = userWithPurchases.purchases.some(
    (purchase) => purchase.status === "ACTIVE" && purchase.hasLifetimeAccess
  );

  if (!hasValidPurchase) {
    throw redirect("/purchase?error=no_access");
  }

  return userWithPurchases;
}

/**
 * 可選的課程訪問檢查（不強制重導向）
 */
export async function checkCourseAccess(request: Request) {
  try {
    return await requireCourseAccess(request);
  } catch (error) {
    return null;
  }
}

/**
 * 獲取當前用戶（如果已登入）
 */
export async function getOptionalUser(request: Request) {
  const userSession = await getUserSession(request);

  if (!userSession) {
    return null;
  }

  return await getUserWithPurchases(userSession.userEmail);
}

