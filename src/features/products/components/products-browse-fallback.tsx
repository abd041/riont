import { Skeleton } from "@/components/ui/skeleton";

export function ProductsBrowseFallback() {
  return (
    <div className="sf-loading sf-loading--browse" aria-busy="true" aria-live="polite">
      <div className="sf-loading__browse-header">
        <Skeleton className="sf-loading__browse-title" />
        <Skeleton className="sf-loading__browse-search" />
        <Skeleton className="sf-loading__browse-sort" />
      </div>
      <Skeleton className="sf-loading__browse-filters" />
      <div className="sf-loading__grid sf-loading__grid--browse">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="sf-loading__card" />
        ))}
      </div>
    </div>
  );
}
