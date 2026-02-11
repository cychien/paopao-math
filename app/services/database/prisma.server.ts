import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

import {
  PrismaClient as PrismaMainClient,
  Prisma as PrismaMainNS,
} from "./.generated/prisma/client.js";

declare global {
  var __prisma: PrismaMainClient | undefined;
}

function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  return value;
}

const mainPool = new pg.Pool({
  connectionString: getEnv("DATABASE_URL"),
  max: 5,
  idleTimeoutMillis: 300_000,
  connectionTimeoutMillis: 10_000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10_000,
});

const mainAdapter = new PrismaPg(mainPool);

const dev = process.env.NODE_ENV !== "production";
const mainOpts: PrismaMainNS.PrismaClientOptions = dev
  ? { log: ["query"] }
  : {};

export const prisma =
  globalThis.__prisma ??
  new PrismaMainClient({
    ...mainOpts,
    adapter: mainAdapter,
  });

if (dev) {
  globalThis.__prisma = prisma;
}

// preconnect, avoid first request latency
if (!dev) {
  void prisma.$connect();
}

process.on("beforeExit", async () => {
  await Promise.allSettled([
    prisma.$disconnect(),
    mainPool.end(),
  ]);
});

export * from "./.generated/prisma/client";
export { PrismaMainNS as PrismaTypes };
export default prisma;
