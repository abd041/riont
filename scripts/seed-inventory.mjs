/**
 * Seeds demo delivery_inventory for auto-delivery products.
 * Requires .env.local with SUPABASE_SERVICE_ROLE_KEY and encryption keys.
 *
 * Usage: node scripts/seed-inventory.mjs
 */
import { createCipheriv, randomBytes, scryptSync } from "crypto";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) {
    console.error("Missing .env.local");
    process.exit(1);
  }
  const text = readFileSync(path, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function encryptInventory(plaintext) {
  const secret =
    process.env.INVENTORY_ENCRYPTION_KEY ??
    process.env.FIELD_ENCRYPTION_KEY ??
    "dev-only-inventory-encryption-key";
  const key = scryptSync(secret, "riont-inventory-v1", 32);
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

const DEMO_LINES = {
  "b0000000-0000-4000-8000-000000000002": [
    "steam-user-demo-1@example.com | password: DemoSteam1!",
    "steam-user-demo-2@example.com | password: DemoSteam2!",
    "steam-user-demo-3@example.com | password: DemoSteam3!",
  ],
  "b0000000-0000-4000-8000-000000000003": [
    "SPOTIFY-REDEEM-DEMO-AAAA-BBBB",
    "SPOTIFY-REDEEM-DEMO-CCCC-DDDD",
    "SPOTIFY-REDEEM-DEMO-EEEE-FFFF",
  ],
  "b0000000-0000-4000-8000-000000000004": [
    "WIN11-PRO-KEY-DEMO-1111-2222",
    "WIN11-PRO-KEY-DEMO-3333-4444",
    "WIN11-PRO-KEY-DEMO-5555-6666",
  ],
};

async function main() {
  loadEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const supabase = createClient(url, key);

  for (const [productId, lines] of Object.entries(DEMO_LINES)) {
    const rows = lines.map((payload) => ({
      product_id: productId,
      status: "available",
      payload_encrypted: encryptInventory(payload),
      payload_version: 1,
    }));

    const { error } = await supabase.from("delivery_inventory").insert(rows);
    if (error) {
      console.error(`Failed for ${productId}:`, error.message);
      process.exit(1);
    }
    console.log(`Inserted ${rows.length} lines for ${productId}`);
  }

  console.log("Done. Demo inventory is ready for auto-delivery products.");
}

main();
