import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#3a9133]/50",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-[#3a9133] to-[#53802d] text-white hover:shadow-lg hover:shadow-[#3a9133]/25 hover:-translate-y-0.5",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500/50",
        outline:
          "border-2 border-[#3a9133] text-[#3a9133] bg-transparent hover:bg-[#3a9133]/5",
        secondary: "bg-[#f3efe7] text-[#5a4032] hover:bg-[#e6dccf]",
        ghost: "hover:bg-[#f3efe7] hover:text-[#5a4032]",
        link: "text-[#3a9133] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2 rounded-full",
        xs: "h-6 gap-1 rounded-full px-2 text-xs",
        sm: "h-8 rounded-full gap-1.5 px-4",
        lg: "h-12 rounded-full px-8 text-base",
        icon: "size-10 rounded-full",
        "icon-xs": "size-6 rounded-full",
        "icon-sm": "size-8 rounded-full",
        "icon-lg": "size-12 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
