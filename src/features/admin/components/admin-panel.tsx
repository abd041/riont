import type { ElementType, ReactNode } from "react";
import { cn } from "@/utils/cn";

type AdminPanelProps = {
  title?: string;
  children: ReactNode;
  className?: string;
  as?: ElementType;
};

export function AdminPanel({
  title,
  children,
  className,
  as: Tag = "section",
}: AdminPanelProps) {
  return (
    <Tag className={cn("admin-panel", className)}>
      {title && (
        <div className="admin-panel__head">
          <h2 className="admin-panel__title">{title}</h2>
        </div>
      )}
      <div className="admin-panel__body">{children}</div>
    </Tag>
  );
}
