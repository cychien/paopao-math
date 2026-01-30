import { prisma } from "./prisma.server";
import { withCache, cacheKeys, cache } from "../cache/redis";

/**
 * 根據 email 創建或獲取 workspace 用戶
 */
export async function createOrGetUser(email: string, name?: string) {
  try {
    // 嘗試獲取現有用戶
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // 如果用戶不存在，創建新用戶
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: name || null,
        },
      });
    }

    return user;
  } catch (error) {
    console.error("創建或獲取用戶失敗:", error);
    throw new Error("用戶操作失敗");
  }
}

/**
 * 根據 email 獲取 workspace 用戶（快取版本）
 */
export async function getUserByEmail(email: string) {
  return withCache(
    cacheKeys.userWithPurchases(email), // 保持相同的 cache key
    async () => {
      try {
        return await prisma.user.findUnique({
          where: { email },
          include: {
            memberships: {
              include: {
                workspace: true,
              },
            },
          },
        });
      } catch (error) {
        console.error("獲取用戶失敗:", error);
        throw new Error("獲取用戶數據失敗");
      }
    },
    300 // 快取 5 分鐘
  );
}

/**
 * 創建 workspace 用戶 session
 */
export async function createUserSession(
  userId: string,
  workspaceId: string | null,
  tokenHash: string,
  expiresAt: Date,
  ipAddress?: string,
  userAgent?: string
) {
  try {
    const session = await prisma.session.create({
      data: {
        userId,
        workspaceId,
        tokenHash,
        expiresAt,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
      },
    });

    return session;
  } catch (error) {
    console.error("創建 session 失敗:", error);
    throw new Error("創建 session 失敗");
  }
}

/**
 * 驗證並獲取 session
 */
export async function verifySession(tokenHash: string) {
  try {
    const session = await prisma.session.findUnique({
      where: { tokenHash },
      include: {
        user: true,
        workspace: true,
      },
    });

    if (!session) {
      return null;
    }

    // 檢查是否過期
    if (session.expiresAt < new Date()) {
      return null;
    }

    // 更新最後使用時間
    await prisma.session.update({
      where: { id: session.id },
      data: {
        lastUsedAt: new Date(),
      },
    });

    return session;
  } catch (error) {
    console.error("驗證 session 失敗:", error);
    return null;
  }
}

/**
 * 清理過期的 sessions
 */
export async function cleanupExpiredSessions(): Promise<number> {
  try {
    const result = await prisma.session.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });

    return result.count;
  } catch (error) {
    console.error("清理過期 sessions 失敗:", error);
    return 0;
  }
}

/**
 * 創建 EmailChallenge for magic link
 */
export async function createEmailChallenge(
  email: string,
  tokenHash: string,
  expiresAt: Date,
  appId?: string,
  username?: string
) {
  try {
    const challenge = await prisma.emailChallenge.create({
      data: {
        email,
        tokenHash,
        expiresAt,
        appId: appId || null,
        username: username || null,
      },
    });

    return challenge;
  } catch (error) {
    console.error("創建 EmailChallenge 失敗:", error);
    throw new Error("創建驗證失敗");
  }
}

/**
 * 驗證並消費 EmailChallenge
 */
export async function verifyEmailChallenge(email: string, tokenHash: string) {
  try {
    const challenge = await prisma.emailChallenge.findUnique({
      where: {
        email_tokenHash: {
          email,
          tokenHash,
        },
      },
    });

    if (!challenge) {
      return null;
    }

    // 檢查狀態
    if (challenge.status !== "PENDING") {
      return null;
    }

    // 檢查是否過期
    if (challenge.expiresAt < new Date()) {
      await prisma.emailChallenge.update({
        where: { id: challenge.id },
        data: { status: "EXPIRED" },
      });
      return null;
    }

    // 標記為已消費
    await prisma.emailChallenge.update({
      where: { id: challenge.id },
      data: { status: "CONSUMED" },
    });

    return challenge;
  } catch (error) {
    console.error("驗證 EmailChallenge 失敗:", error);
    return null;
  }
}
