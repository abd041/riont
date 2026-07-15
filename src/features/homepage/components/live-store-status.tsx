"use client";

type StatusItem = { label: string; value: string };

export function LiveStoreStatus({
  items,
  ariaLabel,
}: {
  items: StatusItem[];
  ariaLabel: string;
}) {
  if (items.length === 0) return null;

  return (
    <div className="mp-live-status" role="status" aria-label={ariaLabel}>
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="mp-live-status__item">
          {index > 0 ? (
            <span className="mp-live-status__sep" aria-hidden>
              ·
            </span>
          ) : null}
          <span className="mp-live-status__label">{item.label}:</span>{" "}
          <span className="mp-live-status__value">{item.value}</span>
        </span>
      ))}
    </div>
  );
}
