import { createAdminClient } from "@/lib/supabase/admin";
import type { OrderStatus } from "@/lib/domain/enums";

export type AdminCustomerListItem = {
  id: string;
  email: string;
  displayName: string | null;
  locale: string;
  orderCount: number;
  totalSpentCents: number;
  createdAt: string;
};

export type AdminCustomerOrderRow = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalCents: number;
  currency: string;
  submittedAt: string;
  productSummary: string;
};

export type AdminCustomerDetail = {
  id: string;
  email: string;
  displayName: string | null;
  locale: string;
  createdAt: string;
  orderCount: number;
  totalSpentCents: number;
  orders: AdminCustomerOrderRow[];
};

async function loadAuthEmails(admin: ReturnType<typeof createAdminClient>) {
  const { data: authData, error: authError } =
    await admin.auth.admin.listUsers({ perPage: 1000 });
  if (authError) throw authError;
  return new Map((authData.users ?? []).map((u) => [u.id, u.email ?? ""]));
}

export async function listAdminCustomers(
  limit = 100,
  search?: string,
): Promise<AdminCustomerListItem[]> {
  const admin = createAdminClient();

  const { data: profiles, error } = await admin
    .from("profiles")
    .select("id, display_name, locale, created_at")
    .eq("role", "customer")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  const ids = (profiles ?? []).map((p) => (p as { id: string }).id);
  if (ids.length === 0) return [];

  const { data: orders } = await admin
    .from("orders")
    .select("user_id, total_cents")
    .in("user_id", ids);

  const orderCounts = new Map<string, number>();
  const spentByUser = new Map<string, number>();
  for (const row of orders ?? []) {
    const userId = (row as { user_id: string }).user_id;
    const total = (row as { total_cents: number }).total_cents;
    orderCounts.set(userId, (orderCounts.get(userId) ?? 0) + 1);
    spentByUser.set(userId, (spentByUser.get(userId) ?? 0) + total);
  }

  const emailById = await loadAuthEmails(admin);
  const needle = search?.trim().toLowerCase();

  return (profiles ?? [])
    .map((raw) => {
      const p = raw as {
        id: string;
        display_name: string | null;
        locale: string;
        created_at: string;
      };
      return {
        id: p.id,
        email: emailById.get(p.id) ?? "—",
        displayName: p.display_name,
        locale: p.locale,
        orderCount: orderCounts.get(p.id) ?? 0,
        totalSpentCents: spentByUser.get(p.id) ?? 0,
        createdAt: p.created_at,
      };
    })
    .filter((customer) => {
      if (!needle) return true;
      return (
        customer.email.toLowerCase().includes(needle) ||
        (customer.displayName?.toLowerCase().includes(needle) ?? false)
      );
    });
}

export async function getAdminCustomerDetail(
  customerId: string,
): Promise<AdminCustomerDetail | null> {
  const admin = createAdminClient();

  const { data: profile, error } = await admin
    .from("profiles")
    .select("id, display_name, locale, created_at, role")
    .eq("id", customerId)
    .maybeSingle();

  if (error || !profile) return null;

  const p = profile as {
    id: string;
    display_name: string | null;
    locale: string;
    created_at: string;
    role: string;
  };

  if (p.role !== "customer") return null;

  const emailById = await loadAuthEmails(admin);

  const { data: orders, error: ordersError } = await admin
    .from("orders")
    .select(
      `
      id,
      order_number,
      status,
      total_cents,
      currency,
      submitted_at,
      order_items (product_name_snapshot)
    `,
    )
    .eq("user_id", customerId)
    .order("submitted_at", { ascending: false })
    .limit(50);

  if (ordersError) throw ordersError;

  const orderRows: AdminCustomerOrderRow[] = (orders ?? []).map((raw) => {
    const row = raw as {
      id: string;
      order_number: string;
      status: OrderStatus;
      total_cents: number;
      currency: string;
      submitted_at: string;
      order_items: Array<{ product_name_snapshot: Record<string, string> }>;
    };
    const first = row.order_items?.[0]?.product_name_snapshot;
    const productName = first?.en ?? first?.ar ?? "Product";
    return {
      id: row.id,
      orderNumber: row.order_number,
      status: row.status,
      totalCents: row.total_cents,
      currency: row.currency,
      submittedAt: row.submitted_at,
      productSummary:
        row.order_items.length > 1
          ? `${productName} +${row.order_items.length - 1}`
          : productName,
    };
  });

  const totalSpentCents = orderRows.reduce((sum, o) => sum + o.totalCents, 0);

  return {
    id: p.id,
    email: emailById.get(p.id) ?? "—",
    displayName: p.display_name,
    locale: p.locale,
    createdAt: p.created_at,
    orderCount: orderRows.length,
    totalSpentCents,
    orders: orderRows,
  };
}
