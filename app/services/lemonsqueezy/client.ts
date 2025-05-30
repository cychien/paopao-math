import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";

// Initialize Lemon Squeezy client
export function initializeLemonSqueezy() {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;

  if (!apiKey) {
    throw new Error("LEMONSQUEEZY_API_KEY is required");
  }

  lemonSqueezySetup({
    apiKey,
    onError: (error) => {
      console.error("Lemon Squeezy API Error:", error);
      throw error;
    },
  });
}

// Environment configuration
export const LEMON_SQUEEZY_CONFIG = {
  apiKey: process.env.LEMONSQUEEZY_API_KEY!,
  storeId: process.env.LEMONSQUEEZY_STORE_ID!,
  productId: process.env.LEMONSQUEEZY_PRODUCT_ID!,
  variantId: process.env.LEMONSQUEEZY_VARIANT_ID!,
  webhookSecret: process.env.LEMONSQUEEZY_WEBHOOK_SECRET!,
  environment: process.env.LEMONSQUEEZY_ENV || "development",
  appUrl: process.env.APP_URL || "http://localhost:5173",
} as const;

// Validation function to ensure all required environment variables are present
export function validateLemonSqueezyConfig() {
  const requiredVars = [
    "LEMONSQUEEZY_API_KEY",
    "LEMONSQUEEZY_STORE_ID",
    "LEMONSQUEEZY_PRODUCT_ID",
    "LEMONSQUEEZY_VARIANT_ID",
  ];

  // console.log("Checking environment variables:");
  // requiredVars.forEach((varName) => {
  //   const value = process.env[varName];
  //   console.log(
  //     `${varName}: ${value ? `${value.substring(0, 10)}...` : "MISSING"}`
  //   );
  // });

  const missing = requiredVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  // Also validate the values are strings
  if (
    typeof LEMON_SQUEEZY_CONFIG.storeId !== "string" ||
    !LEMON_SQUEEZY_CONFIG.storeId
  ) {
    throw new Error("LEMONSQUEEZY_STORE_ID must be a non-empty string");
  }

  if (
    typeof LEMON_SQUEEZY_CONFIG.variantId !== "string" ||
    !LEMON_SQUEEZY_CONFIG.variantId
  ) {
    throw new Error("LEMONSQUEEZY_VARIANT_ID must be a non-empty string");
  }

  console.log("All environment variables validated successfully");
}

// Initialize client on module load
try {
  validateLemonSqueezyConfig();
  initializeLemonSqueezy();
} catch (error) {
  console.error("Failed to initialize Lemon Squeezy:", error);
}
