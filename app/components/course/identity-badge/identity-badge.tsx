import { Badge } from "~/components/ui/badge";
import { LockClosedIcon } from "@heroicons/react/24/solid";

function FreePreviewBadge() {
  return (
    <Badge className="border border-emerald-700/25 bg-emerald-100 text-emerald-950">
      免費試讀
    </Badge>
  );
}

function PremiumBadge() {
  return (
    <Badge className="border border-amber-700/25 bg-amber-100 text-amber-950">
      <LockClosedIcon className="text-amber-500" />
      學生限定
    </Badge>
  );
}

export { FreePreviewBadge, PremiumBadge };
