import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

import {
  PrismaClient as PrismaMainClient,
  Prisma as PrismaMainNS,
} from "./.generated/prisma/client.js";
import {
  PrismaClient as PrismaLegacyClient,
  Prisma as PrismaLegacyNS,
} from "./.generated/prisma-legacy/client.js";

declare global {
  var __prisma: PrismaMainClient | undefined;
  var __prismaLegacy: PrismaLegacyClient | undefined;
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

const legacyPool = new pg.Pool({
  connectionString: getEnv("LEGACY_PAOPAO_DATABASE_URL"),
  max: 5,
  idleTimeoutMillis: 300_000,
  connectionTimeoutMillis: 10_000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10_000,
});

const mainAdapter = new PrismaPg(mainPool);
const legacyAdapter = new PrismaPg(legacyPool);

const dev = process.env.NODE_ENV !== "production";
const mainOpts: PrismaMainNS.PrismaClientOptions = dev
  ? { log: ["query"] }
  : {};
const legacyOpts: PrismaLegacyNS.PrismaClientOptions = dev
  ? { log: ["query"] }
  : {};

export const prisma =
  globalThis.__prisma ??
  new PrismaMainClient({
    ...mainOpts,
    adapter: mainAdapter,
  });

export const prismaLegacy =
  globalThis.__prismaLegacy ??
  new PrismaLegacyClient({
    ...legacyOpts,
    adapter: legacyAdapter,
  });

if (dev) {
  globalThis.__prisma = prisma;
  globalThis.__prismaLegacy = prismaLegacy;
}

// preconnect, avoid first request latency
if (!dev) {
  void prisma.$connect();
  void prismaLegacy.$connect();
}

process.on("beforeExit", async () => {
  await Promise.allSettled([
    prisma.$disconnect(),
    prismaLegacy.$disconnect(),
    mainPool.end(),
    legacyPool.end(),
  ]);
});

export * from "./.generated/prisma/client";
export { PrismaMainNS as PrismaTypes };
export { PrismaLegacyNS as PrismaLegacyTypes };
export default prisma;
