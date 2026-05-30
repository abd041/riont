"use client";

import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type MarketplaceScrollRowProps = {
  children: ReactNode;
  className?: string;
  role?: string;
};

/** Horizontal snap-scroll row for products/categories. */
export function MarketplaceScrollRow({
  children,
  className,
  role = "list",
}: MarketplaceScrollRowProps) {
  return (
    <div className={cn("mp-scroll", className)} role={role}>
      {children}
    </div>
  );
}
