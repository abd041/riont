"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BrandLogo } from "@/components/shared/brand-logo";
import { MarketplaceSection } from "./marketplace-section";

export function MarketplaceFooter() {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");

  return (
    <MarketplaceSection
      as="footer"
      className="mp-footer mp-footer--compact"
      aria-label={t("footerNav")}
    >
      <div className="mp-footer__compact-top">
        <Link href="/" className="mp-footer__brand-link" aria-label={tCommon("brand")}>
          <BrandLogo className="nex-brand-logo nex-brand-logo--footer" height={30} />
        </Link>
        <nav className="mp-footer__compact-nav" aria-label={t("footerLegalTitle")}>
          <Link href="/legal/terms">{t("footerTerms")}</Link>
          <Link href="/legal/privacy">{t("footerPrivacy")}</Link>
          <Link href="/legal/refund">{t("footerRefund")}</Link>
          <Link href="/contact">{t("footerContact")}</Link>
          <Link href="/support">{t("footerSupport")}</Link>
        </nav>
      </div>

      <p className="mp-footer__copy">
        © {new Date().getFullYear()} {tCommon("brand")} · {t("footerRights")}
      </p>
    </MarketplaceSection>
  );
}
