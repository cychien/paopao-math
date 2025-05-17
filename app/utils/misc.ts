import { useFormAction, useNavigation } from "@remix-run/react";

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

export { getChineseNumber };
