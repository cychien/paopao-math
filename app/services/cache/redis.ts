// Redis 快取服務
// 使用 Fly Redis 和 ioredis 客戶端

import Redis from "ioredis";

type CacheValue = string | number | boolean | object | null;

interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: CacheValue, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;
  clear(): Promise<void>;
}

// 記憶體快取實現（適合小型應用）
class MemoryCache implements CacheService {
  private cache = new Map<string, { value: CacheValue; expiry: number }>();

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value as T;
  }

  async set(key: string, value: CacheValue, ttl: number = 300): Promise<void> {
    const expiry = Date.now() + ttl * 1000;
    this.cache.set(key, { value, expiry });
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  // 清理過期項目
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

// Redis 快取實現（適合生產環境）
class RedisCache implements CacheService {
  private redis: Redis | null = null;

  constructor() {
    if (process.env.REDIS_URL) {
      try {
        this.redis = new Redis(`${process.env.REDIS_URL}?family=6`, {
          maxRetriesPerRequest: 3,
          lazyConnect: true,
        });

        this.redis.on("connect", () => {
          console.log("🚀 Redis connected successfully");
        });

        this.redis.on("error", (error) => {
          console.error("❌ Redis connection error:", error);
        });

        this.redis.on("ready", () => {
          console.log("✅ Redis ready to use");
        });
      } catch (error) {
        console.error("Failed to initialize Redis:", error);
        this.redis = null;
      }
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.redis) return null;
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error("Redis get error:", error);
      return null;
    }
  }

  async set(key: string, value: CacheValue, ttl: number = 300): Promise<void> {
    if (!this.redis) return;
    try {
      await this.redis.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error("Redis set error:", error);
    }
  }

  async del(key: string): Promise<void> {
    if (!this.redis) return;
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error("Redis del error:", error);
    }
  }

  async clear(): Promise<void> {
    if (!this.redis) return;
    try {
      await this.redis.flushall();
    } catch (error) {
      console.error("Redis clear error:", error);
    }
  }

  // 健康檢查
  async healthCheck(): Promise<boolean> {
    if (!this.redis) return false;
    try {
      const result = await this.redis.ping();
      return result === "PONG";
    } catch (error) {
      console.error("Redis health check failed:", error);
      return false;
    }
  }

  // 獲取連接資訊
  getConnectionInfo() {
    if (!this.redis) return null;
    return {
      status: this.redis.status,
      connectedAt: new Date().toISOString(),
    };
  }

  // 優雅關閉
  async disconnect() {
    if (this.redis) {
      await this.redis.quit();
    }
  }
}

// 選擇快取實現
const cache: CacheService = process.env.REDIS_URL
  ? new RedisCache()
  : new MemoryCache();

// 如果是記憶體快取，定期清理過期項目
if (cache instanceof MemoryCache) {
  setInterval(() => {
    cache.cleanup();
  }, 60000); // 每分鐘清理一次
}

export { cache };

// 快取包裝器函數
export async function withCache<T>(
  key: string,
  fn: () => Promise<T>,
  ttl: number = 300
): Promise<T> {
  // 嘗試從快取取得
  const cached = await cache.get<T>(key);
  if (cached !== null) {
    // console.log(`🎯 Cache hit: ${key}`);
    return cached;
  }

  // console.log(`🔍 Cache miss: ${key}`);

  // 執行原函數
  const result = await fn();

  // 儲存到快取
  await cache.set(key, result as unknown as CacheValue, ttl);

  return result;
}

// 快取鍵生成工具
export const cacheKeys = {
  user: (email: string) => `user:${email}`,
  userWithPurchases: (email: string) => `user_purchases:${email}`,
  userAccess: (email: string) => `user_access:${email}`,
  purchaseStats: () => "purchase_stats",
} as const;

// 快取統計和管理工具
export const cacheManager = {
  // 清除所有使用者相關快取
  async clearUserCache(email: string) {
    await Promise.all([
      cache.del(cacheKeys.user(email)),
      cache.del(cacheKeys.userWithPurchases(email)),
      cache.del(cacheKeys.userAccess(email)),
    ]);
  },

  // 健康檢查
  async healthCheck() {
    if (cache instanceof RedisCache) {
      return await cache.healthCheck();
    }
    return true; // 記憶體快取總是健康的
  },

  // 獲取連接資訊
  getConnectionInfo() {
    if (cache instanceof RedisCache) {
      return cache.getConnectionInfo();
    }
    return { status: "memory", type: "in-memory" };
  },

  // 關閉連接
  async disconnect() {
    if (cache instanceof RedisCache) {
      await cache.disconnect();
    }
  },
};
