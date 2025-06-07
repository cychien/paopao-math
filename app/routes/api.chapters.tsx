import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireAdmin } from "~/services/auth/session";
import { prisma } from "~/services/database/client";
import { cacheManager } from "~/services/cache/redis";

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireAdmin(request);

  const formData = await request.formData();
  const method = request.method;
  const intent = formData.get("intent");

  try {
    if (method === "POST" && intent === "create") {
      const name = formData.get("name") as string;
      const slug = formData.get("slug") as string;
      const lessonId = formData.get("lessonId") as string;

      if (!name || !slug || !lessonId) {
        return json(
          { error: "章節名稱、slug 和課程 ID 為必填欄位" },
          { status: 400 }
        );
      }

      // 檢查 slug 在同一課程下是否已存在
      const existingChapter = await prisma.chapter.findFirst({
        where: {
          lessonId,
          slug,
        },
      });

      if (existingChapter) {
        return json(
          { error: "此課程下已存在相同的章節 slug" },
          { status: 400 }
        );
      }

      // 獲取該課程下最大的order值
      const maxOrderChapter = await prisma.chapter.findFirst({
        where: { lessonId },
        orderBy: { order: "desc" },
        select: { order: true },
      });

      const newOrder = (maxOrderChapter?.order ?? 0) + 1;

      const chapter = await prisma.chapter.create({
        data: {
          name,
          slug,
          lessonId,
          order: newOrder,
        },
        include: {
          lesson: {
            select: { slug: true },
          },
        },
      });

      // 清除相關緩存
      await cacheManager.clearChapterCache(chapter.lesson.slug, chapter.slug);
      await cacheManager.clearCourseStatsCache();

      return json({ success: true, chapter });
    }

    if (method === "PATCH" && intent === "update") {
      const id = formData.get("id") as string;
      const name = formData.get("name") as string;
      const slug = formData.get("slug") as string;

      if (!id || !name || !slug) {
        return json(
          { error: "ID、章節名稱和 slug 為必填欄位" },
          { status: 400 }
        );
      }

      // 獲取當前章節的 lessonId
      const currentChapter = await prisma.chapter.findUnique({
        where: { id },
        select: { lessonId: true, slug: true },
      });

      if (!currentChapter) {
        return json({ error: "章節不存在" }, { status: 404 });
      }

      // 檢查 slug 在同一課程下是否已被其他章節使用
      const existingChapter = await prisma.chapter.findFirst({
        where: {
          lessonId: currentChapter.lessonId,
          slug,
          id: { not: id },
        },
      });

      if (existingChapter) {
        return json(
          { error: "此課程下已存在相同的章節 slug" },
          { status: 400 }
        );
      }

      const chapter = await prisma.chapter.update({
        where: { id },
        data: {
          name,
          slug,
        },
        include: {
          lesson: {
            select: { slug: true },
          },
        },
      });

      // 清除相關緩存（包括舊的和新的 slug）
      await cacheManager.clearChapterCache(
        chapter.lesson.slug,
        currentChapter.slug
      );
      await cacheManager.clearChapterCache(chapter.lesson.slug, chapter.slug);

      return json({ success: true, chapter });
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
          prisma.chapter.update({
            where: { id },
            data: { order },
          })
        )
      );

      // 清除所有課程相關緩存（因為章節順序改變影響所有相關數據）
      await cacheManager.clearAllCourseCache();

      return json({ success: true });
    }

    if (method === "DELETE" && intent === "delete") {
      const id = formData.get("id") as string;

      if (!id) {
        return json({ error: "ID 為必填欄位" }, { status: 400 });
      }

      // 先獲取章節信息以便清除緩存
      const chapter = await prisma.chapter.findUnique({
        where: { id },
        select: {
          slug: true,
          lesson: {
            select: { slug: true },
          },
        },
      });

      await prisma.chapter.delete({
        where: { id },
      });

      // 清除相關緩存
      if (chapter) {
        await cacheManager.clearChapterCache(chapter.lesson.slug, chapter.slug);
      }
      await cacheManager.clearCourseStatsCache();

      return json({ success: true });
    }

    return json({ error: "不支援的操作" }, { status: 400 });
  } catch (error) {
    console.error("Chapter API error:", error);
    return json({ error: "操作失敗" }, { status: 500 });
  }
};
