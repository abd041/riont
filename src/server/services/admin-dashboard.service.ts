import { createAdminClient } from "@/lib/supabase/admin";
import { OrderStatus } from "@/lib/domain/enums";
import { listAdminOrders } from "@/server/services/admin-order.service";
import type { AdminOrderListItem } from "@/types/admin";

export type AdminDashboardStats = {
  ordersNewOrAwaitingPayment: number;
  ordersPaidNotDelivered: number;
  ticketsNeedingReply: number;
  productsLive: number;
  productsDraft: number;
  recentOrders: AdminOrderListItem[];
};

async function countOrdersWithStatuses(statuses: string[]): Promise<number> {
  const admin = createAdminClient();
  const { count, error } = await admin
    .from("orders")
    .select("id", { count: "exact", head: true })
    .in("status", statuses);

  if (error) throw error;
  return count ?? 0;
}

async function countTicketsWithStatus(status: string): Promise<number> {
  const admin = createAdminClient();
  const { count, error } = await admin
    .from("support_tickets")
    .select("id", { count: "exact", head: true })
    .eq("status", status);

  if (error) throw error;
  return count ?? 0;
}

async function countProductsWithStatus(status: string): Promise<number> {
  const admin = createAdminClient();
  const { count, error } = await admin
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("status", status);

  if (error) throw error;
  return count ?? 0;
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const [
    ordersNewOrAwaitingPayment,
    ordersPaidNotDelivered,
    ticketsNeedingReply,
    productsLive,
    productsDraft,
    recentOrders,
  ] = await Promise.all([
    countOrdersWithStatuses([
      OrderStatus.PENDING_REVIEW,
      OrderStatus.AWAITING_PAYMENT,
    ]),
    countOrdersWithStatuses([
      OrderStatus.PAYMENT_RECEIVED,
      OrderStatus.PROCESSING,
    ]),
    countTicketsWithStatus("waiting_admin"),
    countProductsWithStatus("active"),
    countProductsWithStatus("draft"),
    listAdminOrders(undefined, { limit: 5 }),
  ]);

  return {
    ordersNewOrAwaitingPayment,
    ordersPaidNotDelivered,
    ticketsNeedingReply,
    productsLive,
    productsDraft,
    recentOrders,
  };
}
