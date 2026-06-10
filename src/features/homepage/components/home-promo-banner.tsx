import { getTranslations } from "next-intl/server";
import { PromoBannerShell } from "./promo-banner-shell";

/** Placeholder promo strip above the hero — CMS-editable later. */
export async function HomePromoBanner() {
  const t = await getTranslations("home");

  return <PromoBannerShell text={t("promoBannerPlaceholder")} />;
}
