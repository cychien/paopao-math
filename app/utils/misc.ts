import { useFormAction, useNavigation } from "react-router";

/**
 * Returns true if the current navigation is submitting the current route's
 * form. Defaults to the current route's form action and method POST.
 *
 * Defaults state to 'non-idle'.
 */
export function useIsPending({
  formAction,
  formMethod = "POST",
  state = "non-idle",
}: {
  formAction?: string;
  formMethod?: "POST" | "GET" | "PUT" | "PATCH" | "DELETE";
  state?: "submitting" | "loading" | "non-idle";
} = {}) {
  const contextualFormAction = useFormAction();
  const navigation = useNavigation();
  const isPendingState =
    state === "non-idle"
      ? navigation.state !== "idle"
      : navigation.state === state;
  return (
    isPendingState &&
    navigation.formAction === (formAction ?? contextualFormAction) &&
    navigation.formMethod === formMethod
  );
}

function getChineseNumber({ number }: { number: number }) {
  const map = {
    1: "一",
    2: "二",
    3: "三",
    4: "四",
    5: "五",
    6: "六",
    7: "七",
    8: "八",
    9: "九",
  } as Record<number, string>;

  return map[number];
}

function getErrorMessage(error: unknown) {
  if (typeof error === "string") return error;
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  console.error("Unable to get error message for error", error);
  return "Unknown Error";
}

/**
 * Get the origin URL with correct protocol (https in production)
 * Handles cases where app is behind a reverse proxy/load balancer
 */
function getOriginUrl(request: Request): string {
  const url = new URL(request.url);

  return process.env.NODE_ENV === "production" ? "https://paopao-math.com" : `${url.protocol}//${url.host}`;
  
  // // Check for forwarded protocol header (set by proxies like Fly.io, nginx, etc.)
  // const forwardedProto = process.env.NODE_ENV === "production" ? "https" : url.protocol.replace(":", "");
  // const forwardedHost = request.headers.get("x-forwarded-host");
  
  // if (forwardedProto && forwardedHost) {
  //   return `${forwardedProto}://${forwardedHost}`;
  // }
  
  // // Fallback to request URL origin
  // return url.origin;
}

export { getChineseNumber, getErrorMessage, getOriginUrl };
