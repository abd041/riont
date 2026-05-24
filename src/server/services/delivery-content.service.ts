import { createAdminClient } from "@/lib/supabase/admin";
import { decryptInventory } from "@/lib/encryption/inventory";

export async function getCustomerDeliveryForItem(
  orderItemId: string,
): Promise<string | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("delivery_logs")
    .select("delivered_payload_encrypted, log_type")
    .eq("order_item_id", orderItemId)
    .in("log_type", ["auto_delivered", "manual_delivered"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;

  const encrypted = (data as { delivered_payload_encrypted: string | null })
    .delivered_payload_encrypted;
  if (!encrypted) return null;

  return decryptInventory(encrypted);
}
