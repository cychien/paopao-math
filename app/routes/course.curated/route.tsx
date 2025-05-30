import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { LockScreen } from "~/components/business/LockScreen";
import { canUserAccessPath } from "~/services/auth/permissions";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const path = url.pathname;

  const canAccess = await canUserAccessPath(request, path);
  if (!canAccess) {
    return json({ notAccess: true });
  }
  return null;
}

export default function Page() {
  const data = useLoaderData<typeof loader>();

  if (!data) return null;

  if (data.notAccess) {
    return <LockScreen />;
  }
}
