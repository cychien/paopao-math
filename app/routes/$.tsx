import { Link, useLocation } from "react-router";
import { GeneralErrorBoundary } from "~/components/business/ErrorBoundry";

export async function loader() {
  throw new Response("Not found", { status: 404 });
}

export default function NotFound() {
  return <ErrorBoundary />;
}

export function ErrorBoundary() {
  const location = useLocation();
  return (
    <GeneralErrorBoundary
      statusHandlers={{
        404: () => (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h1>找不到此頁:</h1>
              <pre className="whitespace-pre-wrap break-all text-body-lg">
                {location.pathname}
              </pre>
            </div>
            <Link to="/" className="text-body-md underline">
              回到首頁
            </Link>
          </div>
        ),
      }}
    />
  );
}
