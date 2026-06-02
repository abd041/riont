"use client";

import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("sf-panel sf-empty", className)}>
      {icon && <div className="sf-empty__icon">{icon}</div>}
      <h2 className="sf-empty__title">{title}</h2>
      {description && <p className="sf-empty__desc">{description}</p>}
      {action && <div className="sf-empty__action">{action}</div>}
    </div>
  );
}
