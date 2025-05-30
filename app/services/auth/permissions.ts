import {
  getUserPermissions,
  hasPathPermission,
  Permission,
} from "~/data/permission";
import { getOptionalUser } from "~/services/auth/session";

/**
 * 獲取用戶權限（基於 session）
 */
export async function getCurrentUserPermissions(
  request: Request
): Promise<Permission> {
  try {
    const user = await getOptionalUser(request);

    // 檢查用戶是否有有效購買記錄
    const hasPurchase = user
      ? user.purchases.some(
          (purchase) =>
            purchase.status === "ACTIVE" && purchase.hasLifetimeAccess
        )
      : false;

    return getUserPermissions(hasPurchase);
  } catch (error) {
    console.error("獲取用戶權限失敗:", error);
    // 出錯時回傳試用權限
    return getUserPermissions(false);
  }
}

/**
 * 檢查用戶是否可以訪問指定路徑
 */
export async function canUserAccessPath(
  request: Request,
  pathname: string
): Promise<boolean> {
  const permissions = await getCurrentUserPermissions(request);
  return hasPathPermission(permissions, pathname);
}

/**
 * 獲取用戶權限和訪問檢查結果（用於前端顯示）
 */
export async function getUserPermissionData(request: Request) {
  const user = await getOptionalUser(request);
  const permissions = await getCurrentUserPermissions(request);

  const hasPurchase = user
    ? user.purchases.some(
        (purchase) => purchase.status === "ACTIVE" && purchase.hasLifetimeAccess
      )
    : false;

  return {
    user,
    permissions,
    hasPurchase,
    isLoggedIn: !!user,
  };
}
