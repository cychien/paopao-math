import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import { cn } from "~/utils/style";

function RadioGroupBox({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("flex flex-wrap gap-1.5", className)}
      {...props}
    />
  );
}

function RadioGroupBoxItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "text-sm rounded-md px-3 py-1.5 bg-gray-200/60 border-[1.5px] border-gray-200/10 text-gray-500 flex items-center justify-center cursor-pointer data-[state=checked]:border-gray-950 data-[state=checked]:text-gray-950",
        className
      )}
      {...props}
    />
  );
}

export { RadioGroupBox, RadioGroupBoxItem };
