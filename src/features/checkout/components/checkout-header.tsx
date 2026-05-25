"use client";

import { Lock, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { CheckoutMotionSection } from "./checkout-motion";

export function CheckoutHeader() {
  const t = useTranslations("checkout");

  return (
    <CheckoutMotionSection className="nex-co-header">
      <div className="nex-co-header-left">
        <div className="nex-co-header-icon-wrap" aria-hidden>
          <ShieldCheck className="nex-co-header-icon" strokeWidth={1.35} />
        </div>
        <div>
          <h1 className="nex-co-header-title">{t("secureTitle")}</h1>
          <p className="nex-co-header-subtitle">{t("secureSubtitle")}</p>
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
