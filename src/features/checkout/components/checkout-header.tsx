"use client";

import { ArrowLeft, Lock, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CheckoutMotionSection } from "./checkout-motion";

type CheckoutHeaderProps = {
  productSlug: string;
  productName: string;
};

export function CheckoutHeader({ productSlug, productName }: CheckoutHeaderProps) {
  const t = useTranslations("checkout");

  return (
    <CheckoutMotionSection className="nex-co-header">
      <div className="nex-co-header-top">
        <Link
          href={`/products/${productSlug}`}
          className="sf-page__back nex-co-back"
          aria-label={t("backToProduct")}
        >
          <ArrowLeft strokeWidth={1.5} />
        </Link>

        <div className="nex-co-header-left">
          <div className="nex-co-header-icon-wrap" aria-hidden>
            <ShieldCheck className="nex-co-header-icon" strokeWidth={1.35} />
          </div>
          <div>
            <p className="nex-co-header-product">{productName}</p>
            <h1 className="nex-co-header-title">{t("secureTitle")}</h1>
            <p className="nex-co-header-subtitle">{t("secureSubtitle")}</p>
          </div>
        </div>
      </div>

      <div className="nex-co-header-security">
        <Lock className="nex-co-header-lock" strokeWidth={1.5} aria-hidden />
        <span className="nex-co-header-secure-label">{t("securePayment")}</span>
        <span className="nex-co-header-ssl">{t("sslEncrypted")}</span>
      </div>
    </CheckoutMotionSection>
  );
}
