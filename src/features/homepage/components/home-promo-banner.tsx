import { getTranslations } from "next-intl/server";

/** Placeholder promo strip above the hero — CMS-editable later. */
export async function HomePromoBanner() {
  const t = await getTranslations("home");

  return (
    <div className="mp-promo-banner" role="banner">
      <span className="mp-promo-banner__glow" aria-hidden />
      <p className="mp-promo-banner__text">{t("promoBannerPlaceholder")}</p>
    </div>
  );
}
