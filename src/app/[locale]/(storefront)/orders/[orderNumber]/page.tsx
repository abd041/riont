import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getOrderForCustomer } from "@/server/services/order.service";
import { getSession } from "@/server/services/auth.service";
import { OrderDetailView } from "@/features/orders/components/order-detail-view";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ orderNumber: string; locale: string }>;
}): Promise<Metadata> {
  const { orderNumber, locale } = await params;
  const t = await getTranslations({ locale, namespace: "orders" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return buildPageMetadata({
    locale,
    path: `/orders/${orderNumber}`,
    title: `${t("orderNumber")} ${orderNumber} | ${tCommon("brand")}`,
    description: t("myOrdersSubtitle"),
  });
}

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNumber: string; locale: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { orderNumber, locale } = await params;
  const { token } = await searchParams;
  const user = await getSession();

  const order = await getOrderForCustomer({
    orderNumber,
    locale,
    userId: user?.id,
    guestToken: token,
  });

  if (!order) notFound();

  return (
    <OrderDetailView
      order={order}
      locale={locale}
      showGuestTokenHint={Boolean(token && !user)}
      showSupportLink={Boolean(user)}
      isGuest={!user}
    />
  );
}
