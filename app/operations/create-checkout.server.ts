import { prisma } from "~/services/database/prisma.server";
import {
  createPayUniUppFormData,
  generateMerTradeNo,
  resolvePayUniConfig,
  type PayUniConfig,
} from "~/services/payuni";

const LEMON_SQUEEZY_API_BASE = "https://api.lemonsqueezy.com/v1";

type LemonSqueezyConfig = {
  apiKey: string;
  storeId?: string;
};

type PayUniVariantOverride = {
  tradeAmt?: number;
  prodDesc?: string;
  tradeDesc?: string;
};

type PayUniCheckoutConfig = PayUniConfig & {
  tradeAmt?: number;
  variantAmounts?: Record<string, number>;
  prodDesc?: string;
  tradeDesc?: string;
  variantConfigs?: Record<string, PayUniVariantOverride>;
};

type LemonSqueezyCheckout = {
  type: "checkouts";
  id: string;
  attributes: {
    store_id: number;
    variant_id: number;
    custom_price: number | null;
    product_options: Record<string, any>;
    checkout_options: Record<string, any>;
    checkout_data: Record<string, any>;
    preview: Record<string, any>;
    expires_at: string | null;
    created_at: string;
    updated_at: string;
    test_mode: boolean;
    url: string;
  };
};

type CreateCheckoutResponse = {
  data: LemonSqueezyCheckout;
};

export type CreateCheckoutResult =
  | { success: true; type: "redirect"; checkoutUrl: string }
  | {
      success: true;
      type: "form";
      formAction: string;
      formFields: Record<string, string>;
    }
  | { success: false; error: string };

export async function createCheckout(
  appSlug: string,
  variantId: string, // Our internal variant ID
  redirectUrl: string, // URL to redirect after successful checkout
  notifyUrl?: string, // URL for server-to-server payment notifications
  customerEmail?: string,
  backUrl?: string, // URL for "back to merchant" button on PayUni pages
): Promise<CreateCheckoutResult> {
  // Get app and payment integration
  const app = await prisma.app.findUnique({
    where: { slug: appSlug },
    select: {
      id: true,
      paymentIntegration: {
        select: {
          provider: true,
          isActive: true,
          config: true,
          variants: {
            where: { id: variantId },
            select: {
              id: true,
              productId: true,
              variantId: true, // Lemon Squeezy variant ID
              name: true,
              description: true,
            },
          },
        },
      },
    },
  });

  if (!app?.paymentIntegration?.isActive) {
    return { success: false, error: "Payment integration is not active" };
  }

  const variant = app.paymentIntegration.variants[0];
  if (!variant) {
    return { success: false, error: "Variant not found" };
  }

  const provider = app.paymentIntegration.provider;

  if (provider === "LEMON_SQUEEZY") {
    const config = app.paymentIntegration.config as LemonSqueezyConfig | null;
    if (!config?.apiKey || !config?.storeId) {
      return { success: false, error: "Payment configuration is incomplete" };
    }

    return createLemonSqueezyCheckout({
      appId: app.id,
      appSlug,
      variantId,
      lsVariantId: variant.variantId,
      redirectUrl,
      config,
    });
  }

  if (provider === "PAYUNI") {
    const rawConfig = app.paymentIntegration.config as PayUniCheckoutConfig;
    const config = resolvePayUniConfig(rawConfig);

    if (!config) {
      return {
        success: false,
        error:
          "PayUni payment configuration is incomplete. Please set PAYUNI_HASH_KEY/PAYUNI_HASH_IV (and PAYUNI_MER_ID or config.merId).",
      };
    }

    const tradeAmt = resolvePayUniAmount(rawConfig, variant.id, variant.productId);
    if (!tradeAmt || tradeAmt <= 0) {
      return {
        success: false,
        error:
          "PayUni amount is not configured. Please set config.tradeAmt or config.variantAmounts",
      };
    }

    const descriptions = resolvePayUniDescriptions(rawConfig, variant.id);

    const merTradeNo = generateMerTradeNo();
    const callbackUrl = notifyUrl ?? redirectUrl;
    const payload = {
      MerID: config.merId,
      MerTradeNo: merTradeNo,
      TradeAmt: tradeAmt,
      Timestamp: Math.floor(Date.now() / 1000),
      ReturnURL: redirectUrl,
      NotifyURL: callbackUrl,
      BackURL: backUrl ?? redirectUrl,
      ...(customerEmail ? { UsrMail: customerEmail, UsrMailFix: 1 } : {}),
      ProdDesc: descriptions.prodDesc,
      TradeDesc: descriptions.tradeDesc,
    };
    console.info("[PayUni checkout] payload summary", {
      merTradeNo,
      version: config.version ?? "2.0",
      hasUsrMail: Boolean(customerEmail),
      backUrl: payload.BackURL,
      returnUrl: payload.ReturnURL,
      notifyUrl: payload.NotifyURL,
    });

    const form = createPayUniUppFormData(payload, config);

    await prisma.payUniOrder.create({
      data: {
        merTradeNo,
        appId: app.id,
        variantId: variant.id,
        email: customerEmail ?? null,
        status: "PENDING",
        rawResult: {
          provider: "PAYUNI",
          payload,
        },
      },
    });

    return {
      success: true,
      type: "form",
      formAction: form.action,
      formFields: form.fields,
    };
  }

  return { success: false, error: `Unsupported payment provider: ${provider}` };
}

function resolvePayUniAmount(
  config: PayUniCheckoutConfig,
  variantId: string,
  productId: string,
) {
  const variantOverrideAmount = config.variantConfigs?.[variantId]?.tradeAmt;
  if (typeof variantOverrideAmount === "number") {
    return variantOverrideAmount;
  }

  if (config.variantAmounts && typeof config.variantAmounts[variantId] === "number") {
    return config.variantAmounts[variantId];
  }

  if (typeof config.tradeAmt === "number") {
    return config.tradeAmt;
  }

  const fallbackFromProductId = Number(productId);
  if (Number.isFinite(fallbackFromProductId) && fallbackFromProductId > 0) {
    return fallbackFromProductId;
  }

  return null;
}

function resolvePayUniDescriptions(config: PayUniCheckoutConfig, variantId: string) {
  const variantConfig = config.variantConfigs?.[variantId];
  const prodDesc = variantConfig?.prodDesc || config.prodDesc || "線上課程";
  const tradeDesc = variantConfig?.tradeDesc || config.tradeDesc || prodDesc;
  return { prodDesc, tradeDesc };
}

async function createLemonSqueezyCheckout(params: {
  appId: string;
  appSlug: string;
  variantId: string;
  lsVariantId: string;
  redirectUrl: string;
  config: LemonSqueezyConfig;
}): Promise<CreateCheckoutResult> {
  const { appId, appSlug, variantId, lsVariantId, redirectUrl, config } = params;

  try {
    const response = await fetch(`${LEMON_SQUEEZY_API_BASE}/checkouts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            checkout_options: {
              embed: false,
              media: true,
              button_color: "#2563EB",
            },
            checkout_data: {
              custom: {
                app_id: appId,
                app_slug: appSlug,
                variant_id: variantId,
              },
            },
            product_options: {
              redirect_url: redirectUrl,
              enabled_variants: [lsVariantId],
            },
          },
          relationships: {
            store: {
              data: {
                type: "stores",
                id: config.storeId,
              },
            },
            variant: {
              data: {
                type: "variants",
                id: lsVariantId,
              },
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lemon Squeezy checkout error:", errorText);
      return { success: false, error: "Failed to create checkout" };
    }

    const data = (await response.json()) as CreateCheckoutResponse;
    return {
      success: true,
      type: "redirect",
      checkoutUrl: data.data.attributes.url,
    };
  } catch (error) {
    console.error("Error creating checkout:", error);
    return { success: false, error: "Failed to create checkout" };
  }
}
