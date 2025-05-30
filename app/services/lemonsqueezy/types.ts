// Lemon Squeezy API Types
export interface LemonSqueezyCheckoutData {
  type: "checkouts";
  id: string;
  attributes: {
    store_id: number;
    variant_id: number;
    custom_price?: number;
    product_options?: {
      name?: string;
      description?: string;
      media?: string[];
      redirect_url?: string;
      receipt_button_text?: string;
      receipt_link_url?: string;
      receipt_thank_you_note?: string;
      enabled_variants?: number[];
    };
    checkout_options?: {
      embed?: boolean;
      media?: boolean;
      logo?: boolean;
      desc?: boolean;
      discount?: boolean;
      dark?: boolean;
      subscription_preview?: boolean;
      button_color?: string;
    };
    checkout_data?: {
      email?: string;
      name?: string;
      billing_address?: {
        country?: string;
        zip?: string;
      };
      tax_number?: string;
      discount_code?: string;
      custom?: Record<string, unknown>;
    };
    preview?: boolean;
    test_mode?: boolean;
  };
  relationships?: Record<string, unknown>;
}

export interface LemonSqueezyCheckoutResponse {
  data: {
    type: "checkouts";
    id: string;
    attributes: {
      url: string;
      store_id: number;
      variant_id: number;
      custom_price: number | null;
      product_options: Record<string, unknown>;
      checkout_options: Record<string, unknown>;
      checkout_data: Record<string, unknown>;
      expires_at: string | null;
      created_at: string;
      updated_at: string;
      test_mode: boolean;
      url_expires_at: string | null;
    };
  };
}

export interface LemonSqueezyOrder {
  type: "orders";
  id: string;
  attributes: {
    store_id: number;
    customer_id: number;
    identifier: string;
    order_number: number;
    user_name: string;
    user_email: string;
    currency: string;
    currency_rate: string;
    tax_name: string | null;
    tax_rate: string;
    status: "pending" | "paid" | "void" | "refunded" | "partial_refund";
    status_formatted: string;
    refunded: boolean;
    refunded_at: string | null;
    subtotal: number;
    discount_total: number;
    tax: number;
    setup_fee: number;
    total: number;
    subtotal_usd: number;
    discount_total_usd: number;
    tax_usd: number;
    setup_fee_usd: number;
    total_usd: number;
    tax_inclusive: boolean;
    created_at: string;
    updated_at: string;
    test_mode: boolean;
  };
}

export interface LemonSqueezyWebhookPayload {
  meta: {
    event_name: string;
    webhook_id: string;
    custom_data?: Record<string, unknown>;
  };
  data: LemonSqueezyOrder | Record<string, unknown>; // Can be different types based on event
}

// Application Types for One-time Purchase
export interface CheckoutSession {
  checkoutUrl: string;
  checkoutId: string;
  expiresAt?: string;
}

export interface PaymentResult {
  success: boolean;
  checkoutUrl?: string;
  error?: string;
  checkoutId?: string;
}

export interface UserPurchase {
  userId: string;
  email: string;
  orderId: string;
  customerId?: string;
  status: "pending" | "active" | "refunded";
  purchasedAt: Date;
  amount: number;
  currency: string;
  productName: string;
  // For one-time purchase, access is permanent unless refunded
  hasLifetimeAccess: boolean;
}

export type WebhookEventType = "order_created" | "order_refunded";

// Simplified user access status
export type UserAccessLevel = "trial" | "premium";
