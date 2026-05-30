import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/utils/cn";

type MarketplaceSectionHeaderProps = {
  title: string;
  action?: { label: string; href: string };
  meta?: ReactNode;
  className?: string;
};

export function MarketplaceSectionHeader({
  title,
  action,
  meta,
  className,
}: MarketplaceSectionHeaderProps) {
  return (
    <div className={cn("mp-section__head", className)}>
      <h2 className="mp-section__title">{title}</h2>
      <div className="mp-section__head-end">
        {meta && <span className="mp-section__meta">{meta}</span>}
        {action && (
          <Link href={action.href} className="mp-section__link">
            {action.label}
          </Link>
        )}
      </div>
    </div>
  );
}
