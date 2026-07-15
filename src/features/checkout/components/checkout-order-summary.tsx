"use client";

import { useMemo, useState } from "react";
import {
  Check,
  ChevronRight,
  Info,
  Loader2,
  Lock,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { CheckoutProduct } from "@/types/order";
import { computeLineExtraFeeCents } from "@/lib/catalog/product-commerce";
import { useCurrency } from "@/features/shared/currency/currency-provider";
import { CheckoutMotionItem } from "./checkout-motion";
import { CheckoutPremiumCheckbox } from "./checkout-premium-checkbox";
import { CheckoutTrustBadges } from "./checkout-trust-badges";

type CheckoutOrderSummaryProps = {
  product: CheckoutProduct;
  locale: string;
  paymentInstructions: string;
  pending: boolean;
  errorMessage: string | null;
  discountCents?: number;
};

export function CheckoutOrderSummary({
  product,
  locale,
  paymentInstructions,
  pending,
  errorMessage,
  discountCents = 0,
}: CheckoutOrderSummaryProps) {
  const t = useTranslations("checkout");
  const { formatPrice, currency } = useCurrency();
  const [termsAccepted, setTermsAccepted] = useState(false);

  const { subtotal, serviceFee, savings, total } = useMemo(() => {
    const sub = product.priceCents;
    const fee = computeLineExtraFeeCents({
      feeType: product.extraFeeType,
      feeValue: product.extraFeeValue,
      lineSubtotalCents: sub,
      quantity: 1,
    });
    const save =
      product.compareAtCents && product.compareAtCents > sub
        ? product.compareAtCents - sub
        : 0;
    return {
      subtotal: sub,
      serviceFee: fee,
      savings: save,
      total: Math.max(0, sub - discountCents + fee),
    };
  }, [
    product.compareAtCents,
    product.extraFeeType,
    product.extraFeeValue,
    product.priceCents,
    discountCents,
  ]);

  const isInstant = product.deliveryMode === "auto";
  const isHybrid = product.deliveryMode === "hybrid";

  return (
    <CheckoutMotionItem className="nex-co-summary-wrap">
      <div className="nex-co-summary">
        <h2 className="nex-co-summary-title">{t("yourOrder")}</h2>

        <div className="nex-co-product">
          <div className="nex-co-product-thumb-wrap">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt=""
                width={88}
                height={88}
                className="nex-co-product-thumb"
              />
            ) : (
              <div className="nex-co-product-thumb nex-co-product-thumb--empty" />
            )}
            <span className="nex-co-product-check" aria-hidden>
              <Check strokeWidth={2.5} />
            </span>
          </div>
          <div className="nex-co-product-meta">
            {product.categoryName ? (
              <span className="nex-co-product-category">{product.categoryName}</span>
            ) : null}
            <h3 className="nex-co-product-name">{product.name}</h3>
            {product.variantName ? (
              <p className="nex-co-product-desc">
                {t("selectedOption")}: {product.variantName}
              </p>
            ) : product.shortDescription ? (
              <p className="nex-co-product-desc">{product.shortDescription}</p>
            ) : null}
            {isInstant || isHybrid ? (
              <span className="nex-co-instant-badge">
                <Zap className="nex-co-instant-icon" strokeWidth={2} aria-hidden />
                {isHybrid ? t("hybridDelivery") : t("instantDelivery")}
              </span>
            ) : (
              <span className="nex-co-instant-badge">
                {t("manualDelivery")}
              </span>
            )}
          </div>
        </div>

        <div className="nex-co-pricing-divider" aria-hidden />

        <dl className="nex-co-pricing">
          <div className="nex-co-price-row">
            <dt>{t("subtotal")}</dt>
            <dd dir="ltr">{formatPrice(subtotal, locale)}</dd>
          </div>
          {serviceFee > 0 ? (
            <div className="nex-co-price-row nex-co-price-row--muted">
              <dt>{t("serviceFee")}</dt>
              <dd dir="ltr">{formatPrice(serviceFee, locale)}</dd>
            </div>
          ) : null}
          {discountCents > 0 && (
            <div className="nex-co-price-row nex-co-price-row--savings">
              <dt>{t("coupon")}</dt>
              <dd dir="ltr">-{formatPrice(discountCents, locale)}</dd>
            </div>
          )}
          <div className="nex-co-price-row nex-co-price-row--savings">
            <dt>{t("savings")}</dt>
            <dd dir="ltr" className={savings <= 0 ? "is-zero" : undefined}>
              -{formatPrice(savings > 0 ? savings : 0, locale)}
            </dd>
          </div>
        </dl>

        <div className="nex-co-total-block">
          <div className="nex-co-total-label-wrap">
            <span className="nex-co-total-label">{t("total")}</span>
            <span className="nex-co-total-currency">{currency}</span>
          </div>
          <span className="nex-co-total-amount" dir="ltr">
            {formatPrice(total, locale)}
          </span>
        </div>

        <div className="nex-co-notice nex-co-notice--model">
          <Info className="nex-co-notice-icon" strokeWidth={1.5} aria-hidden />
          <p>{t("externalPaymentNotice")}</p>
        </div>

        {paymentInstructions ? (
          <div className="nex-co-notice">
            <p className="text-sm text-[var(--text-muted)]">{paymentInstructions}</p>
          </div>
        ) : null}

        <CheckoutPremiumCheckbox
          id="termsAccepted"
          name="termsAccepted"
          checked={termsAccepted}
          onChange={setTermsAccepted}
          disabled={pending}
          label={t("termsLabel")}
        />

        {errorMessage ? (
          <p role="alert" className="nex-co-error">
            {errorMessage}
          </p>
        ) : null}

        <button type="submit" className="nex-co-submit" disabled={pending || !termsAccepted}>
          {pending ? (
            <Loader2 className="nex-co-submit-spinner" aria-hidden />
          ) : (
            <Lock className="nex-co-submit-lock" strokeWidth={1.75} aria-hidden />
          )}
          <span>{pending ? t("submitting") : t("submitOrder")}</span>
          {!pending ? (
            <ChevronRight className="nex-co-submit-arrow" strokeWidth={2} aria-hidden />
          ) : null}
        </button>

        <CheckoutTrustBadges />

        <Link href={`/products/${product.slug}`} className="nex-co-back-link">
          {t("backToProduct")}
        </Link>
      </div>
    </CheckoutMotionItem>
  );
}
