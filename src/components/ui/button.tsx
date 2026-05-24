import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        primary:
          "bg-[image:var(--gradient-primary)] text-white hover:glow-md shadow-[0_0_12px_var(--accent-glow-sm)]",
        secondary:
          "border border-[var(--border-default)] bg-surface text-[var(--text-primary)] hover:border-[var(--border-glow)]",
        ghost:
          "text-[var(--text-secondary)] hover:bg-surface hover:text-[var(--text-primary)]",
        outline:
          "border border-[var(--border-default)] bg-transparent text-[var(--text-primary)] hover:border-accent-500",
      },
      size: {
        default: "h-10 px-5",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
