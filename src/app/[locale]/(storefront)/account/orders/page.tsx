import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { listCustomerOrders } from "@/server/services/order.service";
import { getSession } from "@/server/services/auth.service";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { OrderAmount } from "@/features/orders/components/order-amount";
import type { OrderStatus } from "@/lib/domain/enums";

export default async function AccountOrdersPage() {
  const t = await getTranslations("orders");
  const locale = await getLocale();
  const user = await getSession();

  if (!user) return null;

  const orders = await listCustomerOrders(user.id, locale);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">{t("myOrders")}</h1>

      {orders.length === 0 ? (
        <div className="glass-card rounded-[var(--radius-lg)] p-10 text-center">
          <p className="text-[var(--text-muted)]">{t("empty")}</p>
          <Link
            href="/products"
            className="mt-4 inline-block text-sm text-accent-400 hover:text-accent-500"
          >
            {t("browseProducts")} →
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/orders/${order.orderNumber}`}
                className="glass-card flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-lg)] p-4 transition hover:border-[var(--border-glow)]"
              >
                <div>
                  <p className="font-medium" dir="ltr">
                    {order.orderNumber}
                  </p>
                  <p className="text-sm text-[var(--text-muted)]">
                    {order.productSummary}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {new Date(order.submittedAt).toLocaleString(locale)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <OrderStatusBadge
                    status={order.status}
                    label={t(`status.${order.status as OrderStatus}`)}
                  />
                  <OrderAmount
                    cents={order.totalCents}
                    className="font-semibold text-accent-400"
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
