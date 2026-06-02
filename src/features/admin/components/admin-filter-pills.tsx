import Link from "next/link";
import { cn } from "@/utils/cn";

type AdminFilterPillsProps<T extends string> = {
  filters: Array<{ label: string; value?: T }>;
  activeValue?: T;
  basePath: string;
  paramName?: string;
};

export function AdminFilterPills<T extends string>({
  filters,
  activeValue,
  basePath,
  paramName = "status",
}: AdminFilterPillsProps<T>) {
  return (
    <div className="admin-filters">
      {filters.map((filter) => {
        const href = filter.value
          ? `${basePath}?${paramName}=${filter.value}`
          : basePath;
        const active = (filter.value ?? undefined) === (activeValue ?? undefined);

        return (
          <Link
            key={filter.label}
            href={href}
            className={cn("admin-filter", active && "admin-filter--active")}
          >
            {filter.label}
          </Link>
        );
      })}
    </div>
  );
}
