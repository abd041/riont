import { Skeleton } from "@/components/ui/skeleton";
import { MarketplacePageShell } from "@/features/homepage/components/marketplace/marketplace-page-shell";

/** Homepage / default storefront loading — matches marketplace layout. */
export default function StorefrontLoading() {
  return (
    <MarketplacePageShell>
      <div className="sf-loading sf-loading--home" aria-busy="true" aria-live="polite">
        <Skeleton className="sf-loading__promo" />
        <Skeleton className="sf-loading__hero" />
        <div className="sf-loading__section">
          <Skeleton className="sf-loading__section-title" />
          <div className="sf-loading__row">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="sf-loading__mini-card" />
            ))}
          </div>
        </div>
        <div className="sf-loading__section">
          <Skeleton className="sf-loading__section-title" />
          <div className="sf-loading__chips">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="sf-loading__chip" />
            ))}
          </div>
        </div>
        <div className="sf-loading__section">
          <Skeleton className="sf-loading__section-title" />
          <div className="sf-loading__grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="sf-loading__card" />
            ))}
          </div>
        </div>
      </div>
    </MarketplacePageShell>
  );
}
