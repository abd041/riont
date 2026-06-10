import Link from "next/link";
import { getOrderStatusLabel } from "@/lib/admin/labels";
import { getAdminDashboardStats } from "@/server/services/admin-dashboard.service";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminPageShell } from "@/features/admin/components/admin-page-shell";
import {
  AdminDataTable,
  AdminTableEmpty,
} from "@/features/admin/components/admin-data-table";

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();
  const needsAttention =
    stats.ordersNewOrAwaitingPayment +
    stats.ordersPaidNotDelivered +
    stats.ticketsNeedingReply;

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Dashboard"
        description="Start here — see what needs your attention, then open Orders or Support."
      />

      {stats.productsLive < 10 && (
        <div className="admin-dashboard-notice" role="status">
          <p className="admin-dashboard-notice__title">Catalog looks thin</p>
          <p className="admin-dashboard-notice__body">
            Only {stats.productsLive} live product{stats.productsLive === 1 ? "" : "s"}{" "}
            are visible on the storefront. Run the demo seed (
            <code>npm run db:seed:linked</code> on production, or paste{" "}
            <code>supabase/seed.sql</code> in Supabase SQL Editor), then set{" "}
            <code>CATALOG_DEMO_FALLBACK=false</code> on Vercel. See{" "}
            <code>docs/DEPLOY.md</code> §6.
          </p>
        </div>
      )}

      <section className="admin-dashboard-attention" aria-label="Needs attention">
        <h2 className="admin-dashboard-section__title">Needs your attention</h2>
        <div className="admin-stats admin-stats--dashboard">
          <Link
            href="/admin/orders?status=pending_review"
            className="admin-stat admin-stat--action"
          >
            <p className="admin-stat__label">New orders & awaiting payment</p>
            <p className="admin-stat__value">{stats.ordersNewOrAwaitingPayment}</p>
            <p className="admin-stat__hint">Review and confirm payment</p>
          </Link>
          <Link
            href="/admin/orders?status=payment_received"
            className="admin-stat admin-stat--action"
          >
            <p className="admin-stat__label">Paid — ready to deliver</p>
            <p className="admin-stat__value">{stats.ordersPaidNotDelivered}</p>
            <p className="admin-stat__hint">Process or mark delivered</p>
          </Link>
          <Link
            href="/admin/tickets?status=waiting_admin"
            className="admin-stat admin-stat--action"
          >
            <p className="admin-stat__label">Support needs reply</p>
            <p className="admin-stat__value">{stats.ticketsNeedingReply}</p>
            <p className="admin-stat__hint">Open support tickets</p>
          </Link>
        </div>
        {needsAttention === 0 && (
          <p className="admin-dashboard-all-clear">
            All caught up — no orders or tickets waiting on you right now.
          </p>
        )}
      </section>

      <section className="admin-dashboard-overview" aria-label="Overview">
        <h2 className="admin-dashboard-section__title">Overview</h2>
        <div className="admin-stats">
          <div className="admin-stat">
            <p className="admin-stat__label">Live products</p>
            <p className="admin-stat__value">{stats.productsLive}</p>
          </div>
          <div className="admin-stat">
            <p className="admin-stat__label">Draft products</p>
            <p className="admin-stat__value">{stats.productsDraft}</p>
          </div>
        </div>
      </section>

      <section className="admin-dashboard-shortcuts" aria-label="Shortcuts">
        <h2 className="admin-dashboard-section__title">Shortcuts</h2>
        <div className="admin-shortcuts">
          <Link href="/admin/orders" className="admin-shortcut">
            View all orders
          </Link>
          <Link href="/admin/products/new" className="admin-shortcut">
            Add product
          </Link>
          <Link href="/admin/tickets" className="admin-shortcut">
            Support inbox
          </Link>
          <Link href="/admin/homepage" className="admin-shortcut">
            Edit homepage
          </Link>
        </div>
      </section>

      <section aria-label="Recent orders">
        <div className="admin-dashboard-section__head">
          <h2 className="admin-dashboard-section__title">Recent orders</h2>
          <Link href="/admin/orders" className="admin-dashboard-section__link">
            View all →
          </Link>
        </div>
        <AdminDataTable
          columns={["Order", "Customer", "Status", "Total", "Submitted"]}
        >
          {stats.recentOrders.length === 0 ? (
            <AdminTableEmpty
              colSpan={5}
              message="No orders yet. They will appear here when customers place orders."
            />
          ) : (
            stats.recentOrders.map((order) => (
              <tr key={order.id}>
                <td>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="admin-table__link"
                    dir="ltr"
                  >
                    {order.orderNumber}
                  </Link>
                </td>
                <td>{order.customerLabel}</td>
                <td>
                  <OrderStatusBadge
                    status={order.status}
                    label={getOrderStatusLabel(order.status)}
                  />
                </td>
                <td dir="ltr">
                  {(order.totalCents / 100).toFixed(2)} {order.currency}
                </td>
                <td className="text-[var(--text-muted)]">
                  {new Date(order.submittedAt).toLocaleString("en")}
                </td>
              </tr>
            ))
          )}
        </AdminDataTable>
      </section>

      <details className="admin-guide">
        <summary className="admin-guide__summary">How this admin works</summary>
        <div className="admin-guide__body">
          <ol className="admin-guide__steps">
            <li>
              <strong>Customer places an order</strong> — they pay outside the
              site (bank transfer, WhatsApp, etc.).
            </li>
            <li>
              <strong>You verify payment</strong> — open the order and move it
              to &ldquo;Paid — ready to process&rdquo; when money is received.
            </li>
            <li>
              <strong>Deliver the product</strong> — automatic items send codes;
              manual items need you to paste delivery details.
            </li>
            <li>
              <strong>Support</strong> — reply to tickets marked &ldquo;Needs
              your reply&rdquo; from the Support section.
            </li>
          </ol>
          <p className="admin-guide__note">
            Payment is not processed inside the website. You always confirm
            payment manually before fulfilling.
          </p>
        </div>
      </details>
    </AdminPageShell>
  );
}
