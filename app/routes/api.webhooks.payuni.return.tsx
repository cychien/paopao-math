import { redirect } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import {
  normalizePayUniPayload,
  processPayUniCallback,
} from "~/operations/process-payuni-callback.server";

export const loader = async () => {
  const target = "/purchase/success";
  console.info("[PayUni return] loader redirect", { target });
  return redirect(target);
};

export const action = async ({ request }: ActionFunctionArgs) => {
  console.info("[PayUni return] callback received", {
    method: request.method,
    url: request.url,
    userAgent: request.headers.get("user-agent"),
    referer: request.headers.get("referer"),
    forwardedFor: request.headers.get("x-forwarded-for"),
  });

  if (request.method !== "POST") {
    console.warn("[PayUni return] non-POST request, redirecting to login", {
      method: request.method,
    });
    const target = "/auth/login";
    console.info("[PayUni return] action redirect", {
      reason: "non_post",
      target,
    });
    return redirect(target);
  }

  try {
    const formData = await request.formData();
    const payload = normalizePayUniPayload(formData);
    console.info("[PayUni return] payload", payload);

    const result = await processPayUniCallback(payload);
    console.info("[PayUni return] processed", result);

    if (!result.isPaid) {
      const target = "/purchase/success?status=failed";
      console.info("[PayUni return] action redirect", {
        reason: "payment_failed",
        target,
      });
      return redirect(target);
    }

    const query = result.email
      ? `?status=paid&email=${encodeURIComponent(result.email)}`
      : "?status=paid";
    const target = `/purchase/success${query}`;
    console.info("[PayUni return] action redirect", {
      reason: "payment_paid",
      target,
    });
    return redirect(target);
  } catch (error) {
    console.error("PayUni return callback failed:", error);
    const target = "/purchase/success?status=failed";
    console.info("[PayUni return] action redirect", {
      reason: "exception",
      target,
    });
    return redirect(target);
  }
};
