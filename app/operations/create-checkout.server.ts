import { prisma } from "~/services/database/prisma.server";

const LEMON_SQUEEZY_API_BASE = "https://api.lemonsqueezy.com/v1";

type PaymentConfig = {
  apiKey: string;
  storeId?: string;
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
  | { success: true; checkoutUrl: string }
  | { success: false; error: string };

export async function createCheckout(
  appSlug: string,
  variantId: string, // Our internal variant ID
  redirectUrl: string, // URL to redirect after successful checkout
): Promise<CreateCheckoutResult> {
  // Get app and payment integration
  const app = await prisma.app.findUnique({
    where: { slug: appSlug },
    select: {
      id: true,
      paymentIntegration: {
        select: {
          isActive: true,
          config: true,
          variants: {
            where: { id: variantId },
            select: {
              variantId: true, // Lemon Squeezy variant ID
            },
          },
        },
      },
    },
  });

  if (!app?.paymentIntegration?.isActive) {
    return { success: false, error: "Payment integration is not active" };
  }

  const config = app.paymentIntegration.config as PaymentConfig | null;
  if (!config?.apiKey || !config?.storeId) {
    return { success: false, error: "Payment configuration is incomplete" };
  }

  const variant = app.paymentIntegration.variants[0];
  if (!variant) {
    return { success: false, error: "Variant not found" };
  }

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
                app_id: app.id,
                app_slug: appSlug,
                variant_id: variantId,
              },
            },
            product_options: {
              redirect_url: redirectUrl,
              enabled_variants: [variant.variantId],
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
                id: variant.variantId,
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
    return { success: true, checkoutUrl: data.data.attributes.url };
  } catch (error) {
    console.error("Error creating checkout:", error);
    return { success: false, error: "Failed to create checkout" };
  }
}
