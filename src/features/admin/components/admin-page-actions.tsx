import Link from "next/link";

export function AdminPageActions({ children }: { children: React.ReactNode }) {
  return <div className="admin-page-actions">{children}</div>;
}

export function AdminExportOrdersLink({
  status,
}: {
  status?: string;
}) {
  const href = status
    ? `/api/admin/orders/export?status=${encodeURIComponent(status)}`
    : "/api/admin/orders/export";

  return (
    <Link href={href} className="admin-btn admin-btn--outline" download>
      Export CSV
    </Link>
  );
}

export function AdminSearchForm({
  basePath,
  placeholder,
  defaultValue,
  hiddenParams,
}: {
  basePath: string;
  placeholder: string;
  defaultValue?: string;
  hiddenParams?: Record<string, string | undefined>;
}) {
  return (
    <form className="admin-search" method="get" action={basePath}>
      {hiddenParams &&
        Object.entries(hiddenParams).map(([key, value]) =>
          value ? <input key={key} type="hidden" name={key} value={value} /> : null,
        )}
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="admin-search__input"
      />
      <button type="submit" className="admin-btn admin-btn--outline">
        Search
      </button>
    </form>
  );
}
