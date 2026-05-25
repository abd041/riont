"use client";

import { ChevronRight, Tag, Ticket } from "lucide-react";
import { useTranslations } from "next-intl";
import { CheckoutMotionItem } from "./checkout-motion";

export function CheckoutDiscountCard({ pending }: { pending: boolean }) {
  const t = useTranslations("checkout");

  return (
    <CheckoutMotionItem className="nex-co-card nex-co-card--discount">
      <div className="nex-co-card-head">
        <div className="nex-co-card-icon-wrap" aria-hidden>
          <Ticket className="nex-co-card-icon" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="nex-co-card-title">{t("coupon")}</h2>
          <p className="nex-co-card-desc">{t("couponDesc")}</p>
        </div>
      </div>

      <div className="nex-co-card-body">
        <CouponRow pending={pending} t={t} />
        <p className="nex-co-coupon-hint">
          <Tag className="nex-co-coupon-hint-icon" strokeWidth={1.5} aria-hidden />
          {t("couponHint")}
        </p>
      </div>
    </CheckoutMotionItem>
  );
}

function CouponRow({
  pending,
  t,
}: {
  pending: boolean;
  t: ReturnType<typeof useTranslations<"checkout">>;
}) {
  return (
    <div className="nex-co-coupon-row">
      <div className="nex-co-coupon-input-wrap">
        <Ticket className="nex-co-coupon-input-icon" strokeWidth={1.5} aria-hidden />
        <input
          name="couponCode"
          type="text"
          disabled={pending}
          placeholder={t("couponPlaceholder")}
          className="nex-co-coupon-input"
          aria-label={t("coupon")}
        />
      </div>
      <button type="button" className="nex-co-coupon-apply" disabled={pending}>
        {t("applyCoupon")}
        <ChevronRight className="nex-co-coupon-apply-chevron" strokeWidth={2} aria-hidden />
      </button>
    </div>
  );
}
