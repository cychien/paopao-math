import { Permission } from "~/data/permission";

function canAccess({
  permissions,
  pathname,
}: {
  permissions: Permission;
  pathname: string;
}) {
  return permissions.paths.some((pattern) => {
    // 處理完全萬用字元 *
    if (pattern === "*") {
      return true;
    }

    // support "/foo/bar/*" wildcard
    if (pattern.endsWith("/*")) {
      const base = pattern.slice(0, -1); // "/foo/bar/"
      return pathname.startsWith(base);
    }
    // exact match
    return pathname === pattern;
  });
}

function canUse({
  permissions,
  feature,
}: {
  permissions: Permission;
  feature: string;
}) {
  return permissions.features.includes(feature);
}

export { canAccess, canUse };
