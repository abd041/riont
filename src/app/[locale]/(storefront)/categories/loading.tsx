import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesLoading() {
  return (
    <div className="sf-loading sf-loading--categories" aria-busy="true" aria-live="polite">
      <Skeleton className="sf-loading__categories-title" />
      <Skeleton className="sf-loading__categories-subtitle" />
      <div className="sf-loading__categories-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="sf-loading__categories-card" />
        ))}
      </div>
    </div>
  );
}
