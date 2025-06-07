import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireAdmin } from "~/services/auth/session";
import { prisma } from "~/services/database/client";
import { cacheManager } from "~/services/cache/redis";
import { uploadFile, deleteFile, R2Storage } from "~/services/storage/r2";

// 輔助方法
function getFileTypeFromMimeType(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.includes("word")) return "doc";
  return "file";
}

function isR2Url(url: string): boolean {
  return R2Storage.isR2Url(url);
}

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireAdmin(request);

  const formData = await request.formData();
  const method = request.method;
  const intent = formData.get("intent");

  try {
    if (method === "POST" && intent === "create") {
      const title = formData.get("title") as string;
      const questionType = formData.get("questionType") as string;
      const examId = formData.get("examId") as string;
      const file = formData.get("file") as File | null;

      if (!title || !questionType || !examId) {
        return json(
          { error: "標題、題目類型和考試ID為必填欄位" },
          { status: 400 }
        );
      }

      // 檢查是否有檔案上傳 - 處理字符串類型（表示沒有新文件）
      const isValidFileForCreate =
        file &&
        typeof file === "object" &&
        "size" in file &&
        "name" in file &&
        typeof file.size === "number" &&
        typeof file.name === "string" &&
        file.size > 0;

      if (!isValidFileForCreate) {
        return json({ error: "請上傳題目檔案" }, { status: 400 });
      }

      // 驗證檔案
      if (!R2Storage.isValidFileType(file as File)) {
        return json({ error: "不支援的檔案類型" }, { status: 400 });
      }

      if (!R2Storage.isValidFileSize(file as File, 10)) {
        return json({ error: "檔案大小超過限制（10MB）" }, { status: 400 });
      }

      // 上傳檔案
      const uploadResult = await uploadFile(file as File, {
        filename: (file as File).name,
        contentType: (file as File).type,
        folder: "entrance-exams/questions",
      });

      const fileType = getFileTypeFromMimeType((file as File).type);
      const fileUrl = uploadResult.cdnUrl || uploadResult.url;

      // 獲取同一考試下的最大order值
      const maxOrderQuestion = await prisma.examQuestion.findFirst({
        where: { examId },
        orderBy: { order: "desc" },
        select: { order: true },
      });

      const newOrder = (maxOrderQuestion?.order ?? 0) + 1;

      const question = await prisma.examQuestion.create({
        data: {
          title,
          fileType,
          fileUrl,
          downloadFilename: (file as File).name,
          questionType,
          examId,
          order: newOrder,
        },
      });

      // 清除相關緩存
      await cacheManager.clearAllEntranceExamCache();

      return json({ success: true, question });
    }

    if (method === "PATCH" && intent === "update") {
      const id = formData.get("id") as string;
      const title = formData.get("title") as string;
      const questionType = formData.get("questionType") as string;
      const file = formData.get("file") as File | null;

      if (!id || !title || !questionType) {
        return json({ error: "ID、標題和題目類型為必填欄位" }, { status: 400 });
      }

      // 取得原有的題目資料
      const existingQuestion = await prisma.examQuestion.findUnique({
        where: { id },
        select: { fileUrl: true, fileType: true, downloadFilename: true },
      });

      if (!existingQuestion) {
        return json({ error: "找不到指定的題目" }, { status: 404 });
      }

      let fileType = existingQuestion.fileType;
      let fileUrl = existingQuestion.fileUrl;
      let downloadFilename = existingQuestion.downloadFilename;

      // 如果有上傳新檔案 - 只有當 file 是對象且有實際內容時才處理
      // 如果 file 是字符串，表示沒有新文件上傳，保持原有文件不變
      const isValidFile =
        file &&
        typeof file === "object" &&
        "size" in file &&
        "name" in file &&
        typeof file.size === "number" &&
        typeof file.name === "string" &&
        file.size > 0;

      if (isValidFile) {
        // 驗證檔案
        if (!R2Storage.isValidFileType(file as File)) {
          return json({ error: "不支援的檔案類型" }, { status: 400 });
        }

        if (!R2Storage.isValidFileSize(file as File, 10)) {
          return json({ error: "檔案大小超過限制（10MB）" }, { status: 400 });
        }

        // 先刪除舊檔案（如果存在且為 R2 檔案）
        if (existingQuestion.fileUrl && isR2Url(existingQuestion.fileUrl)) {
          try {
            await deleteFile(existingQuestion.fileUrl);
          } catch (error) {
            console.warn("Failed to delete old file:", error);
          }
        }

        // 上傳新檔案
        const uploadResult = await uploadFile(file as File, {
          filename: (file as File).name,
          contentType: (file as File).type,
          folder: "entrance-exams/questions",
        });

        fileType = getFileTypeFromMimeType((file as File).type);
        fileUrl = uploadResult.cdnUrl || uploadResult.url;
        downloadFilename = (file as File).name;
      }

      const question = await prisma.examQuestion.update({
        where: { id },
        data: {
          title,
          fileType,
          fileUrl,
          downloadFilename,
          questionType,
        },
      });

      // 清除相關緩存
      await cacheManager.clearAllEntranceExamCache();

      return json({ success: true, question });
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
          prisma.examQuestion.update({
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

      // 取得題目資料以刪除關聯的檔案
      const question = await prisma.examQuestion.findUnique({
        where: { id },
        select: { fileUrl: true },
      });

      if (question && question.fileUrl && isR2Url(question.fileUrl)) {
        try {
          await deleteFile(question.fileUrl);
        } catch (error) {
          console.warn(
            "Failed to delete file during question deletion:",
            error
          );
        }
      }

      await prisma.examQuestion.delete({
        where: { id },
      });

      // 清除相關緩存
      await cacheManager.clearAllEntranceExamCache();

      return json({ success: true });
    }

    return json({ error: "不支援的操作" }, { status: 400 });
  } catch (error) {
    console.error("Exam Question API error:", error);
    return json({ error: "操作失敗" }, { status: 500 });
  }
};
