type Permission = {
  paths: string[];
  features: string[];
};

const trialPermissions: Permission = {
  paths: [
    "/course/content",
    "/course/content/polynomial/*",
    "/course/entrance-exams",
    "/course/entrance-exams/*",
  ],
  features: [],
};

export { trialPermissions };
export type { Permission };
