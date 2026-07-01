"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Shield,
  Zap,
  Headphones,
  Mail,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { BrandLogo } from "@/components/shared/brand-logo";
import { useSiteStore } from "@/components/providers/site-store-provider";
import { MarketplaceSection } from "./marketplace-section";

const PAYMENT_METHODS = ["Visa", "Mastercard", "Apple Pay", "Mada"] as const;

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

type SocialItem = {
  key: string;
  href: string;
  labelKey: "footerSocialX" | "footerSocialDiscord" | "footerSocialInstagram" | "footerSocialEmail";
  icon: LucideIcon | typeof XIcon;
};

export function MarketplaceFooter() {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const { features, socialLinks } = useSiteStore();

  function handleNewsletter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    toast.success(t("footerNewsletterBtn"));
    e.currentTarget.reset();
  }

  const socialItems: SocialItem[] = [];
  if (socialLinks.twitter) {
    socialItems.push({
      key: "twitter",
      href: socialLinks.twitter,
      labelKey: "footerSocialX",
      icon: XIcon,
    });
  }
  if (socialLinks.discord) {
    socialItems.push({
      key: "discord",
      href: socialLinks.discord,
      labelKey: "footerSocialDiscord",
      icon: DiscordIcon,
    });
  }
  if (socialLinks.instagram) {
    socialItems.push({
      key: "instagram",
      href: socialLinks.instagram,
      labelKey: "footerSocialInstagram",
      icon: InstagramIcon,
    });
  }
  if (socialLinks.email) {
    socialItems.push({
      key: "email",
      href: socialLinks.email,
      labelKey: "footerSocialEmail",
      icon: Mail,
    });
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

          {features.showFooterSocial && socialItems.length > 0 && (
            <div className="mp-footer__social" aria-label={t("footerSocialTitle")}>
              {socialItems.map(({ key, href, labelKey, icon: Icon }) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mp-footer__social-link"
                  aria-label={t(labelKey)}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </a>
              ))}
            </div>
          )}
        </div>

        {features.showFooterNewsletter && (
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
        )}

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
