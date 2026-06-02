import type { ElementType, ReactNode } from "react";
import { cn } from "@/utils/cn";

type PremiumPanelProps = {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  as?: ElementType;
  headerAction?: ReactNode;
};

/** Glass panel — checkout-grade surface for forms, lists, and summaries. */
export function PremiumPanel({
  title,
  description,
  children,
  className,
  as: Tag = "section",
  headerAction,
}: PremiumPanelProps) {
  return (
    <Tag className={cn("sf-panel", className)}>
      {(title || description || headerAction) && (
        <div className="sf-panel__head">
          <div className="sf-panel__head-copy">
            {title && <h2 className="sf-panel__title">{title}</h2>}
            {description && <p className="sf-panel__desc">{description}</p>}
          </div>
          {headerAction}
        </div>
      )}
      <div className="sf-panel__body">{children}</div>
    </Tag>
  );
}
