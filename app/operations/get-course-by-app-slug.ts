import { prisma } from "~/services/database/prisma.server";

type SettingField =
  | { type: "text" | "textarea"; key: string }
  | { type: "image"; key: string }
  | { type: "group"; key: string; group: SettingField[] };

type SettingSection = {
  id: string;
  fields: SettingField[];
};

type SettingSchema = SettingSection[];

function extractImageMediaIds(
  schema: SettingSchema,
  settings: Record<string, any>,
): string[] {
  const imageIds = new Set<string>();

  const walkFields = (fields: SettingField[], currentSettings: any): void => {
    if (!currentSettings || typeof currentSettings !== "object") return;

    for (const field of fields) {
      const fieldValue = currentSettings[field.key];

      if (field.type === "group") {
        walkFields(field.group, fieldValue);
      } else if (field.type === "image") {
        if (typeof fieldValue === "string" && fieldValue.trim()) {
          imageIds.add(fieldValue.trim());
        }
      }
    }
  };

  for (const section of schema) {
    const sectionSettings = settings[section.id];
    if (sectionSettings) {
      walkFields(section.fields, sectionSettings);
    }
  }

  return Array.from(imageIds);
}

export async function getCourseByAppSlug(
  slug: string,
  options?: {
    configId?: string;
    isAdmin?: boolean;
  },
) {
  const { configId, isAdmin } = options || {};

  const configSelect =
    configId && isAdmin
      ? {
          configs: {
            where: { id: configId },
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
        }
      : {};

  const app = await prisma.app.findUnique({
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
                  ...configSelect,
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

  if (!app || !app.courseProfile) return null;

  const { courseProfile } = app;
  const react = courseProfile.appFront?.react;
  const liveConfig = react?.liveConfig;
  const previewConfig = react?.configs?.[0];

  // Collect media IDs from both liveConfig and configs[0]
  const allMediaIds = new Set<string>();

  // Extract from liveConfig
  if (liveConfig?.settings && liveConfig.baseTemplateVersion?.settingsSchema) {
    const settingsSchema = liveConfig.baseTemplateVersion
      .settingsSchema as SettingSchema;
    const settings = liveConfig.settings as Record<string, any>;
    const mediaIds = extractImageMediaIds(settingsSchema, settings);
    mediaIds.forEach((id) => allMediaIds.add(id));
  }

  // Extract from configs[0] if exists (only available when configId is provided)
  if (configId && previewConfig?.settings) {
    const config = previewConfig as any;
    if (config.baseTemplateVersion?.settingsSchema) {
      const settingsSchema = config.baseTemplateVersion
        .settingsSchema as SettingSchema;
      const settings = config.settings as Record<string, any>;
      const mediaIds = extractImageMediaIds(settingsSchema, settings);
      mediaIds.forEach((id) => allMediaIds.add(id));
    }
  }

  // Fetch all media at once
  let mediaRecords: Record<string, any> = {};
  if (allMediaIds.size > 0) {
    const media = await prisma.media.findMany({
      where: {
        id: { in: Array.from(allMediaIds) },
      },
      select: {
        id: true,
        key: true,
        type: true,
        filename: true,
        mimeType: true,
        alt: true,
      },
    });

    mediaRecords = Object.fromEntries(media.map((m) => [m.id, m]));
  }

  const result = {
    id: app.id,
    slug: app.slug,
    isFree: app.isFree,
    liveSettings: liveConfig?.settings as Record<string, any>,
    previewSettings: previewConfig?.settings as Record<string, any>,
    media: mediaRecords,
    modules: courseProfile.modules.map((module) => ({
      id: module.id,
      order: module.order,
      slug: module.slug,
      title: module.title,
      summary: module.summary,
      isPublic: module.isPublic,
      lessons: module.lessons.map((lesson) => ({
        id: lesson.id,
        order: lesson.order,
        slug: lesson.slug,
        title: lesson.title,
        summary: lesson.summary,
        durationSec: lesson.durationSec,
        isPublic: lesson.isPublic,
      })),
    })),
  };

  return result;
}
