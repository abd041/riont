import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "glass-card flex flex-col items-center justify-center rounded-[var(--radius-lg)] px-6 py-12 text-center",
        className,
      )}
    >
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2>
      {description && (
        <p className="mt-2 max-w-md text-sm text-[var(--text-muted)]">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
