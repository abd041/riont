"use client";

import { useTranslations } from "next-intl";

const PAYMENT_METHOD_VALUES = [
  "bank_transfer",
  "whatsapp",
  "cash",
  "other",
] as const;

export function CheckoutPaymentMethodField({ pending }: { pending: boolean }) {
  const t = useTranslations("checkout");

  return (
    <div className="nex-co-field">
      <label htmlFor="paymentMethod" className="nex-co-label">
        {t("paymentMethod")}
      </label>
      <select
        id="paymentMethod"
        name="paymentMethod"
        disabled={pending}
        className="nex-co-input"
        defaultValue=""
      >
        <option value="">{t("paymentMethodPlaceholder")}</option>
        {PAYMENT_METHOD_VALUES.map((value) => (
          <option key={value} value={value}>
            {t(`paymentMethods.${value}`)}
          </option>
        ))}
      </select>
      <p className="nex-co-field-hint">{t("paymentMethodHint")}</p>
    </div>
  );
}
