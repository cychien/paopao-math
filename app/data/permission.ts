type Permission = {
  paths: string[];
  features: string[];
};

const trialPermissions: Permission = {
  paths: ["/course/content", "/course/content/polynomial/*"],
  features: [],
};

export { trialPermissions };
export type { Permission };
