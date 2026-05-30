import type { ElementType, ReactNode } from "react";
import { cn } from "@/utils/cn";

type MarketplaceSectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: ElementType;
  "aria-label"?: string;
  "aria-live"?: "off" | "polite" | "assertive";
};

/** Compact section wrapper with consistent vertical rhythm. */
export function MarketplaceSection({
  children,
  className,
  id,
  as: Tag = "section",
  "aria-label": ariaLabel,
  "aria-live": ariaLive,
}: MarketplaceSectionProps) {
  return (
    <Tag
      id={id}
      aria-label={ariaLabel}
      aria-live={ariaLive}
      className={cn("mp-section", className)}
    >
      {children}
    </Tag>
  );
}
