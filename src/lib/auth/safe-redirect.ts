import { routing } from "@/i18n/routing";

const LOCALE_PATH = new RegExp(
  `^/(${routing.locales.join("|")})(/|$)`,
);

const ADMIN_PATH = /^\/admin(\/|$)/;

function isSafeAdminPath(path: string): boolean {
  const pathname = path.split("?")[0]?.split("#")[0] ?? path;
  return ADMIN_PATH.test(pathname);
}

export function safeAuthRedirectPath(
  next: string | null,
  fallbackLocale: string = routing.defaultLocale,
): string {
  const fallback = `/${fallbackLocale}`;

  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return fallback;
  }

  if (isSafeAdminPath(next)) {
    return next;
  }

  if (!LOCALE_PATH.test(next)) {
    return fallback;
  }

  return next;
}

export function localeFromAuthPath(path: string): string {
  if (isSafeAdminPath(path)) {
    return routing.defaultLocale;
  }

  const match = path.match(LOCALE_PATH);
  return match?.[1] ?? routing.defaultLocale;
}
