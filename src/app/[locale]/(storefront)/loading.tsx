import { Skeleton } from "@/components/ui/skeleton";
import { StorefrontPageShell } from "@/components/shared/storefront-page-shell";

export default function StorefrontLoading() {
  return (
    <StorefrontPageShell>
      <div className="sf-loading">
        <Skeleton className="sf-loading__title" />
        <Skeleton className="sf-loading__subtitle" />
        <div className="sf-loading__grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="sf-loading__card" />
          ))}
        </div>
      </div>
    </StorefrontPageShell>
  );
}
