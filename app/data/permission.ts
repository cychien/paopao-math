type Permission = {
  paths: string[];
  features: string[];
};

// 試用用戶權限 - 限制訪問
const trialPermissions: Permission = {
  paths: [
    "/learn/content",
    "/learn/content/real-number-log/*",
    "/learn/content/polynomial/*",
    "/learn/content/line-circle/*",
    "/preview",
    "/preview/*",
  ],
  features: [],
};

// 已購買用戶權限 - 完整訪問
const paidUserPermissions: Permission = {
  paths: ["*"],
  features: [],
};

/**
 * 檢查路徑是否符合權限模式
 */
function matchesPath(requestPath: string, permissionPath: string): boolean {
  // 處理完全萬用字元 *
  if (permissionPath === "*") {
    return true;
  }

  // 處理路徑萬用字元 /path/*
  if (permissionPath.endsWith("*")) {
    const basePath = permissionPath.slice(0, -1);
    return requestPath.startsWith(basePath);
  }

  // 精確匹配
  return requestPath === permissionPath;
}

/**
 * 檢查用戶是否有訪問特定路徑的權限
 */
function hasPathPermission(
  userPermissions: Permission,
  requestPath: string
): boolean {
  return userPermissions.paths.some((path) => matchesPath(requestPath, path));
}

/**
 * 檢查用戶是否有特定功能權限
 */
function hasFeaturePermission(
  userPermissions: Permission,
  feature: string
): boolean {
  return userPermissions.features.includes(feature);
}

/**
 * 根據用戶購買狀態獲取權限
 */
function getUserPermissions(hasPurchase: boolean): Permission {
  return hasPurchase ? paidUserPermissions : trialPermissions;
}

export {
  trialPermissions,
  paidUserPermissions,
  hasPathPermission,
  hasFeaturePermission,
  getUserPermissions,
};
export type { Permission };
