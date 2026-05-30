"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MarketplaceSection } from "./marketplace-section";

const PAYMENT_METHODS = ["Visa", "Mastercard", "Apple Pay", "Mada"] as const;

export function MarketplaceFooter() {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");

  return (
    <MarketplaceSection as="footer" className="mp-footer" aria-label={t("footerNav")}>
      <div className="mp-footer__grid">
        <div className="mp-footer__brand-block">
          <p className="mp-footer__brand">{tCommon("brand")}</p>
          <p className="mp-footer__tagline">{t("footerTagline")}</p>
          <p className="mp-footer__about">{t("footerAbout")}</p>
        </div>

        <nav className="mp-footer__col" aria-label={t("footerShopTitle")}>
          <p className="mp-footer__col-title">{t("footerShopTitle")}</p>
          <Link href="/products">{t("footerBrowse")}</Link>
          <Link href="/categories">{t("footerCategories")}</Link>
          <Link href="/support">{t("footerSupport")}</Link>
        </nav>

        <nav className="mp-footer__col" aria-label={t("footerLegalTitle")}>
          <p className="mp-footer__col-title">{t("footerLegalTitle")}</p>
          <Link href="/legal/terms">{t("footerTerms")}</Link>
          <Link href="/legal/privacy">{t("footerPrivacy")}</Link>
          <Link href="/legal/refund">{t("footerRefund")}</Link>
          <Link href="/contact">{t("footerContact")}</Link>
        </nav>
      </div>

      <div className="mp-footer__payments" aria-label={t("footerPaymentsTitle")}>
        {PAYMENT_METHODS.map((method) => (
          <span key={method} className="mp-footer__payment">
            {method}
          </span>
        ))}
      </div>

      <p className="mp-footer__copy">
        © {new Date().getFullYear()} {tCommon("brand")} · {t("footerRights")}
      </p>
    </MarketplaceSection>
  );
}
