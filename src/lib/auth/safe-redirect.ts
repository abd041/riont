import { routing } from "@/i18n/routing";

const LOCALE_PATH = new RegExp(
  `^/(${routing.locales.join("|")})(/|$)`,
);

export function safeAuthRedirectPath(
  next: string | null,
  fallbackLocale: string = routing.defaultLocale,
): string {
  const fallback = `/${fallbackLocale}`;

  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return fallback;
  }

  if (!LOCALE_PATH.test(next)) {
    return fallback;
  }

  return next;
}

export function localeFromAuthPath(path: string): string {
  const match = path.match(LOCALE_PATH);
  return match?.[1] ?? routing.defaultLocale;
}
