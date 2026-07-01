import { getTranslations, getLocale } from "next-intl/server";
import { getSiteRuntimeSettings } from "@/server/services/site-runtime.service";
import { PromoBannerShell } from "./promo-banner-shell";

export async function HomePromoBanner() {
  const [locale, t, runtime] = await Promise.all([
    getLocale(),
    getTranslations("home"),
    getSiteRuntimeSettings(),
  ]);

  const { features } = runtime;
  if (!features.promoBannerEnabled) {
    return null;
  }

  const fallback = t("promoBannerPlaceholder");
  const text =
    locale === "ar"
      ? features.promoBannerTextAr.trim() ||
        features.promoBannerTextEn.trim() ||
        fallback
      : features.promoBannerTextEn.trim() ||
        features.promoBannerTextAr.trim() ||
        fallback;

  const href = features.promoBannerHref.trim() || undefined;

  return <PromoBannerShell text={text} href={href} />;
}
