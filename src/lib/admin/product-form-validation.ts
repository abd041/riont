const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export type ProductFormClientValues = {
  categoryId: string;
  enName: string;
  enSlug: string;
  arName: string;
  arSlug: string;
  priceDollars: string;
  compareAtDollars: string;
  imageFile: File | null;
};

export function isValidProductSlug(slug: string): boolean {
  return slug.length > 0 && slug.length <= 120 && SLUG_PATTERN.test(slug);
}

export function parsePriceDollars(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  if (Number.isNaN(n) || n < 0) return null;
  return n;
}

export function validateProductFormClient(
  values: ProductFormClientValues,
): string | null {
  if (!values.categoryId) {
    return "Choose a category before saving.";
  }
  if (!values.enName.trim()) {
    return "Enter an English product name.";
  }
  if (!values.arName.trim()) {
    return "Enter an Arabic product name (or use “Copy from English”).";
  }
  if (!isValidProductSlug(values.enSlug.trim())) {
    return "English link name must use lowercase letters, numbers, and hyphens only (e.g. steam-wallet-50).";
  }
  if (!isValidProductSlug(values.arSlug.trim())) {
    return "Arabic link name must use the same format as the English link.";
  }
  const price = parsePriceDollars(values.priceDollars);
  if (price === null || price <= 0) {
    return "Enter a sale price greater than $0.";
  }
  const compare = parsePriceDollars(values.compareAtDollars);
  if (compare !== null && compare > 0 && compare <= price) {
    return "Original price must be higher than the sale price to show a discount.";
  }
  if (values.imageFile && values.imageFile.size > MAX_IMAGE_BYTES) {
    return "Image must be 5 MB or smaller.";
  }
  if (
    values.imageFile &&
    !["image/jpeg", "image/png", "image/webp"].includes(values.imageFile.type)
  ) {
    return "Image must be JPG, PNG, or WebP.";
  }
  return null;
}

export function calcDiscountPercent(
  priceDollars: number,
  compareDollars: number | null,
): number | null {
  if (compareDollars === null || compareDollars <= priceDollars) return null;
  return Math.round(((compareDollars - priceDollars) / compareDollars) * 100);
}

export { MAX_IMAGE_BYTES };
