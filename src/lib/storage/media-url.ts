const BUCKET = "product-images";
const SUPPORT_BUCKET = "support-attachments";

/**
 * Resolves product/category media paths:
 * - Absolute URL (Supabase Storage upload or external CDN)
 * - `catalog/...` → public folder served by Next.js
 * - Otherwise → Supabase public bucket path
 */
export function resolveMediaUrl(storagePath: string): string {
  if (storagePath.startsWith("http://") || storagePath.startsWith("https://")) {
    return storagePath;
  }

  const normalized = storagePath.replace(/^\//, "");

  if (normalized.startsWith("catalog/")) {
    return `/${normalized}`;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    return `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${normalized}`;
  }

  return `/${normalized}`;
}

export function resolveSupportAttachmentUrl(storagePath: string): string {
  const normalized = storagePath.replace(/^\//, "");
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    return `${supabaseUrl}/storage/v1/object/public/${SUPPORT_BUCKET}/${normalized}`;
  }
  return `/${normalized}`;
}

export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
