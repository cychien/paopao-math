import { data } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import crypto from "crypto";
import { prisma } from "~/services/database/prisma.server";

// Lemon Squeezy webhook events we care about
interface LemonSqueezyWebhookEvent {
  meta: {
    event_name: string;
    webhook_id: string;
    test_mode: boolean;
    custom_data?: {
      app_id?: string;
      app_slug?: string;
      variant_id?: string;
    };
  };
  data: {
    type: string;
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
      subtotal: number;
      discount_total: number;
      tax: number;
      total: number;
      subtotal_usd: number;
      discount_total_usd: number;
      tax_usd: number;
      total_usd: number;
      tax_name: string | null;
      tax_rate: string;
      status: string;
      status_formatted: string;
      refunded: boolean;
      refunded_at: string | null;
      subtotal_formatted: string;
      discount_total_formatted: string;
      tax_formatted: string;
      total_formatted: string;
      created_at: string;
      updated_at: string;
      test_mode: boolean;
      first_order_item: {
        id: number;
        order_id: number;
        product_id: number;
        variant_id: number;
        product_name: string;
        variant_name: string;
        price: number;
        created_at: string;
        updated_at: string;
        test_mode: boolean;
      };
    };
  };
}

/**
 * Verify webhook signature
 */
function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(body, "utf8");
  const digest = hmac.digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature, "utf8"),
    Buffer.from(digest, "utf8")
  );
}

export const action = async ({ request }: ActionFunctionArgs) => {
  // Only accept POST requests
  if (request.method !== "POST") {
    return data({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    console.log("🔍 Webhook request received");

    // Get webhook secret from environment
    const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("Missing LEMONSQUEEZY_WEBHOOK_SECRET environment variable");
      return data({ error: "Server configuration error" }, { status: 500 });
    }

    console.log("✅ Webhook secret found");

    // Get request body and signature
    const body = await request.text();
    const signature = request.headers.get("x-signature");

    console.log("📨 Request details:", {
      bodyLength: body.length,
      hasSignature: !!signature,
      signature: signature?.substring(0, 20) + "...",
    });

    if (!signature) {
      console.error("Missing signature header");
      return data({ error: "Missing signature" }, { status: 400 });
    }

    // Verify webhook signature
    if (!verifyWebhookSignature(body, signature, webhookSecret)) {
      console.error("Invalid webhook signature");
      return data({ error: "Invalid signature" }, { status: 401 });
    }

    console.log("✅ Signature verified");

    // Parse webhook payload
    const event: LemonSqueezyWebhookEvent = JSON.parse(body);

    console.log(`🔔 Received webhook: ${event.meta.event_name}`, {
      event_name: event.meta.event_name,
      test_mode: event.meta.test_mode,
      order_id: event.data.id,
      email: event.data.attributes.user_email,
    });

    // Handle different event types
    switch (event.meta.event_name) {
      case "order_created":
        console.log("🔄 Processing order_created event");
        await handleOrderCreated(event);
        break;

      case "order_refunded":
        console.log("🔄 Processing order_refunded event");
        await handleOrderRefunded(event);
        break;

      default:
        console.log(`⚠️ Unhandled webhook event: ${event.meta.event_name}`);
    }

    console.log("✅ Webhook processed successfully");
    return data({ success: true });
  } catch (error) {
    console.error("❌ Webhook processing failed:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
    });
    return data({ error: "Webhook processing failed" }, { status: 500 });
  }
};

/**
 * Handle order_created webhook event
 */
async function handleOrderCreated(event: LemonSqueezyWebhookEvent) {
  const { attributes, id: lemonsqueezyOrderId } = event.data;

  // Only process paid orders
  if (attributes.status !== "paid") {
    console.log(
      `📝 Order ${attributes.order_number} not paid yet, status: ${attributes.status}`
    );
    return;
  }

  if (attributes.refunded) {
    console.log(`❌ Order ${attributes.order_number} is refunded, skipping`);
    return;
  }

  try {
    // Extract app info from custom data
    const customData = event.meta.custom_data;
    const appId = customData?.app_id;
    const appSlug = customData?.app_slug || "paopao-math"; // fallback to default
    const lsVariantId = customData?.variant_id || attributes.first_order_item?.variant_id?.toString();

    if (!lsVariantId) {
      console.error(`❌ Missing variant_id in webhook data`);
      return;
    }

    // Find the app
    const app = await prisma.app.findUnique({
      where: { slug: appSlug },
      select: { id: true },
    });

    if (!app) {
      console.error(`❌ App not found with slug: ${appSlug}`);
      return;
    }

    const finalAppId = appId || app.id;

    // Find the variant (must be pre-configured)
    const variant = await prisma.appVariant.findFirst({
      where: {
        appId: finalAppId,
        id: lsVariantId,
      },
    });

    if (!variant) {
      console.error(`❌ Variant not found: ${lsVariantId} for app: ${finalAppId}`);
      console.error(`Please configure the variant in the AppVariant table before processing orders`);
      return;
    }

    console.log(`✅ Found variant: ${variant.id} (${variant.name})`);

    // Check if customer already exists
    let customer = await prisma.appCustomer.findFirst({
      where: {
        appId: finalAppId,
        email: attributes.user_email,
        variantId: variant.id,
      },
    });

    if (!customer) {
      // Create new customer
      customer = await prisma.appCustomer.create({
        data: {
          appId: finalAppId,
          variantId: variant.id,
          email: attributes.user_email,
          name: attributes.user_name || null,
        },
      });
      console.log(`✅ Created new customer: ${customer.id}`);
    } else {
      console.log(`ℹ️ Customer already exists: ${customer.id}`);
    }

    // Check if LemonSqueezy customer record exists for this order
    const lsCustomer = await prisma.lemonSqueezyCustomer.findUnique({
      where: {
        lemonSqueezyOrderId: lemonsqueezyOrderId,
      },
    });

    if (!lsCustomer) {
      // Create LemonSqueezy customer record
      await prisma.lemonSqueezyCustomer.create({
        data: {
          customerId: customer.id,
          lemonSqueezyCustomerId: attributes.customer_id.toString(),
          lemonSqueezyOrderId: lemonsqueezyOrderId,
        },
      });
      console.log(
        `✅ Created LemonSqueezy customer record for order ${attributes.order_number}`
      );
    } else {
      console.log(`ℹ️ Order ${attributes.order_number} already processed`);
    }

    console.log(
      `✅ Successfully processed order for ${attributes.user_email}`,
      {
        order_number: attributes.order_number,
        amount: attributes.total_formatted,
        customer_id: customer.id,
        variant_id: variant.id,
      }
    );
  } catch (error) {
    console.error(
      `❌ Failed to process order ${attributes.order_number}:`,
      error
    );
    throw error;
  }
}

/**
 * Handle order_refunded webhook event
 */
async function handleOrderRefunded(event: LemonSqueezyWebhookEvent) {
  const { attributes, id: lemonsqueezyOrderId } = event.data;

  try {
    console.log(`💰 Processing refund for order ${attributes.order_number}`, {
      email: attributes.user_email,
      amount: attributes.total_formatted,
      refunded_at: attributes.refunded_at,
    });

    // Find the LemonSqueezy customer record for this order
    const lsCustomer = await prisma.lemonSqueezyCustomer.findUnique({
      where: { lemonSqueezyOrderId: lemonsqueezyOrderId },
      include: {
        customer: true,
      },
    });

    if (!lsCustomer) {
      console.error(
        `❌ Order record not found for ${attributes.order_number}`
      );
      return;
    }

    // Delete the LemonSqueezy customer record to revoke access
    await prisma.lemonSqueezyCustomer.delete({
      where: { lemonSqueezyOrderId: lemonsqueezyOrderId },
    });

    console.log(
      `✅ Successfully processed refund for ${attributes.user_email}`,
      {
        order_number: attributes.order_number,
        amount: attributes.total_formatted,
        customer_id: lsCustomer.customer.id,
      }
    );

    // Note: We delete the LemonSqueezy customer record to revoke access
    // The AppCustomer record is preserved for record-keeping
  } catch (error) {
    console.error(
      `❌ Failed to process refund for order ${attributes.order_number}:`,
      error
    );
    throw error;
  }
}
