import type { Route } from "./+types/logout";
import { redirect } from "react-router";
import { destroyCustomerSession } from "~/services/customer-session.server";

export async function loader({ request }: Route.LoaderArgs) {
  const cookie = await destroyCustomerSession(request);

  return redirect("/", {
    headers: {
      "Set-Cookie": cookie,
    },
  });
}

export default function LogoutPage() {
  return null;
}
