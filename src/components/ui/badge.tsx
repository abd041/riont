import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-surface-2 text-[var(--text-secondary)]",
        accent: "bg-accent-500/20 text-accent-400",
        success: "bg-[var(--success-muted)] text-[var(--success)]",
        warning: "bg-[var(--warning-muted)] text-[var(--warning)]",
        error: "bg-[var(--error-muted)] text-[var(--error)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
