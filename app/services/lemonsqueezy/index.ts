// Client configuration
export {
  initializeLemonSqueezy,
  validateLemonSqueezyConfig,
  LEMON_SQUEEZY_CONFIG,
} from "./client";

// Product and checkout services
export {
  createCheckoutSession,
  createQuickCheckout,
  getProductInfo,
} from "./products";

// Order management services
export {
  getOrderById,
  getOrdersByEmail,
  checkUserPurchaseStatus,
  orderToPurchase,
  doesOrderGrantAccess,
} from "./orders";

// Purchase and access services (one-time purchase model)
export {
  hasActiveAccess,
  getUserPurchase,
  shouldHavePremiumAccess,
  getUserAccessLevel,
  hasLifetimeAccess,
} from "./subscriptions";

// Type definitions
export type {
  CheckoutSession,
  PaymentResult,
  UserPurchase,
  UserAccessLevel,
  LemonSqueezyCheckoutData,
  LemonSqueezyCheckoutResponse,
  LemonSqueezyOrder,
  LemonSqueezyWebhookPayload,
  WebhookEventType,
} from "./types";
