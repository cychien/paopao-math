import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireAdmin } from "~/services/auth/session";
import { uploadFile, R2Storage } from "~/services/storage/r2";

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireAdmin(request);

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    // 解析 multipart/form-data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string;

    if (!file || !(file instanceof File)) {
      return json({ error: "沒有選擇檔案" }, { status: 400 });
    }

    // 驗證檔案
    if (!R2Storage.isValidFileType(file)) {
      return json(
        {
          error:
            "不支援的檔案類型。支援的格式：PDF、JPG、PNG、GIF、WebP、Word 文檔",
        },
        { status: 400 }
      );
    }

    if (!R2Storage.isValidFileSize(file, 10)) {
      return json({ error: "檔案大小超過限制（10MB）" }, { status: 400 });
    }

    // 上傳檔案
    const result = await uploadFile(file, {
      filename: file.name,
      contentType: file.type,
      folder: folder || "entrance-exams",
    });

    return json({
      success: true,
      file: {
        key: result.key,
        url: result.url,
        cdnUrl: result.cdnUrl,
        filename: file.name,
        size: file.size,
        type: file.type,
      },
    });
  } catch (error) {
    console.error("File upload error:", error);
    return json(
      {
        error: error instanceof Error ? error.message : "檔案上傳失敗",
      },
      { status: 500 }
    );
  }
};
