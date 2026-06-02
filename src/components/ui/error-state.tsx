"use client";

import { AlertCircle } from "lucide-react";

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
    <div className="sf-panel sf-empty">
      <div className="sf-empty__icon sf-empty__icon--error">
        <AlertCircle strokeWidth={1.5} />
      </div>
      <h2 className="sf-empty__title">{title}</h2>
      {description && <p className="sf-empty__desc">{description}</p>}
      {onRetry && retryLabel && (
        <div className="sf-empty__action">
          <button type="button" className="sf-btn-outline" onClick={onRetry}>
            {retryLabel}
          </button>
        </div>
      )}
    </div>
  );
}
