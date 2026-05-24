"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorState({
  title,
  description,
  retryLabel,
  onRetry,
}: {
  title: string;
  description?: string;
  retryLabel?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="glass-card flex flex-col items-center justify-center rounded-[var(--radius-lg)] px-6 py-12 text-center">
      <AlertCircle className="mb-4 h-10 w-10 text-red-400" strokeWidth={1.5} />
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2>
      {description && (
        <p className="mt-2 max-w-md text-sm text-[var(--text-muted)]">{description}</p>
      )}
      {onRetry && retryLabel && (
        <Button variant="secondary" className="mt-6" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
