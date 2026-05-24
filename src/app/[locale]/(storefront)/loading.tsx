import { Skeleton } from "@/components/ui/skeleton";

export default function StorefrontLoading() {
  return (
    <div className="mx-auto max-w-content space-y-6">
      <Skeleton className="h-10 w-48" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-[var(--radius-lg)]" />
        ))}
      </div>
    </div>
  );
}
