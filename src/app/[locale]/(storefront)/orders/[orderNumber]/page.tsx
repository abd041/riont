import { notFound } from "next/navigation";
import { getOrderForCustomer } from "@/server/services/order.service";
import { getSession } from "@/server/services/auth.service";
import { OrderDetailView } from "@/features/orders/components/order-detail-view";

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
    />
  );
}
