import { createCheckout } from "@lemonsqueezy/lemonsqueezy.js";
import { LEMON_SQUEEZY_CONFIG } from "./client";
import type { PaymentResult } from "./types";

/**
 * Create a checkout session for the PaoPao Math Course
 */
export async function createCheckoutSession(options: {
  email?: string;
  name?: string;
  customData?: Record<string, unknown>;
}): Promise<PaymentResult> {
  try {
    const response = await createCheckout(
      parseInt(LEMON_SQUEEZY_CONFIG.storeId),
      parseInt(LEMON_SQUEEZY_CONFIG.variantId),
      {
        checkoutOptions: {
          embed: false,
          media: true,
          logo: true,
          desc: true,
          discount: true,
          buttonColor: "#7C3AED", // Brand purple color
        },
        checkoutData: {
          email: options.email,
          name: options.name,
          custom: {
            purchase_source: "website",
            ...options.customData,
          },
        },
        testMode: LEMON_SQUEEZY_CONFIG.environment === "development",
      }
    );

    if (response.error) {
      console.error("Checkout creation error:", response.error);
      return {
        success: false,
        error: "Failed to create checkout session",
      };
    }

    if (!response.data) {
      return {
        success: false,
        error: "No checkout data returned",
      };
    }

    // Handle response data based on actual API response structure
    const checkoutData = response.data as unknown as {
      attributes?: { url: string };
      url?: string;
      id: string;
    };
    const checkoutUrl = checkoutData.attributes?.url || checkoutData.url;
    const checkoutId = checkoutData.id;

    return {
      success: true,
      checkoutUrl,
      checkoutId,
    };
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Create a quick checkout session for the pricing card button
 */
export async function createQuickCheckout(
  email?: string
): Promise<PaymentResult> {
  return createCheckoutSession({
    email,
    customData: {
      source: "pricing_card",
      timestamp: Date.now(),
    },
  });
}

/**
 * Get product information (for display purposes)
 */
export function getProductInfo() {
  return {
    name: "學測總複習班",
    price: 4995,
    originalPrice: 7999,
    currency: "TWD",
    description: "年費買斷，全年暢學與持續更新",
    features: [
      "實體學習參考書",
      "獨家重點整理及例題",
      "200+ 精講影片",
      "模擬測驗及精選試題",
      "歷屆大考試題及講解",
      "多裝置支援",
    ],
  };
}
