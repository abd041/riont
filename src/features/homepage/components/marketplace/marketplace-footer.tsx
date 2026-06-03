"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Shield, Zap, Headphones, Globe, Mail, Share2 } from "lucide-react";
import { toast } from "sonner";
import { BrandLogo } from "@/components/shared/brand-logo";
import { MarketplaceSection } from "./marketplace-section";

const PAYMENT_METHODS = ["Visa", "Mastercard", "Apple Pay", "Mada"] as const;

const SOCIAL_LINKS = [
  { icon: Globe, href: "https://twitter.com", label: "X" },
  { icon: Share2, href: "https://discord.com", label: "Discord" },
  { icon: Mail, href: "mailto:support@riont.com", label: "Email" },
] as const;

export function MarketplaceFooter() {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");

  function handleNewsletter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    toast.success(t("footerNewsletterBtn"));
    e.currentTarget.reset();
  }

  return (
    <MarketplaceSection
      as="footer"
      className="mp-footer mp-footer--premium"
      aria-label={t("footerNav")}
    >
      <div className="mp-footer__grid">
        <div className="mp-footer__brand-block">
          <Link href="/" className="mp-footer__brand-link" aria-label={tCommon("brand")}>
            <BrandLogo className="nex-brand-logo nex-brand-logo--footer" height={34} />
          </Link>
          <p className="mp-footer__tagline">{t("footerTagline")}</p>
          <p className="mp-footer__about">{t("footerAbout")}</p>

          <div className="mp-footer__trust-badges">
            <span className="mp-footer__trust-badge">
              <Shield className="h-3 w-3" strokeWidth={2} />
              {t("footerTrustSecure")}
            </span>
            <span className="mp-footer__trust-badge">
              <Zap className="h-3 w-3" strokeWidth={2} />
              {t("footerTrustInstant")}
            </span>
            <span className="mp-footer__trust-badge">
              <Headphones className="h-3 w-3" strokeWidth={2} />
              {t("footerTrustSupport")}
            </span>
          </div>

          <div className="mp-footer__social" aria-label={t("footerSocialTitle")}>
            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="mp-footer__social-link"
                aria-label={label}
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
              </a>
            ))}
          </div>
        </div>

        <div className="mp-footer__newsletter">
          <p className="mp-footer__newsletter-title">{t("footerNewsletterTitle")}</p>
          <p className="mp-footer__newsletter-desc">{t("footerNewsletterDesc")}</p>
          <form className="mp-footer__newsletter-form" onSubmit={handleNewsletter}>
            <input
              type="email"
              name="email"
              required
              placeholder={t("footerNewsletterPlaceholder")}
              className="mp-footer__newsletter-input"
              autoComplete="email"
            />
            <button type="submit" className="mp-footer__newsletter-btn">
              {t("footerNewsletterBtn")}
            </button>
          </form>
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
