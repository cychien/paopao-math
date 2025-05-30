import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getSession, destroySession } from "~/services/auth/session";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // 處理 GET 請求的登出
  return await handleLogout(request);
};

export const action = async ({ request }: ActionFunctionArgs) => {
  // 處理 POST 請求的登出
  return await handleLogout(request);
};

async function handleLogout(request: Request) {
  try {
    // 獲取當前 session
    const session = await getSession(request.headers.get("Cookie"));

    console.log("🚪 User logging out:", {
      email: session.get("email"),
      hasSession: session.has("email"),
    });

    // 銷毀 session 並重導向到首頁
    return redirect("/", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  } catch (error) {
    console.error("登出失敗:", error);
    // 即使出錯也重導向到首頁
    return redirect("/");
  }
}
