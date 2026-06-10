import { cookies, headers } from "next/headers";
import { routing } from "@/i18n/routing";

function isSupportedLocale(value: string | undefined): value is (typeof routing.locales)[number] {
  return Boolean(value && routing.locales.includes(value as (typeof routing.locales)[number]));
}

function localeFromAcceptLanguage(acceptLanguage: string | null): string | null {
  if (!acceptLanguage) return null;

  for (const part of acceptLanguage.split(",")) {
    const tag = part.trim().split(";")[0]?.toLowerCase();
    if (!tag) continue;
    if (tag === "ar" || tag.startsWith("ar-")) return "ar";
    if (tag === "en" || tag.startsWith("en-")) return "en";
  }

  return null;
}

/** Locale for routes outside `[locale]` (e.g. `/admin`) — cookie, then Accept-Language. */
export async function resolveRequestLocale(): Promise<string> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
  if (isSupportedLocale(cookieLocale)) {
    return cookieLocale;
  }

  const headerStore = await headers();
  const fromHeader = localeFromAcceptLanguage(headerStore.get("accept-language"));
  if (fromHeader) {
    return fromHeader;
  }

  return routing.defaultLocale;
}
