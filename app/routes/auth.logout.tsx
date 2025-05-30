import type { ActionFunctionArgs } from "@remix-run/node";
import { logout } from "~/services/auth/session";

export const action = async ({ request }: ActionFunctionArgs) => {
  return await logout(request, "/");
};

// 如果有人直接訪問這個路由，重導向到首頁
export const loader = async () => {
  return await logout(
    new Request(process.env.APP_URL || "http://localhost:3000"),
    "/"
  );
};
