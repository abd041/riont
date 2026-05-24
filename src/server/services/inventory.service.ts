import { createAdminClient } from "@/lib/supabase/admin";
import { encryptInventory } from "@/lib/encryption/inventory";

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
