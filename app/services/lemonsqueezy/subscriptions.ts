import { checkUserPurchaseStatus } from "./orders";
import type { UserPurchase, UserAccessLevel } from "./types";

/**
 * Check if a user has active access to the course (based on purchase)
 */
export async function hasActiveAccess(email: string): Promise<boolean> {
  try {
    const result = await checkUserPurchaseStatus(email);
    return result.success && result.hasPurchased;
  } catch (error) {
    console.error("Error checking active access:", error);
    return false;
  }
}

/**
 * Get user purchase details
 */
export async function getUserPurchase(
  email: string
): Promise<UserPurchase | null> {
  try {
    const result = await checkUserPurchaseStatus(email);
    return result.purchase || null;
  } catch (error) {
    console.error("Error getting user purchase:", error);
    return null;
  }
}

/**
 * Check if user should have premium permissions (based on purchase)
 */
export async function shouldHavePremiumAccess(email: string): Promise<boolean> {
  if (!email) return false;

  return await hasActiveAccess(email);
}

/**
 * Get user access level based on purchase status
 */
export async function getUserAccessLevel(
  email?: string
): Promise<UserAccessLevel> {
  if (!email) return "trial";

  const hasAccess = await hasActiveAccess(email);
  return hasAccess ? "premium" : "trial";
}

/**
 * Check if user has lifetime access (for one-time purchase)
 */
export async function hasLifetimeAccess(email: string): Promise<boolean> {
  const purchase = await getUserPurchase(email);
  return purchase?.hasLifetimeAccess || false;
}
