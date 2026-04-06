import { prisma } from "~/services/database/prisma.server";
import {
  extractPayUniEmail,
  extractPayUniName,
  isPayUniPaymentSuccessful,
  resolvePayUniConfig,
  verifyAndDecryptPayUniResult,
  type PayUniConfig,
} from "~/services/payuni";

const DEFAULT_APP_SLUG = "paopao-math";

export async function processPayUniCallback(payload: Record<string, string>) {
  console.info("[PayUni process] start", {
    payloadKeys: Object.keys(payload),
  });

  const app = await prisma.app.findUnique({
    where: { slug: DEFAULT_APP_SLUG },
    select: {
      id: true,
      paymentIntegration: {
        select: {
          provider: true,
          isActive: true,
          config: true,
        },
      },
    },
  });

  if (!app?.paymentIntegration?.isActive) {
    throw new Error("PayUni integration is not active");
  }

  if (app.paymentIntegration.provider !== "PAYUNI") {
    throw new Error("Payment provider is not PayUni");
  }

  const rawConfig = app.paymentIntegration.config as PayUniConfig;
  const config = resolvePayUniConfig(rawConfig);
  if (!config) {
    throw new Error("PayUni configuration is incomplete");
  }

  const verified = verifyAndDecryptPayUniResult(payload, config);
  const decrypted = verified.decrypted;
  console.info("[PayUni process] verified and decrypted", {
    decryptedKeys: Object.keys(decrypted),
    decrypted,
  });

  const merTradeNo = decrypted.MerTradeNo;
  if (!merTradeNo) {
    throw new Error("Missing MerTradeNo in PayUni callback");
  }

  const order = await prisma.payUniOrder.findUnique({
    where: { merTradeNo },
  });

  if (!order) {
    throw new Error(`PayUni order not found: ${merTradeNo}`);
  }

  const payUniTradeNo = decrypted.TradeNo ?? decrypted.PayNo ?? null;
  const isPaid = isPayUniPaymentSuccessful(decrypted);
  const callbackEmail = extractPayUniEmail(decrypted);
  const name = extractPayUniName(decrypted);
  const email = callbackEmail ?? order.email ?? null;
  console.info("[PayUni process] normalized result", {
    merTradeNo,
    payUniTradeNo,
    isPaid,
    callbackEmail,
    orderEmail: order.email,
    resolvedEmail: email,
  });

  const orderAlreadyPaid = order.status === "PAID" || order.status === "PAID_MISSING_EMAIL";

  if (!isPaid) {
    if (orderAlreadyPaid) {
      return {
        success: true,
        isPaid: true,
        merTradeNo,
        email: order.email,
      };
    }

    await prisma.payUniOrder.update({
      where: { merTradeNo },
      data: {
        status: "FAILED",
        rawResult: {
          outer: verified.outer,
          decrypted,
        },
      },
    });

    return {
      success: false,
      isPaid: false,
      merTradeNo,
      email: null,
    };
  }

  let customerId: string | null = null;

  if (email) {
    let customer = await prisma.appCustomer.findFirst({
      where: {
        appId: order.appId,
        variantId: order.variantId,
        email,
      },
    });

    if (!customer) {
      customer = await prisma.appCustomer.create({
        data: {
          appId: order.appId,
          variantId: order.variantId,
          email,
          name,
        },
      });
    }

    customerId = customer.id;
  }

  await prisma.payUniOrder.update({
    where: { merTradeNo },
    data: {
      payUniTradeNo: payUniTradeNo ?? undefined,
      email,
      name: name ?? order.name,
      status: email ? "PAID" : "PAID_MISSING_EMAIL",
      paidAt: new Date(),
      rawResult: {
        outer: verified.outer,
        decrypted,
      },
    },
  });

  return {
    success: true,
    isPaid: true,
    merTradeNo,
    email,
    customerId,
  };
}

export function normalizePayUniPayload(input: FormData | URLSearchParams) {
  const output: Record<string, string> = {};
  for (const [key, value] of input.entries()) {
    if (typeof value === "string") {
      output[key] = value;
    }
  }
  return output;
}
