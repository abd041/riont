import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type StorefrontPageShellProps = {
  children: ReactNode;
  className?: string;
  /** Narrow max-width for forms and confirmation flows */
  variant?: "default" | "narrow" | "wide";
};

/** Premium inner page wrapper — pairs with StorefrontShell ambient + footer. */
export function StorefrontPageShell({
  children,
  className,
  variant = "default",
}: StorefrontPageShellProps) {
  return (
    <div
      className={cn(
        "sf-page",
        variant === "narrow" && "sf-page--narrow",
        variant === "wide" && "sf-page--wide",
        className,
      )}
    >
      <span className="sf-page__glow sf-page__glow--top" aria-hidden />
      <div className="sf-page__inner">{children}</div>
    </div>
  );
}
