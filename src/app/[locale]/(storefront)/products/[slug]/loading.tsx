import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
  return (
    <div className="sf-loading sf-loading--pdp" aria-busy="true" aria-live="polite">
      <Skeleton className="sf-loading__pdp-breadcrumb" />
      <div className="sf-loading__pdp-main">
        <Skeleton className="sf-loading__pdp-gallery" />
        <div className="sf-loading__pdp-info">
          <Skeleton className="sf-loading__pdp-title" />
          <Skeleton className="sf-loading__pdp-rating" />
          <Skeleton className="sf-loading__pdp-price" />
          <Skeleton className="sf-loading__pdp-actions" />
        </div>
      </div>
      <Skeleton className="sf-loading__pdp-tabs" />
    </div>
  );
}
