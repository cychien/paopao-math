// 效能監控工具

export interface QueryMetrics {
  query: string;
  duration: number;
  timestamp: Date;
  success: boolean;
  error?: string;
}

class PerformanceMonitor {
  private metrics: QueryMetrics[] = [];
  private maxMetrics = 1000; // 最多保留 1000 筆記錄

  async measureQuery<T>(
    queryName: string,
    queryFn: () => Promise<T>
  ): Promise<T> {
    const startTime = performance.now();
    const timestamp = new Date();

    try {
      const result = await queryFn();
      const duration = performance.now() - startTime;

      this.addMetric({
        query: queryName,
        duration,
        timestamp,
        success: true,
      });

      // 如果查詢超過 1 秒，記錄警告
      if (duration > 1000) {
        console.warn(
          `🐌 Slow query detected: ${queryName} took ${duration.toFixed(2)}ms`
        );
      }

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;

      this.addMetric({
        query: queryName,
        duration,
        timestamp,
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });

      console.error(
        `❌ Query failed: ${queryName} (${duration.toFixed(2)}ms)`,
        error
      );
      throw error;
    }
  }

  private addMetric(metric: QueryMetrics) {
    this.metrics.push(metric);

    // 保持固定大小
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }
  }

  getMetrics(): QueryMetrics[] {
    return [...this.metrics];
  }

  getSlowQueries(threshold: number = 1000): QueryMetrics[] {
    return this.metrics.filter((m) => m.duration > threshold);
  }

  getAverageQueryTime(): number {
    if (this.metrics.length === 0) return 0;
    const total = this.metrics.reduce((sum, m) => sum + m.duration, 0);
    return total / this.metrics.length;
  }

  getStats() {
    const totalQueries = this.metrics.length;
    const successfulQueries = this.metrics.filter((m) => m.success).length;
    const failedQueries = totalQueries - successfulQueries;
    const averageTime = this.getAverageQueryTime();
    const slowQueries = this.getSlowQueries().length;

    return {
      totalQueries,
      successfulQueries,
      failedQueries,
      averageTime: Number(averageTime.toFixed(2)),
      slowQueries,
      successRate: Number(
        ((successfulQueries / totalQueries) * 100).toFixed(2)
      ),
    };
  }

  clearMetrics() {
    this.metrics = [];
  }
}

// 全域實例
export const performanceMonitor = new PerformanceMonitor();

// 便利函數
export async function measureDbQuery<T>(
  queryName: string,
  queryFn: () => Promise<T>
): Promise<T> {
  return performanceMonitor.measureQuery(queryName, queryFn);
}
