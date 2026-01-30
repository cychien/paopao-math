import { HugeiconsIcon } from '@hugeicons/react';

function Icon({ strokeWidth, ...props }: React.ComponentProps<typeof HugeiconsIcon>) {
  return <HugeiconsIcon strokeWidth={strokeWidth ?? 2} {...props} />;
}

export default Icon;