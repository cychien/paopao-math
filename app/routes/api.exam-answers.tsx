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
      const title = formData.get("title") as string;
      const fileType = formData.get("fileType") as string;
      const videoId = formData.get("videoId") as string;
      const duration = formData.get("duration")
        ? parseInt(formData.get("duration") as string)
        : null;
      const fileUrl = formData.get("fileUrl") as string;
      const questionId = formData.get("questionId") as string;

      if (!title || !fileType || !questionId) {
        return json(
          { error: "標題、檔案類型和題目ID為必填欄位" },
          { status: 400 }
        );
      }

      // 獲取同一題目下的最大order值
      const maxOrderAnswer = await prisma.examAnswer.findFirst({
        where: { questionId },
        orderBy: { order: "desc" },
        select: { order: true },
      });

      const newOrder = (maxOrderAnswer?.order ?? 0) + 1;

      const answer = await prisma.examAnswer.create({
        data: {
          title,
          fileType,
          videoId: videoId || null,
          duration,
          fileUrl: fileUrl || null,
          questionId,
          order: newOrder,
        },
      });

      // 清除相關緩存
      await cacheManager.clearAllEntranceExamCache();

      return json({ success: true, answer });
    }

    if (method === "PATCH" && intent === "update") {
      const id = formData.get("id") as string;
      const title = formData.get("title") as string;
      const fileType = formData.get("fileType") as string;
      const videoId = formData.get("videoId") as string;
      const duration = formData.get("duration")
        ? parseInt(formData.get("duration") as string)
        : null;
      const fileUrl = formData.get("fileUrl") as string;

      if (!id || !title || !fileType) {
        return json({ error: "ID、標題和檔案類型為必填欄位" }, { status: 400 });
      }

      const answer = await prisma.examAnswer.update({
        where: { id },
        data: {
          title,
          fileType,
          videoId: videoId || null,
          duration,
          fileUrl: fileUrl || null,
        },
      });

      // 清除相關緩存
      await cacheManager.clearAllEntranceExamCache();

      return json({ success: true, answer });
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
          prisma.examAnswer.update({
            where: { id },
            data: { order },
          })
        )
      );

      // 清除相關緩存
      await cacheManager.clearAllEntranceExamCache();

      return json({ success: true });
    }

    if (method === "DELETE" && intent === "delete") {
      const id = formData.get("id") as string;

      if (!id) {
        return json({ error: "ID 為必填欄位" }, { status: 400 });
      }

      await prisma.examAnswer.delete({
        where: { id },
      });

      // 清除相關緩存
      await cacheManager.clearAllEntranceExamCache();

      return json({ success: true });
    }

    return json({ error: "不支援的操作" }, { status: 400 });
  } catch (error) {
    console.error("Exam Answer API error:", error);
    return json({ error: "操作失敗" }, { status: 500 });
  }
};
