import Link from "next/link";
import { listAuditLogs } from "@/server/services/audit.service";
import {
  AdminDataTable,
  AdminTableEmpty,
} from "@/features/admin/components/admin-data-table";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminPageShell } from "@/features/admin/components/admin-page-shell";

function formatAction(action: string) {
  return action.replace(/\./g, " · ").replace(/_/g, " ");
}

function entityHref(entityType: string, entityId: string) {
  if (entityType === "order") return `/admin/orders/${entityId}`;
  if (entityType === "product") return `/admin/products/${entityId}`;
  if (entityType === "customer") return `/admin/customers/${entityId}`;
  return null;
}

export default async function AdminActivityPage() {
  const logs = await listAuditLogs(100);

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Activity log"
        description="Recent admin actions across orders, products, and settings."
      />

      <AdminDataTable
        columns={["When", "Actor", "Action", "Entity", "Details"]}
        scrollable
      >
        {logs.length === 0 ? (
          <AdminTableEmpty
            colSpan={5}
            message="No activity recorded yet. Actions will appear here as you manage the store."
          />
        ) : (
          logs.map((log) => {
            const href = entityHref(log.entityType, log.entityId);
            const meta = log.metadata
              ? JSON.stringify(log.metadata).slice(0, 120)
              : "—";

            return (
              <tr key={log.id}>
                <td className="text-[var(--text-muted)] whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString("en")}
                </td>
                <td>{log.actorLabel}</td>
                <td className="capitalize">{formatAction(log.action)}</td>
                <td>
                  {href ? (
                    <Link href={href} className="admin-table__link">
                      {log.entityType} / {log.entityId.slice(0, 8)}…
                    </Link>
                  ) : (
                    <span>
                      {log.entityType} / {log.entityId.slice(0, 12)}
                    </span>
                  )}
                </td>
                <td className="max-w-[280px] truncate text-xs text-[var(--text-muted)]">
                  {meta}
                </td>
              </tr>
            );
          })
        )}
      </AdminDataTable>
    </AdminPageShell>
  );
}
