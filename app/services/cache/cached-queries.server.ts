import { cache } from "react";
import { prisma } from "~/services/database/prisma.server";

/**
 * Per-request cached query for app lookup by slug.
 * Uses React.cache() to deduplicate within a single request.
 * Multiple calls to getAppBySlug with the same slug will only execute once per request.
 */
export const getAppBySlug = cache(async (slug: string) => {
  return prisma.app.findUnique({
    where: { slug },
    select: {
      id: true,
      isFree: true,
      slug: true,
    },
  });
});

/**
 * Per-request cached query for app with full course data.
 * Used for pages that need the entire course structure.
 */
export const getAppWithCourse = cache(async (slug: string) => {
  return prisma.app.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      isFree: true,
      courseProfile: {
        select: {
          appFront: {
            select: {
              react: {
                select: {
                  liveConfig: {
                    select: {
                      id: true,
                      updatedAt: true,
                      name: true,
                      settings: true,
                      baseTemplateVersion: {
                        select: {
                          settingsSchema: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          modules: {
            where: {
              isDraft: false,
            },
            orderBy: { order: "asc" },
            select: {
              id: true,
              order: true,
              slug: true,
              title: true,
              summary: true,
              isPublic: true,
              lessons: {
                where: {
                  isDraft: false,
                },
                orderBy: { order: "asc" },
                select: {
                  id: true,
                  order: true,
                  slug: true,
                  title: true,
                  summary: true,
                  durationSec: true,
                  isPublic: true,
                },
              },
            },
          },
        },
      },
    },
  });
});

/**
 * Per-request cached query for customer lookup.
 * Only accepts primitive arguments (string) to ensure cache hits work correctly.
 */
export const getCustomerById = cache(async (customerId: string, appId: string) => {
  return prisma.appCustomer.findFirst({
    where: {
      id: customerId,
      appId: appId,
    },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });
});
