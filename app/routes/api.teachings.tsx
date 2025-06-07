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
      const videoId = formData.get("videoId") as string;
      const duration = parseInt(formData.get("duration") as string);
      const chapterId = formData.get("chapterId") as string;

      if (!videoId || !duration || !chapterId) {
        return json(
          { error: "影片 ID、時長和章節 ID 為必填欄位" },
          { status: 400 }
        );
      }

      // 獲取該章節下最大的order值
      const maxOrderTeaching = await prisma.teaching.findFirst({
        where: { chapterId },
        orderBy: { order: "desc" },
        select: { order: true },
      });

      const newOrder = (maxOrderTeaching?.order ?? 0) + 1;

      const teaching = await prisma.teaching.create({
        data: {
          videoId,
          duration,
          chapterId,
          order: newOrder,
        },
      });

      return json({ success: true, teaching });
    }

    if (method === "PATCH" && intent === "update") {
      const id = formData.get("id") as string;
      const videoId = formData.get("videoId") as string;
      const duration = parseInt(formData.get("duration") as string);

      if (!id || !videoId || !duration) {
        return json({ error: "ID、影片 ID 和時長為必填欄位" }, { status: 400 });
      }

      const teaching = await prisma.teaching.update({
        where: { id },
        data: {
          videoId,
          duration,
        },
      });

      return json({ success: true, teaching });
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
          prisma.teaching.update({
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

      await prisma.teaching.delete({
        where: { id },
      });

      return json({ success: true });
    }

    return json({ error: "不支援的操作" }, { status: 400 });
  } catch (error) {
    console.error("Teaching API error:", error);
    return json({ error: "操作失敗" }, { status: 500 });
  }
};
