import { slugify } from "@/utils/slug";

/** URL-safe slug from a product name (English). Never returns empty. */
export function slugifyProductName(name: string): string {
  const base = slugify(
    name
      .trim()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, ""),
  );
  if (base) return base.slice(0, 120);
  return `product-${Date.now().toString(36).slice(-6)}`;
}
