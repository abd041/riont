import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Package } from "lucide-react";
import { listCustomerOrders } from "@/server/services/order.service";
import { getSession } from "@/server/services/auth.service";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { OrderAmount } from "@/features/orders/components/order-amount";
import {
  PremiumPanel,
  StorefrontPageHeader,
  StorefrontPageShell,
} from "@/components/shared";
import { EmptyState } from "@/components/ui/empty-state";
import type { OrderStatus } from "@/lib/domain/enums";

export default async function AccountOrdersPage() {
  const t = await getTranslations("orders");
  const locale = await getLocale();
  const user = await getSession();

  if (!user) return null;

  const orders = await listCustomerOrders(user.id, locale);

  return (
    <StorefrontPageShell>
      <StorefrontPageHeader
        title={t("myOrders")}
        subtitle={t("myOrdersSubtitle")}
        backHref="/products"
        backLabel={t("browseProducts")}
      />

      {orders.length === 0 ? (
        <EmptyState
          icon={<Package strokeWidth={1.5} />}
          title={t("empty")}
          action={
            <Link href="/products" className="sf-btn-primary">
              {t("browseProducts")}
            </Link>
          }
        />
      ) : (
        <PremiumPanel>
          <ul className="sf-order-list">
            {orders.map((order) => (
              <li key={order.id}>
                <Link href={`/orders/${order.orderNumber}`} className="sf-order-card">
                  <div>
                    <p className="sf-order-card__number" dir="ltr">
                      {order.orderNumber}
                    </p>
                    <p className="sf-order-card__summary">{order.productSummary}</p>
                    <p className="sf-order-card__date">
                      {new Date(order.submittedAt).toLocaleString(locale)}
                    </p>
                  </div>
                  <div className="sf-order-card__end">
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
        </PremiumPanel>
      )}
    </StorefrontPageShell>
  );
}
