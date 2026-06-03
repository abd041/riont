import { createAdminClient } from "@/lib/supabase/admin";
import { encryptInventory } from "@/lib/encryption/inventory";

export async function getAvailableStockCounts(
  productIds: string[],
): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  if (productIds.length === 0) return map;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("delivery_inventory")
    .select("product_id")
    .in("product_id", productIds)
    .eq("status", "available");

  if (error) throw error;

  for (const row of data ?? []) {
    const id = (row as { product_id: string }).product_id;
    map.set(id, (map.get(id) ?? 0) + 1);
  }

  for (const id of productIds) {
    if (!map.has(id)) map.set(id, 0);
  }

  return map;
}

export async function getAvailableStock(productId: string): Promise<number> {
  const admin = createAdminClient();
  const { count, error } = await admin
    .from("delivery_inventory")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId)
    .eq("status", "available");

  if (error) throw error;
  return count ?? 0;
}

export async function addInventoryLines(
  productId: string,
  payloads: string[],
): Promise<number> {
  const admin = createAdminClient();
  const rows = payloads
    .map((p) => p.trim())
    .filter(Boolean)
    .map((payload) => ({
      product_id: productId,
      status: "available" as const,
      payload_encrypted: encryptInventory(payload),
      payload_version: 1,
    }));

  if (rows.length === 0) return 0;

  const { error } = await admin.from("delivery_inventory").insert(rows);
  if (error) throw error;
  return rows.length;
}

export async function getAllocatedPayloads(
  orderItemId: string,
): Promise<string[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("delivery_inventory")
    .select("payload_encrypted")
    .eq("order_item_id", orderItemId)
    .in("status", ["allocated", "delivered"]);

  if (error) throw error;

  const { decryptInventory } = await import("@/lib/encryption/inventory");
  return (data ?? []).map((row) =>
    decryptInventory((row as { payload_encrypted: string }).payload_encrypted),
  );
}
