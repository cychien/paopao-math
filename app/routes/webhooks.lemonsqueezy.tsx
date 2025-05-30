import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import crypto from "crypto";
import {
  createOrGetUser,
  createPurchaseRecord,
  updatePurchaseStatus,
} from "~/services/database/users";

// Lemon Squeezy webhook events we care about
interface LemonSqueezyWebhookEvent {
  meta: {
    event_name: string;
    webhook_id: string;
    test_mode: boolean;
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
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    console.log("🔍 Webhook request received");

    // Get webhook secret from environment
    const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("Missing LEMONSQUEEZY_WEBHOOK_SECRET environment variable");
      return json({ error: "Server configuration error" }, { status: 500 });
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
      return json({ error: "Missing signature" }, { status: 400 });
    }

    // Verify webhook signature
    if (!verifyWebhookSignature(body, signature, webhookSecret)) {
      console.error("Invalid webhook signature");
      return json({ error: "Invalid signature" }, { status: 401 });
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
    return json({ success: true });
  } catch (error) {
    console.error("❌ Webhook processing failed:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
    });
    return json({ error: "Webhook processing failed" }, { status: 500 });
  }
};

/**
 * Handle order_created webhook event
 */
async function handleOrderCreated(event: LemonSqueezyWebhookEvent) {
  const { attributes } = event.data;

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
    // Create or get user
    const user = await createOrGetUser(
      attributes.user_email,
      attributes.user_name || undefined
    );

    // Create purchase record
    await createPurchaseRecord({
      userId: user.id,
      email: attributes.user_email,
      lemonSqueezyOrderId: attributes.identifier,
      orderNumber: attributes.order_number.toString(),
      amount: attributes.total,
      currency: attributes.currency,
      status: "ACTIVE",
      hasLifetimeAccess: true,
      testMode: attributes.test_mode,
      purchasedAt: new Date(attributes.created_at),
    });

    console.log(
      `✅ Successfully processed order for ${attributes.user_email}`,
      {
        order_number: attributes.order_number,
        amount: attributes.total_formatted,
        user_id: user.id,
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
  const { attributes } = event.data;

  try {
    console.log(`💰 Processing refund for order ${attributes.order_number}`, {
      email: attributes.user_email,
      amount: attributes.total_formatted,
      refunded_at: attributes.refunded_at,
    });

    // 更新購買記錄狀態為 REFUNDED 並撤銷終身訪問權限
    const updatedPurchase = await updatePurchaseStatus(
      attributes.identifier,
      "REFUNDED",
      false // 撤銷終身訪問權限
    );

    if (!updatedPurchase) {
      console.error(
        `❌ Purchase record not found for order ${attributes.order_number}`
      );
      return;
    }

    console.log(
      `✅ Successfully processed refund for ${attributes.user_email}`,
      {
        order_number: attributes.order_number,
        amount: attributes.total_formatted,
        access_revoked: true,
      }
    );

    // TODO: 發送退款確認郵件
    // await sendRefundConfirmationEmail(attributes.user_email, {
    //   orderNumber: attributes.order_number,
    //   amount: attributes.total_formatted,
    //   refundedAt: attributes.refunded_at,
    // });
  } catch (error) {
    console.error(
      `❌ Failed to process refund for order ${attributes.order_number}:`,
      error
    );
    throw error;
  }
}
