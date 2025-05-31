import { json } from "@remix-run/node";
import { cacheManager } from "~/services/cache/redis";
import { performanceMonitor } from "~/utils/performance";

export const loader = async () => {
  try {
    // 檢查快取健康狀態
    const isHealthy = await cacheManager.healthCheck();
    const connectionInfo = cacheManager.getConnectionInfo();
    const performanceStats = performanceMonitor.getStats();

    return json({
      cache: {
        healthy: isHealthy,
        connection: connectionInfo,
        type: process.env.REDIS_URL ? "redis" : "memory",
      },
      performance: performanceStats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return json(
      {
        cache: {
          healthy: false,
          error: error instanceof Error ? error.message : "Unknown error",
          type: process.env.REDIS_URL ? "redis" : "memory",
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
};
