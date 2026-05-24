import { createHash, randomBytes } from "crypto";

export function generateTicketNumber(): string {
  const date = new Date();
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  const suffix = randomBytes(3).toString("hex").toUpperCase();
  return `TKT-${y}${m}${d}-${suffix}`;
}

export function generateOrderNumber(): string {
  const date = new Date();
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  const suffix = randomBytes(3).toString("hex").toUpperCase();
  return `RNT-${y}${m}${d}-${suffix}`;
}

export function generateGuestAccessToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashGuestToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
