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
    console.log("Creating checkout with config:", {
      storeId: LEMON_SQUEEZY_CONFIG.storeId,
      variantId: LEMON_SQUEEZY_CONFIG.variantId,
      environment: LEMON_SQUEEZY_CONFIG.environment,
    });

    const response = await createCheckout(
      LEMON_SQUEEZY_CONFIG.storeId,
      LEMON_SQUEEZY_CONFIG.variantId,
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
          email: options.email || undefined,
          name: options.name || undefined,
          custom: options.customData
            ? {
                purchase_source: "website",
                timestamp: String(Date.now()),
                ...Object.fromEntries(
                  Object.entries(options.customData).map(([key, value]) => [
                    key,
                    typeof value === "string" ? value : String(value),
                  ])
                ),
              }
            : {
                purchase_source: "website",
                timestamp: String(Date.now()),
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
      attributes?: { url?: string; checkout_url?: string };
      url?: string;
      id?: string;
      data?: {
        attributes?: { url?: string };
        id?: string;
      };
    };

    // Try different possible paths for the checkout URL
    let checkoutUrl: string | undefined;

    if (checkoutData.attributes?.url) {
      checkoutUrl = checkoutData.attributes.url;
    } else if (checkoutData.url) {
      checkoutUrl = checkoutData.url;
    } else if (checkoutData.data?.attributes?.url) {
      checkoutUrl = checkoutData.data.attributes.url;
    } else if (checkoutData.attributes?.checkout_url) {
      checkoutUrl = checkoutData.attributes.checkout_url;
    }

    const checkoutId = checkoutData.id || checkoutData.data?.id;

    console.log("Extracted checkout URL:", checkoutUrl);
    console.log("Extracted checkout ID:", checkoutId);

    if (!checkoutUrl) {
      console.error("Could not find checkout URL in response:", response.data);
      return {
        success: false,
        error: "Checkout URL not found in response",
      };
    }

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
      "完整總複習課程",
      "實體學習參考書",
      "定期模擬測驗",
      "歷屆大考試題及講解",
      "問答專區解惑",
      "超過 200 部詳解影片",
    ],
  };
}
