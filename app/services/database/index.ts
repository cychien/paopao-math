// 統一匯出所有資料庫服務
export { prisma } from "./prisma.server";

// 用戶相關服務（workspace users）
export {
  createOrGetUser,
  getUserByEmail,
  createUserSession,
  verifySession,
  cleanupExpiredSessions,
  createEmailChallenge,
  verifyEmailChallenge,
} from "./users";

// 購買相關服務（使用新的 AppCustomer / LemonSqueezyCustomer 結構）
export {
  handleOrderCreated,
  handleOrderRefunded,
  checkCustomerAccess,
  findPurchaseByLemonSqueezyId,
  getPurchaseStats,
} from "./purchases";

// 課程相關服務
export { getLessonBySlug } from "./course";