import { prisma } from "~/services/database/prisma.server";

const LEMON_SQUEEZY_API_BASE = "https://api.lemonsqueezy.com/v1";

type LemonSqueezyVariant = {
  type: "variants";
  id: string;
  attributes: {
    product_id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    is_subscription: boolean;
    interval: string | null;
    interval_count: number | null;
    has_free_trial: boolean;
    trial_interval: string | null;
    trial_interval_count: number | null;
    sort: number;
    created_at: string;
    updated_at: string;
  };
};

type LemonSqueezyStore = {
  type: "stores";
  id: string;
  attributes: {
    name: string;
    currency: string;
  };
};

type LemonSqueezyApiResponse<T> = {
  data: T;
};

type PaymentConfig = {
  apiKey: string;
  storeId?: string;
};

async function fetchLemonSqueezyVariant(
  apiKey: string,
  variantId: string,
): Promise<LemonSqueezyVariant | null> {
  try {
    const response = await fetch(
      `${LEMON_SQUEEZY_API_BASE}/variants/${variantId}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
        },
      },
    );

    if (!response.ok) {
      console.error(`Failed to fetch variant ${variantId}: ${response.status}`);
      return null;
    }

    const data =
      (await response.json()) as LemonSqueezyApiResponse<LemonSqueezyVariant>;
    return data.data;
  } catch (error) {
    console.error(`Error fetching variant ${variantId}:`, error);
    return null;
  }
}

async function fetchLemonSqueezyStore(
  apiKey: string,
  storeId: string,
): Promise<LemonSqueezyStore | null> {
  try {
    const response = await fetch(
      `${LEMON_SQUEEZY_API_BASE}/stores/${storeId}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
        },
      },
    );

    if (!response.ok) {
      console.error(`Failed to fetch store ${storeId}: ${response.status}`);
      return null;
    }

    const data =
      (await response.json()) as LemonSqueezyApiResponse<LemonSqueezyStore>;
    return data.data;
  } catch (error) {
    console.error(`Error fetching store ${storeId}:`, error);
    return null;
  }
}

export type VariantWithPrice = {
  id: string;
  variantId: string; // Lemon Squeezy variant ID for checkout
  name: string;
  description: string | null;
  price: number;
  currency: string;
  isSubscription: boolean;
  interval: string | null;
  intervalCount: number | null;
};

export async function getAppVariantsBySlug(slug: string) {
  const app = await prisma.app.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      paymentIntegration: {
        select: {
          isActive: true,
          provider: true,
          config: true,
          variants: {
            select: {
              id: true,
              productId: true,
              variantId: true,
              name: true,
              description: true,
            },
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
  });

  if (!app) return null;

  const paymentIntegration = app.paymentIntegration;

  // Only return variants if payment integration is active
  if (!paymentIntegration?.isActive) {
    return {
      appId: app.id,
      appName: app.name,
      variants: [] as VariantWithPrice[],
      isPaymentActive: false,
    };
  }

  const config = paymentIntegration.config as PaymentConfig | null;

  if (!config?.apiKey) {
    return {
      appId: app.id,
      appName: app.name,
      variants: [] as VariantWithPrice[],
      isPaymentActive: false,
    };
  }

  // Fetch store info to get currency
  let currency = "USD";
  if (config.storeId) {
    const store = await fetchLemonSqueezyStore(config.apiKey, config.storeId);
    if (store) {
      currency = store.attributes.currency;
    }
  }

  // Fetch variant details from Lemon Squeezy (price info)
  const variantsWithPrice: VariantWithPrice[] = await Promise.all(
    paymentIntegration.variants.map(async (variant) => {
      const lsVariant = await fetchLemonSqueezyVariant(
        config.apiKey,
        variant.variantId,
      );

      return {
        id: variant.id,
        variantId: variant.variantId,
        name: variant.name,
        description: variant.description,
        price: lsVariant?.attributes.price ?? 0,
        currency,
        isSubscription: lsVariant?.attributes.is_subscription ?? false,
        interval: lsVariant?.attributes.interval ?? null,
        intervalCount: lsVariant?.attributes.interval_count ?? null,
      };
    }),
  );

  return {
    appId: app.id,
    appName: app.name,
    variants: variantsWithPrice,
    isPaymentActive: true,
    provider: paymentIntegration.provider,
  };
}
