import { Outlet, redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  // Only redirect the root /purchase path to checkout.
  // Keep nested routes like /purchase/success accessible.
  if (url.pathname === "/purchase") {
    return redirect("/api/purchase");
  }

  return null;
};

export default function PurchaseRedirectPage() {
  return <Outlet />;
}
