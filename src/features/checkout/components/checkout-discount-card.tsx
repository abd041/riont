"use client";

import { useState } from "react";
import { ChevronRight, Tag, Ticket } from "lucide-react";
import { useTranslations } from "next-intl";
import { quoteCouponAction } from "@/server/actions/coupon.actions";
import { CheckoutMotionItem } from "./checkout-motion";

type CheckoutDiscountCardProps = {
  pending: boolean;
  subtotalCents: number;
  onQuoted?: (discount: { code: string; discountCents: number } | null) => void;
};

export function CheckoutDiscountCard({
  pending,
  subtotalCents,
  onQuoted,
}: CheckoutDiscountCardProps) {
  const t = useTranslations("checkout");
  const tOrders = useTranslations("orders.errors");

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
        <CouponRow
          pending={pending}
          subtotalCents={subtotalCents}
          onQuoted={onQuoted}
          t={t}
          tOrders={tOrders}
        />
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
  subtotalCents,
  onQuoted,
  t,
  tOrders,
}: {
  pending: boolean;
  subtotalCents: number;
  onQuoted?: (discount: { code: string; discountCents: number } | null) => void;
  t: ReturnType<typeof useTranslations<"checkout">>;
  tOrders: ReturnType<typeof useTranslations<"orders.errors">>;
}) {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);

  async function handleApply() {
    setMessage(null);
    const trimmed = code.trim();
    if (!trimmed) {
      setAppliedCode(null);
      onQuoted?.(null);
      return;
    }

    const result = await quoteCouponAction(trimmed, subtotalCents);
    if (!result.success) {
      const errKey = `COUPON_${result.code}` as
        | "COUPON_INVALID"
        | "COUPON_EXPIRED"
        | "COUPON_INACTIVE"
        | "COUPON_MIN_ORDER"
        | "COUPON_USAGE_LIMIT";
      setMessage(tOrders(errKey));
      setAppliedCode(null);
      onQuoted?.(null);
      return;
    }

    setAppliedCode(result.code);
    setMessage(t("couponApplied", { code: result.code }));
    onQuoted?.({ code: result.code, discountCents: result.discountCents });
  }

  return (
    <div className="nex-co-coupon-row">
      <div className="nex-co-coupon-input-wrap">
        <Ticket className="nex-co-coupon-input-icon" strokeWidth={1.5} aria-hidden />
        <input
          name="couponCode"
          type="text"
          disabled={pending}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={t("couponPlaceholder")}
          className="nex-co-coupon-input"
          aria-label={t("coupon")}
        />
      </div>
      <button
        type="button"
        className="nex-co-coupon-apply"
        disabled={pending}
        onClick={handleApply}
      >
        {t("applyCoupon")}
        <ChevronRight className="nex-co-coupon-apply-chevron" strokeWidth={2} aria-hidden />
      </button>
      {message ? (
        <p
          className={`nex-co-coupon-msg ${appliedCode ? "nex-co-coupon-msg--ok" : "nex-co-coupon-msg--err"}`}
          role="status"
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
