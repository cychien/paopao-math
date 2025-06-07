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
      const year = parseInt(formData.get("year") as string);
      const subject = formData.get("subject") as string;
      const type = formData.get("type") as string;
      const description = formData.get("description") as string;

      if (!title || !year || !subject || !type) {
        return json(
          { error: "標題、年份、科目和類型為必填欄位" },
          { status: 400 }
        );
      }

      // 獲取最大的order值
      const maxOrderExam = await prisma.entranceExam.findFirst({
        orderBy: { order: "desc" },
        select: { order: true },
      });

      const newOrder = (maxOrderExam?.order ?? 0) + 1;

      const exam = await prisma.entranceExam.create({
        data: {
          title,
          year,
          subject,
          type,
          description: description || null,
          order: newOrder,
        },
      });

      // 清除相關緩存
      await cacheManager.clearAllEntranceExamCache();

      return json({ success: true, exam });
    }

    if (method === "PATCH" && intent === "update") {
      const id = formData.get("id") as string;
      const title = formData.get("title") as string;
      const year = parseInt(formData.get("year") as string);
      const subject = formData.get("subject") as string;
      const type = formData.get("type") as string;
      const description = formData.get("description") as string;

      if (!id || !title || !year || !subject || !type) {
        return json(
          { error: "ID、標題、年份、科目和類型為必填欄位" },
          { status: 400 }
        );
      }

      const exam = await prisma.entranceExam.update({
        where: { id },
        data: {
          title,
          year,
          subject,
          type,
          description: description || null,
        },
      });

      // 清除相關緩存
      await cacheManager.clearEntranceExamCache(exam.id);

      return json({ success: true, exam });
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
          prisma.entranceExam.update({
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

      await prisma.entranceExam.delete({
        where: { id },
      });

      // 清除相關緩存
      await cacheManager.clearEntranceExamCache(id);

      return json({ success: true });
    }

    return json({ error: "不支援的操作" }, { status: 400 });
  } catch (error) {
    console.error("Entrance Exam API error:", error);
    return json({ error: "操作失敗" }, { status: 500 });
  }
};
