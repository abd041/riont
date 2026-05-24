import { createAdminClient } from "@/lib/supabase/admin";

export type AdminCustomerListItem = {
  id: string;
  email: string;
  displayName: string | null;
  locale: string;
  orderCount: number;
  createdAt: string;
};

export async function listAdminCustomers(limit = 100): Promise<AdminCustomerListItem[]> {
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
    .select("user_id")
    .in("user_id", ids);

  const orderCounts = new Map<string, number>();
  for (const row of orders ?? []) {
    const userId = (row as { user_id: string }).user_id;
    orderCounts.set(userId, (orderCounts.get(userId) ?? 0) + 1);
  }

  const { data: authData, error: authError } =
    await admin.auth.admin.listUsers({ perPage: 1000 });

  if (authError) throw authError;

  const emailById = new Map(
    (authData.users ?? []).map((u) => [u.id, u.email ?? ""]),
  );

  return (profiles ?? []).map((raw) => {
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
      createdAt: p.created_at,
    };
  });
}
