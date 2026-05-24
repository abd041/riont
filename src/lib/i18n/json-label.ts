export type LocalizedLabel = Record<string, string>;

export function resolveLocalizedLabel(
  label: LocalizedLabel | string | null | undefined,
  locale: string,
  fallback = "",
): string {
  if (!label) return fallback;
  if (typeof label === "string") return label;
  return label[locale] ?? label.en ?? label.ar ?? fallback;
}
