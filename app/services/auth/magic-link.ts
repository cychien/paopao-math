import crypto from "crypto";
import { createMagicLinkSession, verifyMagicLinkToken } from "../database";

interface MagicLinkConfig {
  secret: string;
  expiryMinutes: number;
  appUrl: string;
}

/**
 * 生成安全的 Magic Link token
 */
export function generateMagicLinkToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * 創建 Magic Link URL
 */
export function createMagicLinkUrl(
  token: string,
  config: MagicLinkConfig
): string {
  const baseUrl = config.appUrl.endsWith("/")
    ? config.appUrl.slice(0, -1)
    : config.appUrl;
  return `${baseUrl}/auth/verify?token=${token}`;
}

/**
 * 計算 token 過期時間
 */
export function calculateExpiryTime(expiryMinutes: number): Date {
  return new Date(Date.now() + expiryMinutes * 60 * 1000);
}

/**
 * 發送 Magic Link (創建 session 並返回 URL)
 */
export async function sendMagicLink(
  email: string,
  config: MagicLinkConfig,
  ipAddress?: string,
  userAgent?: string
): Promise<{ token: string; url: string; expiresAt: Date }> {
  try {
    // 生成 token 和過期時間
    const token = generateMagicLinkToken();
    const expiresAt = calculateExpiryTime(config.expiryMinutes);

    // 創建 Magic Link URL
    const url = createMagicLinkUrl(token, config);

    // 儲存到資料庫
    await createMagicLinkSession(email, token, expiresAt, ipAddress, userAgent);

    console.log(`Magic Link 已生成：${email} -> ${url}`);

    return {
      token,
      url,
      expiresAt,
    };
  } catch (error) {
    console.error("生成 Magic Link 失敗:", error);
    throw new Error("生成登入連結失敗");
  }
}

/**
 * 驗證 Magic Link token 並返回用戶
 */
export async function verifyMagicLink(token: string) {
  try {
    const user = await verifyMagicLinkToken(token);

    if (!user) {
      return {
        success: false,
        error: "Invalid or expired magic link",
        user: null,
      };
    }

    console.log(`Magic Link 驗證成功：${user.email}`);

    return {
      success: true,
      error: null,
      user,
    };
  } catch (error) {
    console.error("驗證 Magic Link 失敗:", error);
    return {
      success: false,
      error: "Verification failed",
      user: null,
    };
  }
}

/**
 * 獲取 Magic Link 配置
 */
export function getMagicLinkConfig(): MagicLinkConfig {
  const secret = process.env.MAGIC_LINK_SECRET;
  const expiryMinutes = parseInt(process.env.MAGIC_LINK_EXPIRY_MINUTES || "30");
  const appUrl = process.env.APP_URL;

  if (!secret) {
    throw new Error("MAGIC_LINK_SECRET environment variable is required");
  }

  if (!appUrl) {
    throw new Error("APP_URL environment variable is required");
  }

  return {
    secret,
    expiryMinutes,
    appUrl,
  };
}

/**
 * 驗證 email 格式
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 清理過期的 Magic Link tokens
 */
export async function cleanupExpiredTokens(): Promise<number> {
  try {
    const { cleanupExpiredSessions } = await import("../database");
    return await cleanupExpiredSessions();
  } catch (error) {
    console.error("清理過期 tokens 失敗:", error);
    return 0;
  }
}
