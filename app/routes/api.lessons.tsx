import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireAdmin } from "~/services/auth/session";
import { prisma } from "~/services/database/client";
import { cacheManager } from "~/services/cache/redis";

// 生成 slug 的輔助函數
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]/g, "-") // 支援中文
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireAdmin(request);

  const formData = await request.formData();
  const method = request.method;
  const intent = formData.get("intent");

  try {
    if (method === "POST" && intent === "create") {
      const name = formData.get("name") as string;
      const description = formData.get("description") as string;
      const customSlug = formData.get("slug") as string;

      if (!name) {
        return json({ error: "課程名稱為必填欄位" }, { status: 400 });
      }

      // 使用用戶提供的 slug，如果沒有則自動生成
      const slug = customSlug?.trim() || generateSlug(name);

      // 檢查 slug 是否已存在
      const existingLesson = await prisma.lesson.findUnique({
        where: { slug },
      });

      if (existingLesson) {
        return json(
          {
            error: customSlug
              ? "Slug 已存在，請使用不同的 slug"
              : "課程名稱重複，請使用不同的名稱",
          },
          { status: 400 }
        );
      }

      // 獲取最大的order值
      const maxOrderLesson = await prisma.lesson.findFirst({
        orderBy: { order: "desc" },
        select: { order: true },
      });

      const newOrder = (maxOrderLesson?.order ?? 0) + 1;

      const lesson = await prisma.lesson.create({
        data: {
          name,
          description,
          slug,
          order: newOrder,
        },
      });

      // 清除相關緩存
      await cacheManager.clearLessonCache(lesson.slug, lesson.id);
      await cacheManager.clearCourseStatsCache();

      return json({ success: true, lesson });
    }

    if (method === "PATCH" && intent === "update") {
      const id = formData.get("id") as string;
      const name = formData.get("name") as string;
      const description = formData.get("description") as string;
      const customSlug = formData.get("slug") as string;

      if (!id || !name) {
        return json({ error: "ID 和課程名稱為必填欄位" }, { status: 400 });
      }

      // 使用用戶提供的 slug，如果沒有則自動生成
      const slug = customSlug?.trim() || generateSlug(name);

      // 檢查 slug 是否已被其他課程使用
      const existingLesson = await prisma.lesson.findFirst({
        where: {
          slug,
          id: { not: id },
        },
      });

      if (existingLesson) {
        return json(
          {
            error: customSlug
              ? "Slug 已存在，請使用不同的 slug"
              : "課程名稱重複，請使用不同的名稱",
          },
          { status: 400 }
        );
      }

      const lesson = await prisma.lesson.update({
        where: { id },
        data: {
          name,
          description,
          slug,
        },
      });

      // 清除相關緩存
      await cacheManager.clearLessonCache(lesson.slug, lesson.id);
      await cacheManager.clearCourseStatsCache();

      return json({ success: true, lesson });
    }

    if (method === "PATCH" && intent === "reorder") {
      const updates = JSON.parse(formData.get("updates") as string) as Array<{
        id: string;
        order: number;
      }>;

      if (!Array.isArray(updates) || updates.length === 0) {
        return json({ error: "更新資料格式不正確" }, { status: 400 });
      }

      // 使用事務批量更新 order
      await prisma.$transaction(
        updates.map(({ id, order }) =>
          prisma.lesson.update({
            where: { id },
            data: { order },
          })
        )
      );

      // 清除相關緩存
      await cacheManager.clearAllCourseCache();

      return json({ success: true });
    }

    if (method === "DELETE" && intent === "delete") {
      const id = formData.get("id") as string;

      if (!id) {
        return json({ error: "ID 為必填欄位" }, { status: 400 });
      }

      // 先獲取課程信息以便清除緩存
      const lesson = await prisma.lesson.findUnique({
        where: { id },
        select: { slug: true },
      });

      await prisma.lesson.delete({
        where: { id },
      });

      // 清除相關緩存
      if (lesson) {
        await cacheManager.clearLessonCache(lesson.slug, id);
      }
      await cacheManager.clearCourseStatsCache();

      return json({ success: true });
    }

    return json({ error: "不支援的操作" }, { status: 400 });
  } catch (error) {
    console.error("Lesson API error:", error);
    return json({ error: "操作失敗" }, { status: 500 });
  }
};
