import { prisma } from "./client";

export type UserWithPurchases = {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
  purchases: Array<{
    id: string;
    status: string;
    hasLifetimeAccess: boolean;
    purchasedAt: Date;
  }>;
};

/**
 * 根據 email 創建或獲取用戶
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
 * 根據 email 獲取用戶及其購買記錄
 */
export async function getUserWithPurchases(
  email: string
): Promise<UserWithPurchases | null> {
  try {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        purchases: {
          where: {
            status: "ACTIVE",
          },
          orderBy: {
            purchasedAt: "desc",
          },
        },
      },
    });
  } catch (error) {
    console.error("獲取用戶購買記錄失敗:", error);
    throw new Error("獲取用戶數據失敗");
  }
}

/**
 * 檢查用戶是否有課程訪問權限
 */
export async function checkUserAccess(email: string): Promise<boolean> {
  try {
    const user = await getUserWithPurchases(email);

    if (!user) {
      return false;
    }

    // 檢查是否有任何有效的購買記錄
    return user.purchases.some(
      (purchase) => purchase.status === "ACTIVE" && purchase.hasLifetimeAccess
    );
  } catch (error) {
    console.error("檢查用戶權限失敗:", error);
    return false;
  }
}

/**
 * 創建 Magic Link session
 */
export async function createMagicLinkSession(
  email: string,
  token: string,
  expiresAt: Date,
  ipAddress?: string,
  userAgent?: string
) {
  try {
    // 確保用戶存在
    const user = await createOrGetUser(email);

    // 創建 session
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        email,
        token,
        expiresAt,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
      },
    });

    return session;
  } catch (error) {
    console.error("創建 Magic Link session 失敗:", error);
    throw new Error("創建登入連結失敗");
  }
}

/**
 * 驗證並使用 Magic Link token
 */
export async function verifyMagicLinkToken(token: string) {
  try {
    // 查找未使用且未過期的 session
    const session = await prisma.session.findUnique({
      where: { token },
      include: {
        user: true,
      },
    });

    if (!session) {
      return null;
    }

    // 檢查是否已使用
    if (session.used) {
      return null;
    }

    // 檢查是否過期
    if (session.expiresAt < new Date()) {
      return null;
    }

    // 標記為已使用
    await prisma.session.update({
      where: { id: session.id },
      data: {
        used: true,
        usedAt: new Date(),
      },
    });

    return session.user;
  } catch (error) {
    console.error("驗證 Magic Link token 失敗:", error);
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
        OR: [
          { expiresAt: { lt: new Date() } },
          {
            used: true,
            usedAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
          }, // 清理 24 小時前已使用的
        ],
      },
    });

    return result.count;
  } catch (error) {
    console.error("清理過期 sessions 失敗:", error);
    return 0;
  }
}
