import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "~/utils/style";

const buttonVariant = cva(
  "inline-flex items-center justify-center rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=open]:bg-gray-100 dark:focus-visible:ring-offset-gray-900 dark:focus-visible:ring-offset-gray-800 dark:focus-visible:ring-ring",
  {
    variants: {
      variant: {
        default:
          "text-white bg-brand-solid shadow hover:enabled:bg-brand-solid-hover",
        // outline:
        //   "text-gray-700 shadow-sm border border-gray-300 hover:enabled:bg-gray-100 hover:enabled:text-gray-900",
        // secondary:
        //   "bg-gray-100 text-gray-900 shadow-sm hover:enabled:bg-gray-100/80",
        ghost:
          "text-fg-secondary hover:enabled:bg-bg-primary-hover hover:enabled:text-fg-secondary-hover",
        // link: "text-gray-700 underline-offset-4 hover:enabled:underline hover:enabled:text-gray-900",
      },
      size: {
        sm: "text-sm px-3.5 py-2 h-9",
        md: "px-5 py-2.5",
        lg: "px-[18px] py-2.5 h-11",
        xl: "px-5 py-3 h-12",
        "2xl": "text-lg px-6 py-4 h-15",
      },
      iconButton: {
        true: "h-10",
        false: "",
      },
    },
    compoundVariants: [
      { size: "sm", iconButton: true, class: "w-9 px-0" },
      { size: "md", iconButton: true, class: "w-10 px-0" },
      { size: "lg", iconButton: true, class: "w-11 px-0" },
      { size: "xl", iconButton: true, class: "w-12 px-0" },
      { size: "2xl", iconButton: true, class: "w-15 px-0" },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
      iconButton: false,
    },
  }
);

interface ButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    VariantProps<typeof buttonVariant> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, iconButton, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          buttonVariant({
            variant,
            size,
            iconButton,
            className,
          })
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
export type { ButtonProps };
