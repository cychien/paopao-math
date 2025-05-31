import { prisma } from "./client";
import { withCache, cacheKeys, cache } from "../cache/redis";

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
    lemonsqueezyId: string;
    orderNumber: string;
    amount: number;
    currency: string;
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
 * 根據 email 獲取用戶及其購買記錄（快取版本）
 */
export async function getUserWithPurchases(
  email: string
): Promise<UserWithPurchases | null> {
  return withCache(
    cacheKeys.userWithPurchases(email),
    async () => {
      try {
        return await prisma.user.findUnique({
          where: { email },
          include: {
            purchases: {
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
    },
    300 // 快取 5 分鐘
  );
}

/**
 * 檢查用戶是否有課程訪問權限（快取版本）
 */
export async function checkUserAccess(email: string): Promise<boolean> {
  return withCache(
    cacheKeys.userAccess(email),
    async () => {
      try {
        const user = await getUserWithPurchases(email);

        if (!user) {
          return false;
        }

        // 檢查是否有任何有效的購買記錄
        return user.purchases.some(
          (purchase) =>
            purchase.status === "ACTIVE" && purchase.hasLifetimeAccess
        );
      } catch (error) {
        console.error("檢查用戶權限失敗:", error);
        return false;
      }
    },
    600 // 快取 10 分鐘
  );
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

/**
 * 創建購買記錄時清除相關快取
 */
export async function createPurchaseRecord(data: {
  userId: string;
  email: string;
  lemonSqueezyOrderId: string;
  orderNumber: string;
  amount: number;
  status: string;
  hasLifetimeAccess: boolean;
  testMode: boolean;
  purchasedAt: Date;
}) {
  try {
    // 確保用戶存在
    const user = await createOrGetUser(data.email);

    // 創建購買記錄
    const purchase = await prisma.purchase.create({
      data: {
        userId: user.id,
        email: data.email,
        lemonsqueezyId: data.lemonSqueezyOrderId,
        orderNumber: data.orderNumber,
        amount: data.amount,
        status: data.status as "PENDING" | "ACTIVE" | "REFUNDED",
        hasLifetimeAccess: data.hasLifetimeAccess,
        testMode: data.testMode,
        purchasedAt: data.purchasedAt,
        productName: "學測總複習班",
      },
    });

    // 清除相關快取
    await Promise.all([
      cache.del(cacheKeys.userWithPurchases(data.email)),
      cache.del(cacheKeys.userAccess(data.email)),
      cache.del(cacheKeys.purchaseStats()),
    ]);

    return purchase;
  } catch (error) {
    console.error("創建購買記錄失敗:", error);
    throw new Error("創建購買記錄失敗");
  }
}

/**
 * 更新購買狀態時清除相關快取
 */
export async function updatePurchaseStatus(
  lemonSqueezyOrderId: string,
  status: "ACTIVE" | "REFUNDED",
  hasLifetimeAccess: boolean
) {
  try {
    // 首先找到購買記錄
    const purchase = await prisma.purchase.findUnique({
      where: { lemonsqueezyId: lemonSqueezyOrderId },
    });

    if (!purchase) {
      throw new Error(`找不到訂單 ${lemonSqueezyOrderId}`);
    }

    // 更新購買狀態
    const updatedPurchase = await prisma.purchase.update({
      where: { lemonsqueezyId: lemonSqueezyOrderId },
      data: {
        status,
        hasLifetimeAccess,
        ...(status === "REFUNDED" && { refundedAt: new Date() }),
      },
    });

    // 清除相關快取
    await Promise.all([
      cache.del(cacheKeys.userWithPurchases(purchase.email)),
      cache.del(cacheKeys.userAccess(purchase.email)),
      cache.del(cacheKeys.purchaseStats()),
    ]);

    return updatedPurchase;
  } catch (error) {
    console.error("更新購買狀態失敗:", error);
    throw new Error("更新購買狀態失敗");
  }
}
