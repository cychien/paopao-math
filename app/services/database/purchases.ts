import { prisma } from "./prisma.server";
import { withCache, cacheKeys } from "../cache/redis";

/**
 * 處理 Lemon Squeezy 訂單創建 webhook
 */
export async function handleOrderCreated(webhookData: any) {
  try {
    const { data } = webhookData;
    const { attributes, id: lemonsqueezyId } = data;

    // 提取必要信息
    const email = attributes.user_email;
    const customerId = attributes.customer_id;
    const variantId = attributes.first_order_item?.variant_id;
    
    // 從 custom data 獲取我們的 variant ID 和 app ID
    const customData = attributes.custom_data || {};
    const appId = customData.app_id;
    const ourVariantId = customData.variant_id;

    if (!appId || !ourVariantId) {
      console.error("Missing app_id or variant_id in custom data");
      throw new Error("Missing required custom data");
    }

    // 檢查是否已經處理過這個訂單
    const existingCustomer = await prisma.lemonSqueezyCustomer.findUnique({
      where: { lemonSqueezyOrderId: lemonsqueezyId.toString() },
    });

    if (existingCustomer) {
      console.log(`訂單 ${lemonsqueezyId} 已經處理過`);
      return existingCustomer;
    }

    // 創建或獲取 AppCustomer
    let appCustomer = await prisma.appCustomer.findFirst({
      where: {
        appId,
        email,
        variantId: ourVariantId,
      },
    });

    if (!appCustomer) {
      appCustomer = await prisma.appCustomer.create({
        data: {
          appId,
          variantId: ourVariantId,
          email,
          name: attributes.user_name || null,
        },
      });
    }

    // 創建 LemonSqueezyCustomer 記錄
    const lsCustomer = await prisma.lemonSqueezyCustomer.create({
      data: {
        customerId: appCustomer.id,
        lemonSqueezyCustomerId: customerId?.toString() || null,
        lemonSqueezyOrderId: lemonsqueezyId.toString(),
      },
    });

    console.log(
      `成功處理訂單 ${lemonsqueezyId}，用戶 ${email} 獲得訪問權限`
    );
    return lsCustomer;
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
    const lsCustomer = await prisma.lemonSqueezyCustomer.findUnique({
      where: { lemonSqueezyOrderId: lemonsqueezyId.toString() },
      include: {
        customer: true,
      },
    });

    if (!lsCustomer) {
      console.log(`找不到訂單 ${lemonsqueezyId} 的購買記錄`);
      return null;
    }

    // 刪除 LemonSqueezyCustomer 記錄（這會撤銷訪問權限）
    await prisma.lemonSqueezyCustomer.delete({
      where: { id: lsCustomer.id },
    });

    console.log(
      `成功處理退款 ${lemonsqueezyId}，撤銷用戶 ${lsCustomer.customer.email} 的訪問權限`
    );
    return lsCustomer;
  } catch (error) {
    console.error("處理訂單退款失敗:", error);
    throw new Error("處理退款失敗");
  }
}

/**
 * 根據 email 和 appId 檢查用戶是否有訪問權限
 */
export async function checkCustomerAccess(
  appId: string,
  email: string
): Promise<boolean> {
  return withCache(
    cacheKeys.userAccess(email),
    async () => {
      try {
        const customer = await prisma.appCustomer.findFirst({
          where: {
            appId,
            email,
          },
          include: {
            lemonSqueezyCustomer: true,
          },
        });

        // 有 AppCustomer 且有 LemonSqueezyCustomer 記錄表示已購買
        return !!customer?.lemonSqueezyCustomer;
      } catch (error) {
        console.error("檢查用戶權限失敗:", error);
        return false;
      }
    },
    600 // 快取 10 分鐘
  );
}

/**
 * 根據 Lemon Squeezy 訂單 ID 查找購買記錄
 */
export async function findPurchaseByLemonSqueezyId(lemonsqueezyId: string) {
  try {
    return await prisma.lemonSqueezyCustomer.findUnique({
      where: { lemonSqueezyOrderId: lemonsqueezyId },
      include: {
        customer: true,
      },
    });
  } catch (error) {
    console.error("查找購買記錄失敗:", error);
    return null;
  }
}

/**
 * 獲取購買統計信息（快取版本）
 */
export async function getPurchaseStats() {
  return withCache(
    cacheKeys.purchaseStats(),
    async () => {
      try {
        const [totalCustomers, activeCustomers] = await Promise.all([
          prisma.appCustomer.count(),
          prisma.appCustomer.count({
            where: {
              lemonSqueezyCustomer: {
                isNot: null,
              },
            },
          }),
        ]);

        return {
          totalCustomers,
          activeCustomers,
        };
      } catch (error) {
        console.error("獲取購買統計失敗:", error);
        throw new Error("獲取統計信息失敗");
      }
    },
    1800 // 快取 30 分鐘
  );
}
