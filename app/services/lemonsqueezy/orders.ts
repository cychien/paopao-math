import { getOrder, listOrders } from "@lemonsqueezy/lemonsqueezy.js";
import type { UserPurchase, LemonSqueezyOrder } from "./types";

/**
 * Get order details by ID
 */
export async function getOrderById(orderId: string) {
  try {
    const response = await getOrder(orderId);

    if (response.error) {
      console.error("Error fetching order:", response.error);
      return { success: false, error: response.error.message };
    }

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching order:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get orders for a specific customer by email
 */
export async function getOrdersByEmail(email: string) {
  try {
    const response = await listOrders();

    if (response.error) {
      console.error("Error fetching orders:", response.error);
      return { success: false, error: response.error.message };
    }

    // Filter orders by email since API doesn't support direct email filtering
    const allOrders = response.data || [];
    const userOrders = Array.isArray(allOrders)
      ? allOrders.filter(
          (order: LemonSqueezyOrder) => order.attributes.user_email === email
        )
      : [];

    return { success: true, data: userOrders };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Check if a user has purchased the course based on email
 */
export async function checkUserPurchaseStatus(email: string): Promise<{
  success: boolean;
  hasPurchased: boolean;
  purchase?: UserPurchase;
  error?: string;
}> {
  try {
    const ordersResult = await getOrdersByEmail(email);

    if (!ordersResult.success || !ordersResult.data) {
      return {
        success: true,
        hasPurchased: false,
      };
    }

    // Check for paid orders (active purchases)
    const paidOrders = ordersResult.data.filter(
      (order: LemonSqueezyOrder) => order.attributes.status === "paid"
    );

    if (paidOrders.length === 0) {
      return {
        success: true,
        hasPurchased: false,
      };
    }

    // Get the most recent paid order
    const latestOrder = paidOrders[0];

    const purchase: UserPurchase = {
      userId: email, // Using email as user ID for now
      email: email,
      orderId: latestOrder.id,
      customerId: latestOrder.attributes.customer_id?.toString(),
      status: "active",
      purchasedAt: new Date(latestOrder.attributes.created_at),
      amount: latestOrder.attributes.total,
      currency: latestOrder.attributes.currency,
      productName: "學測總複習班",
      hasLifetimeAccess: true, // One-time purchase = lifetime access
    };

    return {
      success: true,
      hasPurchased: true,
      purchase,
    };
  } catch (error) {
    console.error("Error checking purchase status:", error);
    return {
      success: false,
      hasPurchased: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Convert order data to UserPurchase format
 */
export function orderToPurchase(orderData: LemonSqueezyOrder): UserPurchase {
  return {
    userId: orderData.attributes.user_email,
    email: orderData.attributes.user_email,
    orderId: orderData.id,
    customerId: orderData.attributes.customer_id?.toString(),
    status:
      orderData.attributes.status === "paid"
        ? "active"
        : orderData.attributes.refunded
        ? "refunded"
        : "pending",
    purchasedAt: new Date(orderData.attributes.created_at),
    amount: orderData.attributes.total,
    currency: orderData.attributes.currency,
    productName: "學測總複習班",
    hasLifetimeAccess:
      orderData.attributes.status === "paid" && !orderData.attributes.refunded,
  };
}

/**
 * Check if a specific order grants course access
 */
export function doesOrderGrantAccess(order: LemonSqueezyOrder): boolean {
  return order.attributes.status === "paid" && !order.attributes.refunded;
}
