// 統一匯出所有資料庫服務
export { prisma } from "./client";

// 用戶相關服務
export {
  createOrGetUser,
  getUserWithPurchases,
  checkUserAccess,
  createMagicLinkSession,
  verifyMagicLinkToken,
  cleanupExpiredSessions,
} from "./users";

// 購買相關服務
export {
  handleOrderCreated,
  handleOrderRefunded,
  getUserActivePurchases,
  verifyUserAccess,
  findPurchaseByLemonSqueezyId,
  getPurchaseStats,
} from "./purchases";

// 類型匯出（當 Prisma 類型可用時）
export type { UserWithPurchases } from "./users";
