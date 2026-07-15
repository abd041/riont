"use client";

type StatItem = { value: string; label: string };

export function HomeStatsStrip({
  items,
  ariaLabel,
}: {
  items: StatItem[];
  ariaLabel: string;
}) {
  if (items.length === 0) return null;

  return (
    <div className="mp-stats-strip" aria-label={ariaLabel}>
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className="mp-stats-strip__item">
          <p className="mp-stats-strip__value">{item.value}</p>
          <p className="mp-stats-strip__label">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
