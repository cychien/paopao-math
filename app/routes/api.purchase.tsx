import { redirect, data } from "react-router";
import type { Route } from "./+types/api.purchase";
import { createCheckout } from "~/operations/create-checkout.server";
import { getAppVariantsBySlug } from "~/operations/get-app-variants";

// Default app slug for single-tenant mode
const DEFAULT_APP_SLUG = "paopao-math";

export const loader = async ({ request }: Route.LoaderArgs) => {
  // 獲取產品變體資訊
  const variantData = await getAppVariantsBySlug(DEFAULT_APP_SLUG);

  if (!variantData || !variantData.isPaymentActive || variantData.variants.length === 0) {
    return data({
      success: false,
      error: "目前尚未開放購買",
    }, { status: 400 });
  }

  // Get the first variant (for single product setup)
  const variant = variantData.variants[0];

  // Build the success redirect URL
  const url = new URL(request.url);
  const protocol =
    request.headers.get("x-forwarded-proto") || url.protocol.replace(":", "");
  const successUrl = `${protocol}://${url.host}/auth/login`;

  // 建立 Lemon Squeezy checkout
  const result = await createCheckout(
    DEFAULT_APP_SLUG,
    variant.id,
    successUrl
  );

  if (!result.success) {
    return data({
      success: false,
      error: result.error || "建立付款頁面失敗",
    }, { status: 500 });
  }

  // Redirect to checkout URL
  throw redirect(result.checkoutUrl);
};
