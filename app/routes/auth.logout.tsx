import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { destroyCustomerSession, getCustomerSession } from "~/services/customer-session.server";

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
    // 獲取當前 customer session
    const { customerId, appId } = await getCustomerSession(request);

    console.log("🚪 User logging out:", {
      customerId,
      appId,
      hasSession: !!customerId,
    });

    // 銷毀 customer session（會刪除數據庫記錄和 cookie）
    const cookieHeader = await destroyCustomerSession(request);

    // 重導向到首頁
    return redirect("/", {
      headers: {
        "Set-Cookie": cookieHeader,
      },
    });
  } catch (error) {
    console.error("登出失敗:", error);
    // 即使出錯也重導向到首頁
    return redirect("/");
  }
}
