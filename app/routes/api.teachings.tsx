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

      const teaching = await prisma.teaching.create({
        data: {
          videoId,
          duration,
          chapterId,
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
