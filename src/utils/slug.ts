export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Generate a unique slug suffix when collisions occur. */
export function slugWithSuffix(base: string, suffix: string | number): string {
  const slug = slugify(base);
  return slug ? `${slug}-${suffix}` : String(suffix);
}
