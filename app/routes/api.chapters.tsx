import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireAdmin } from "~/services/auth/session";
import { prisma } from "~/services/database/client";

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
      });

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
        select: { lessonId: true },
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
      });

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

      return json({ success: true });
    }

    if (method === "DELETE" && intent === "delete") {
      const id = formData.get("id") as string;

      if (!id) {
        return json({ error: "ID 為必填欄位" }, { status: 400 });
      }

      await prisma.chapter.delete({
        where: { id },
      });

      return json({ success: true });
    }

    return json({ error: "不支援的操作" }, { status: 400 });
  } catch (error) {
    console.error("Chapter API error:", error);
    return json({ error: "操作失敗" }, { status: 500 });
  }
};
