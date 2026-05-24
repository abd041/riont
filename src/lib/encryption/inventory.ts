import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";

const DEV_FALLBACK = "dev-only-inventory-encryption-key";

function getEncryptionKey(): Buffer {
  const secret =
    process.env.INVENTORY_ENCRYPTION_KEY ??
    process.env.FIELD_ENCRYPTION_KEY ??
    DEV_FALLBACK;
  if (
    process.env.NODE_ENV === "production" &&
    (!process.env.INVENTORY_ENCRYPTION_KEY ||
      secret === DEV_FALLBACK)
  ) {
    throw new Error("INVENTORY_ENCRYPTION_KEY is required in production");
  }
  return scryptSync(secret, "riont-inventory-v1", 32);
}

export function encryptInventory(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

export function decryptInventory(payload: string): string {
  const key = getEncryptionKey();
  const buf = Buffer.from(payload, "base64");
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const data = buf.subarray(28);
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString(
    "utf8",
  );
}
