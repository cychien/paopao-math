import {
  Link,
  useLocation,
  useResolvedPath,
  useSearchParams,
} from "react-router";
import { useIframe } from "~/context/iframe-context";

interface InternalLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export function InternalLink({
  to,
  children,
  className,
  onClick,
}: InternalLinkProps) {
  const resolved = useResolvedPath(to);
  const { isInIframe } = useIframe();

  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const configId = searchParams.get("configId");
  const sessionToken = searchParams.get("s");

  const finalUrl = new URL(
    resolved.pathname + resolved.search,
    "http://localhost", // Temp, not real origin
  );

  if (mode && !finalUrl.searchParams.has("mode")) {
    finalUrl.searchParams.set("mode", mode);
  }
  if (configId && !finalUrl.searchParams.has("configId")) {
    finalUrl.searchParams.set("configId", configId);
  }
  // Only preserve session token in iframe (security: prevent URL sharing)
  if (isInIframe && sessionToken && !finalUrl.searchParams.has("s")) {
    finalUrl.searchParams.set("s", sessionToken);
  }

  return (
    <Link
      to={finalUrl.pathname + finalUrl.search}
      className={className}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
