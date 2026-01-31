import { randomInt , createHash as createHashCrypto } from "node:crypto";
import { prisma } from "~/services/database/prisma.server";
import { cache } from "~/services/cache/redis";

const DEFAULT_APP_SLUG = "paopao-math";

// Rate limiting constants
const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION_MINUTES = 15;
const OTP_EXPIRY_MINUTES = 10;

/**
 * Create SHA-256 hash
 */
function createHash(input: string): string {
  return createHashCrypto("sha256").update(input).digest("base64url");
}

/**
 * Generate a cryptographically secure 6-digit OTP
 */
export function generateOTP(): string {
  // Generate a random number between 0 and 999999
  const otp = randomInt(0, 1000000);
  // Pad with leading zeros to ensure 6 digits
  return otp.toString().padStart(6, "0");
}

/**
 * Get rate limit cache key
 */
function getRateLimitKey(email: string, ipAddress: string): string {
  return `otp_attempts:${email}:${ipAddress}`;
}

/**
 * Check if email/IP is rate limited
 */
export async function checkRateLimit(
  email: string,
  ipAddress: string
): Promise<{ allowed: boolean; remainingAttempts?: number; lockedUntil?: Date }> {
  const cacheKey = getRateLimitKey(email, ipAddress);
  const attempts = (await cache.get<number>(cacheKey)) || 0;

  if (attempts >= MAX_ATTEMPTS) {
    // Calculate lockout end time
    const lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000);
    return {
      allowed: false,
      lockedUntil,
    };
  }

  return {
    allowed: true,
    remainingAttempts: MAX_ATTEMPTS - attempts,
  };
}

/**
 * Increment rate limit counter
 */
async function incrementRateLimit(email: string, ipAddress: string): Promise<void> {
  const cacheKey = getRateLimitKey(email, ipAddress);
  const attempts = (await cache.get<number>(cacheKey)) || 0;
  await cache.set(cacheKey, attempts + 1, LOCKOUT_DURATION_MINUTES * 60);
}

/**
 * Reset rate limit counter
 */
async function resetRateLimit(email: string, ipAddress: string): Promise<void> {
  const cacheKey = getRateLimitKey(email, ipAddress);
  await cache.del(cacheKey);
}

/**
 * Create OTP challenge for email login
 */
export async function createOTPChallenge(
  email: string,
  ipAddress: string = "unknown"
): Promise<{ challengeId: string; otp: string; expiresAt: Date }> {
  // Check rate limit before creating challenge
  const rateLimit = await checkRateLimit(email, ipAddress);
  if (!rateLimit.allowed) {
    throw new Error(
      `太多嘗試次數，請在 ${LOCKOUT_DURATION_MINUTES} 分鐘後再試`
    );
  }

  // Get the app
  const app = await prisma.app.findUnique({
    where: { slug: DEFAULT_APP_SLUG },
    select: { id: true },
  });

  if (!app) {
    throw new Error("App not found");
  }

  // Verify email exists in AppCustomer
  const customer = await prisma.appCustomer.findFirst({
    where: {
      appId: app.id,
      email: email,
    },
  });

  if (!customer) {
    throw new Error("此信箱尚未購買課程，請先完成購買才能登入");
  }

  // Generate OTP and hash it
  const otp = generateOTP();
  const otpHash = createHash(otp);

  // Create a dummy token hash for backwards compatibility
  // Use a safe range for randomInt (max is 281474976710655 or 2^48-1)
  const dummyToken = randomInt(0, 1000000000000).toString();
  const tokenHash = createHash(dummyToken);

  // Calculate expiry time
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  // Delete any existing pending challenges for this email
  await prisma.emailChallenge.deleteMany({
    where: {
      email,
      appId: app.id,
      status: "PENDING",
    },
  });

  // Create challenge with OTP
  const challenge = await prisma.emailChallenge.create({
    data: {
      email,
      tokenHash,
      otp: otpHash,
      appId: app.id,
      expiresAt,
      attempts: 0,
    },
  });

  console.log(`🔐 OTP generated for ${email}: ${otp} (expires in ${OTP_EXPIRY_MINUTES} minutes)`);

  return {
    challengeId: challenge.id,
    otp, // Return plain OTP for sending via email
    expiresAt,
  };
}

/**
 * Verify OTP code with rate limiting
 */
export async function verifyOTP(
  challengeId: string,
  otp: string,
  ipAddress: string = "unknown"
): Promise<{
  success: boolean;
  error?: string;
  email?: string;
  customerId?: string;
  appId?: string;
}> {
  // Find the challenge
  const challenge = await prisma.emailChallenge.findUnique({
    where: { id: challengeId },
    select: {
      id: true,
      email: true,
      otp: true,
      status: true,
      expiresAt: true,
      appId: true,
      attempts: true,
      lockedUntil: true,
    },
  });

  if (!challenge) {
    return {
      success: false,
      error: "驗證碼無效",
    };
  }

  // Check if challenge is locked
  if (challenge.status === "LOCKED" || (challenge.lockedUntil && challenge.lockedUntil > new Date())) {
    const lockedUntil = challenge.lockedUntil || new Date();
    const minutesRemaining = Math.ceil((lockedUntil.getTime() - Date.now()) / 60000);
    return {
      success: false,
      error: `太多錯誤嘗試，請在 ${minutesRemaining} 分鐘後再試`,
    };
  }

  // Check if challenge is expired
  if (challenge.expiresAt < new Date()) {
    await prisma.emailChallenge.update({
      where: { id: challengeId },
      data: { status: "EXPIRED" },
    });
    return {
      success: false,
      error: "驗證碼已過期，請重新發送",
    };
  }

  // Check if challenge is already consumed
  if (challenge.status !== "PENDING") {
    return {
      success: false,
      error: "驗證碼已使用過",
    };
  }

  // Check rate limit
  const rateLimit = await checkRateLimit(challenge.email, ipAddress);
  if (!rateLimit.allowed) {
    // Lock the challenge
    await prisma.emailChallenge.update({
      where: { id: challengeId },
      data: {
        status: "LOCKED",
        lockedUntil: new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000),
      },
    });
    return {
      success: false,
      error: `太多錯誤嘗試，請在 ${LOCKOUT_DURATION_MINUTES} 分鐘後再試`,
    };
  }

  // Verify OTP
  const otpHash = createHash(otp);
  if (challenge.otp !== otpHash) {
    // Increment attempts
    const newAttempts = challenge.attempts + 1;
    await incrementRateLimit(challenge.email, ipAddress);

    // Check if we should lock the challenge
    if (newAttempts >= MAX_ATTEMPTS) {
      await prisma.emailChallenge.update({
        where: { id: challengeId },
        data: {
          status: "LOCKED",
          attempts: newAttempts,
          lockedUntil: new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000),
        },
      });
      return {
        success: false,
        error: `驗證碼錯誤次數過多，請在 ${LOCKOUT_DURATION_MINUTES} 分鐘後重新發送`,
      };
    }

    await prisma.emailChallenge.update({
      where: { id: challengeId },
      data: { attempts: newAttempts },
    });

    const remainingAttempts = MAX_ATTEMPTS - newAttempts;
    return {
      success: false,
      error: `驗證碼錯誤，還有 ${remainingAttempts} 次嘗試機會`,
    };
  }

  // OTP is correct - mark as consumed
  await prisma.emailChallenge.update({
    where: { id: challengeId },
    data: { status: "CONSUMED" },
  });

  // Reset rate limit for this email/IP
  await resetRateLimit(challenge.email, ipAddress);

  // Get the customer
  const customer = await prisma.appCustomer.findFirst({
    where: {
      appId: challenge.appId!,
      email: challenge.email,
    },
    select: {
      id: true,
    },
  });

  if (!customer) {
    return {
      success: false,
      error: "找不到對應的購買記錄",
    };
  }

  console.log(`✅ OTP verified successfully for ${challenge.email}`);

  return {
    success: true,
    email: challenge.email,
    customerId: customer.id,
    appId: challenge.appId!,
  };
}

/**
 * Cleanup expired OTP challenges
 */
export async function cleanupExpiredOTPChallenges(): Promise<number> {
  try {
    const result = await prisma.emailChallenge.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
    return result.count;
  } catch (error) {
    console.error("清理過期 OTP challenges 失敗:", error);
    return 0;
  }
}
