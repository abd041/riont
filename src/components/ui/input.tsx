import * as React from "react";
import { cn } from "@/lib/utils/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-surface px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-glow)] focus:outline-none focus:ring-0 focus:shadow-[0_0_12px_var(--accent-glow-sm)]",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
