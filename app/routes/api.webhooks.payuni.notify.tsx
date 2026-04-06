import { data } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import {
  normalizePayUniPayload,
  processPayUniCallback,
} from "~/operations/process-payuni-callback.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  console.info("[PayUni notify] callback received", {
    method: request.method,
    url: request.url,
  });

  if (request.method !== "POST") {
    console.warn("[PayUni notify] method not allowed", {
      method: request.method,
    });
    return data({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const formData = await request.formData();
    const payload = normalizePayUniPayload(formData);
    console.info("[PayUni notify] payload", payload);

    const result = await processPayUniCallback(payload);
    console.info("[PayUni notify] processed", result);

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("PayUni notify callback failed:", error);
    return new Response("FAIL", { status: 400 });
  }
};
