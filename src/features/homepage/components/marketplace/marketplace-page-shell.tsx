import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type MarketplacePageShellProps = {
  children: ReactNode;
  className?: string;
};

/** Homepage / marketplace page wrapper — compact max-width shell. */
export function MarketplacePageShell({
  children,
  className,
}: MarketplacePageShellProps) {
  return (
    <div className={cn("mp-page", className)}>
      <span className="mp-page__backdrop" aria-hidden />
      <span className="mp-page__atmosphere mp-page__atmosphere--top" aria-hidden />
      <span className="mp-page__atmosphere mp-page__atmosphere--side" aria-hidden />
      <div className="mp-page__inner">{children}</div>
    </div>
  );
}
