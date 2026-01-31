import { LRUCache } from "lru-cache";
import { prisma } from "~/services/database/prisma.server";

/**
 * Cross-request LRU cache for app configuration data.
 * This cache persists across requests and function invocations.
 * 
 * Best for:
 * - Data that rarely changes (app config, settings)
 * - Expensive queries used frequently
 * - Data that can be slightly stale (5 min TTL)
 */

interface AppConfig {
  id: string;
  slug: string;
  isFree: boolean;
}

// Cache configuration with 5 minute TTL
const appConfigCache = new LRUCache<string, AppConfig>({
  max: 100, // Maximum 100 apps in cache
  ttl: 5 * 60 * 1000, // 5 minutes
  allowStale: false,
});

/**
 * Get app config with cross-request caching.
 * First request: queries DB and caches result
 * Subsequent requests within 5 min: returns cached value
 */
export async function getCachedAppConfig(slug: string): Promise<AppConfig | null> {
  // Check cache first
  const cached = appConfigCache.get(slug);
  if (cached) {
    return cached;
  }

  // Cache miss - query database
  const app = await prisma.app.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      isFree: true,
    },
  });

  if (!app) {
    return null;
  }

  // Store in cache for future requests
  appConfigCache.set(slug, app);
  return app;
}

/**
 * Invalidate app config cache for a specific slug.
 * Call this when app config is updated.
 */
export function invalidateAppConfig(slug: string): void {
  appConfigCache.delete(slug);
}

/**
 * Clear entire app config cache.
 * Useful for deployments or maintenance.
 */
export function clearAppConfigCache(): void {
  appConfigCache.clear();
}
