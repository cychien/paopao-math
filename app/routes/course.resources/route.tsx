import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { LockScreen } from "~/components/business/LockScreen";
import { trialPermissions } from "~/data/permission";
import { canAccess } from "~/utils/permission";

export function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const path = url.pathname;
  const ok = canAccess({
    permissions: trialPermissions,
    pathname: path,
  });
  if (!ok) {
    return json({ notAccess: true });
  }
}

export default function Page() {
  const data = useLoaderData<typeof loader>();

  if (!data) return null;

  if (data.notAccess) {
    return <LockScreen />;
  }
}
