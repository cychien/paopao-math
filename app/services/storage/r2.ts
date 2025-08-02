import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const R2_BUCKET = process.env.R2_BUCKET || "paopao-math";

interface UploadResult {
  key: string;
  url: string;
  cdnUrl: string;
}

// 支援 FileLike 對象的類型定義
interface FileLike {
  arrayBuffer(): Promise<ArrayBuffer>;
  type?: string;
  name?: string;
  size?: number;
}

class R2Storage {
  private client: S3Client;

  constructor() {
    if (
      !process.env.R2_ACCESS_KEY_ID ||
      !process.env.R2_SECRET_ACCESS_KEY ||
      !process.env.R2_ENDPOINT
    ) {
      throw new Error(
        "Missing R2 configuration. Please set R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_ENDPOINT"
      );
    }

    this.client = new S3Client({
      region: process.env.R2_REGION || "auto",
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
      // 解決方案 4: 關閉自動雜湊計算以避免 flowing stream 錯誤
      requestChecksumCalculation: "WHEN_REQUIRED",
      responseChecksumValidation: "WHEN_REQUIRED",
      // 確保與 R2 兼容的其他設置
      forcePathStyle: true,
    });
  }

  /**
   * 上傳檔案到 R2
   * 解決方案 2: 直接轉 Buffer 再上傳，避免 stream 問題
   */
  async upload(
    file: File | FileLike | Buffer,
    options: {
      filename?: string;
      contentType?: string;
      folder?: string;
    } = {}
  ): Promise<UploadResult> {
    try {
      const { filename, contentType, folder = "entrance-exams" } = options;

      // 生成唯一的檔案名稱
      const uuid = randomUUID();
      const extension = filename ? this.getFileExtension(filename) : "";
      const key = `${folder}/${uuid}${extension}`;

      // 解決方案 2: 確保使用 Buffer，避免 stream 問題
      let body: Buffer;
      let finalContentType: string;

      if (file instanceof Buffer) {
        // 已經是 Buffer
        body = file;
        finalContentType = contentType || "application/octet-stream";
      } else if (file && typeof file === "object" && "arrayBuffer" in file) {
        // 處理 File 或 FileLike 對象
        try {
          // 嘗試獲取 arrayBuffer
          const arrayBuffer = await (file as FileLike).arrayBuffer();
          body = Buffer.from(arrayBuffer);

          // 嘗試獲取 type 和 name 屬性
          const fileType = (file as FileLike).type || "";
          const fileName = (file as FileLike).name || filename || "";

          finalContentType =
            contentType || fileType || "application/octet-stream";

          // 如果沒有提供 filename，嘗試從 file 對象獲取
          if (!filename && fileName) {
            options.filename = fileName;
          }
        } catch (error) {
          console.error("Error processing file object:", error);
          throw new Error("無法處理檔案對象");
        }
      } else {
        console.error("Unsupported file type:", typeof file, file);
        throw new Error("不支援的檔案類型");
      }

      // 上傳到 R2
      const command = new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: body,
        ContentType: finalContentType,
        // 明確設置 ContentLength 以確保上傳正確
        ContentLength: body.length,
        Metadata: {
          originalFilename:
            options.filename || filename
              ? Buffer.from(options.filename || filename || "").toString(
                  "base64"
                )
              : "unknown",
          uploadedAt: new Date().toISOString(),
        },
      });

      await this.client.send(command);

      // 返回結果
      const url = `${process.env.R2_ENDPOINT}/${R2_BUCKET}/${key}`;
      const cdnUrl = process.env.R2_CDN_URL
        ? `${process.env.R2_CDN_URL}/${key}`
        : url;

      return {
        key,
        url,
        cdnUrl,
      };
    } catch (error) {
      console.error("R2 upload error:", error);
      throw new Error("檔案上傳失敗");
    }
  }

  /**
   * 從 R2 刪除檔案
   */
  async delete(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
      });

      await this.client.send(command);
    } catch (error) {
      console.error("R2 delete error:", error);
      throw new Error("檔案刪除失敗");
    }
  }

  /**
   * 從檔案名稱取得副檔名
   */
  private getFileExtension(filename: string): string {
    const lastDotIndex = filename.lastIndexOf(".");
    return lastDotIndex !== -1 ? filename.substring(lastDotIndex) : "";
  }

  /**
   * 從 URL 提取檔案 key
   */
  static extractKeyFromUrl(url: string): string | null {
    try {
      // 處理 CDN URL
      if (process.env.R2_CDN_URL && url.startsWith(process.env.R2_CDN_URL)) {
        return url.replace(`${process.env.R2_CDN_URL}/`, "");
      }

      // 處理 R2 原生 URL
      if (process.env.R2_ENDPOINT && url.startsWith(process.env.R2_ENDPOINT)) {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split("/").filter((part) => part);

        // URL 格式：https://endpoint/bucket/key
        if (pathParts[0] === R2_BUCKET) {
          return pathParts.slice(1).join("/");
        }
      }

      return null;
    } catch (error) {
      console.error("Error extracting key from URL:", error);
      return null;
    }
  }

  /**
   * 檢查檔案類型是否被支援
   */
  static isValidFileType(file: File): boolean {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    return allowedTypes.includes(file.type);
  }

  /**
   * 檢查檔案大小是否合適
   */
  static isValidFileSize(file: File, maxSizeMB: number = 10): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }

  /**
   * 檢查 URL 是否為 R2 URL
   */
  static isR2Url(url: string): boolean {
    return (
      (!!process.env.R2_ENDPOINT && url.startsWith(process.env.R2_ENDPOINT)) ||
      (!!process.env.R2_CDN_URL && url.startsWith(process.env.R2_CDN_URL))
    );
  }
}

// 單例實例
export const r2Storage = new R2Storage();

// 輔助函數
export async function uploadFile(
  file: File | FileLike,
  options?: {
    filename?: string;
    contentType?: string;
    folder?: string;
  }
): Promise<UploadResult> {
  // 驗證檔案
  if (file instanceof File && !R2Storage.isValidFileType(file)) {
    throw new Error("不支援的檔案類型");
  }

  if (file instanceof File && !R2Storage.isValidFileSize(file)) {
    throw new Error("檔案大小超過限制（10MB）");
  }

  return r2Storage.upload(file, options);
}

export async function deleteFile(url: string): Promise<void> {
  const key = R2Storage.extractKeyFromUrl(url);
  if (!key) {
    throw new Error("無效的檔案 URL");
  }

  return r2Storage.delete(key);
}

export { R2Storage, type UploadResult };
