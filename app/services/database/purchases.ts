import { prisma } from "./client";

/**
 * 處理 Lemon Squeezy 訂單創建 webhook
 */
export async function handleOrderCreated(webhookData: any) {
  try {
    const { data } = webhookData;
    const { attributes, id: lemonsqueezyId } = data;

    // 提取必要信息
    const email = attributes.user_email;
    const amount = attributes.total;
    const currency = attributes.currency || "TWD";
    const customerId = attributes.customer_id;

    // 確保用戶存在
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: attributes.user_name || null,
        },
      });
    }

    // 檢查是否已經處理過這個訂單
    const existingPurchase = await prisma.purchase.findUnique({
      where: { lemonsqueezyId: lemonsqueezyId.toString() },
    });

    if (existingPurchase) {
      console.log(`訂單 ${lemonsqueezyId} 已經處理過`);
      return existingPurchase;
    }

    // 創建購買記錄
    const purchase = await prisma.purchase.create({
      data: {
        userId: user.id,
        email,
        lemonsqueezyId: lemonsqueezyId.toString(),
        customerId: customerId?.toString(),
        status: "ACTIVE",
        amount: Math.round(amount * 100), // 轉換為分
        currency,
        productName: "學測總複習班",
        hasLifetimeAccess: true,
        accessGrantedAt: new Date(),
        webhookProcessed: true,
        webhookData: webhookData,
        orderNumber: attributes.order_number,
      },
    });

    console.log(
      `成功處理訂單 ${lemonsqueezyId}，用戶 ${email} 獲得終身訪問權限`
    );
    return purchase;
  } catch (error) {
    console.error("處理訂單創建失敗:", error);
    throw new Error("處理訂單失敗");
  }
}

/**
 * 處理 Lemon Squeezy 訂單退款 webhook
 */
export async function handleOrderRefunded(webhookData: any) {
  try {
    const { data } = webhookData;
    const { id: lemonsqueezyId } = data;

    // 查找對應的購買記錄
    const purchase = await prisma.purchase.findUnique({
      where: { lemonsqueezyId: lemonsqueezyId.toString() },
    });

    if (!purchase) {
      console.log(`找不到訂單 ${lemonsqueezyId} 的購買記錄`);
      return null;
    }

    // 更新購買狀態為退款
    const updatedPurchase = await prisma.purchase.update({
      where: { id: purchase.id },
      data: {
        status: "REFUNDED",
        hasLifetimeAccess: false,
        refundedAt: new Date(),
        webhookData: webhookData,
      },
    });

    console.log(
      `成功處理退款 ${lemonsqueezyId}，撤銷用戶 ${purchase.email} 的訪問權限`
    );
    return updatedPurchase;
  } catch (error) {
    console.error("處理訂單退款失敗:", error);
    throw new Error("處理退款失敗");
  }
}

/**
 * 根據 email 獲取用戶的有效購買記錄
 */
export async function getUserActivePurchases(email: string) {
  try {
    return await prisma.purchase.findMany({
      where: {
        email,
        status: "ACTIVE",
        hasLifetimeAccess: true,
      },
      orderBy: {
        purchasedAt: "desc",
      },
    });
  } catch (error) {
    console.error("獲取用戶購買記錄失敗:", error);
    throw new Error("獲取購買記錄失敗");
  }
}

/**
 * 驗證用戶是否有課程訪問權限
 */
export async function verifyUserAccess(email: string): Promise<boolean> {
  try {
    const activePurchases = await getUserActivePurchases(email);
    return activePurchases.length > 0;
  } catch (error) {
    console.error("驗證用戶權限失敗:", error);
    return false;
  }
}

/**
 * 根據 Lemon Squeezy 訂單 ID 查找購買記錄
 */
export async function findPurchaseByLemonSqueezyId(lemonsqueezyId: string) {
  try {
    return await prisma.purchase.findUnique({
      where: { lemonsqueezyId },
      include: {
        user: true,
      },
    });
  } catch (error) {
    console.error("查找購買記錄失敗:", error);
    return null;
  }
}

/**
 * 獲取購買統計信息
 */
export async function getPurchaseStats() {
  try {
    const [totalPurchases, activePurchases, refundedPurchases, totalRevenue] =
      await Promise.all([
        prisma.purchase.count(),
        prisma.purchase.count({ where: { status: "ACTIVE" } }),
        prisma.purchase.count({ where: { status: "REFUNDED" } }),
        prisma.purchase.aggregate({
          where: { status: "ACTIVE" },
          _sum: { amount: true },
        }),
      ]);

    return {
      totalPurchases,
      activePurchases,
      refundedPurchases,
      totalRevenue: totalRevenue._sum.amount || 0,
    };
  } catch (error) {
    console.error("獲取購買統計失敗:", error);
    throw new Error("獲取統計信息失敗");
  }
}
