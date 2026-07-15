"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Loader2, Lock } from "lucide-react";
import type { CartCheckoutLine } from "@/types/order";
import type { CartLine } from "@/features/cart/types";
import {
  loadCartCheckoutLines,
  submitCartOrderAction,
  type CartCheckoutActionResult,
} from "@/server/actions/cart-checkout.actions";
import { CheckoutDiscountCard } from "@/features/checkout/components/checkout-discount-card";
import { CheckoutPremiumCheckbox } from "@/features/checkout/components/checkout-premium-checkbox";
import { CheckoutDynamicField } from "@/features/checkout/components/checkout-details-card";
import { CheckoutPaymentMethodField } from "@/features/checkout/components/checkout-payment-method-field";
import { useCurrency } from "@/features/shared/currency/currency-provider";
import { computeLineExtraFeeCents } from "@/lib/catalog/product-commerce";

export function CartCheckoutForm({
  cartItems,
  locale,
  paymentInstructions,
  isLoggedIn,
  userEmail,
}: {
  cartItems: CartLine[];
  locale: string;
  paymentInstructions: string;
  isLoggedIn: boolean;
  userEmail?: string | null;
}) {
  const t = useTranslations("checkout");
  const tCart = useTranslations("cart");
  const tOrders = useTranslations("orders.errors");
  const { formatPrice } = useCurrency();

  const [lines, setLines] = useState<CartCheckoutLine[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [fieldValuesBySlug, setFieldValuesBySlug] = useState<
    Record<string, Record<string, string>>
  >({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [couponDiscountCents, setCouponDiscountCents] = useState(0);

  const [state, action, pending] = useActionState<
    CartCheckoutActionResult | null,
    FormData
  >(submitCartOrderAction, null);

  useEffect(() => {
    let cancelled = false;
    void loadCartCheckoutLines(
      locale,
      cartItems.map((item) => ({
        slug: item.slug,
        quantity: item.quantity,
        variantId: item.variantId ?? undefined,
      })),
    )
      .then((data) => {
        if (!cancelled) setLines(data);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [cartItems, locale]);

  const errorMessage = useMemo(() => {
    if (!state || state.success) return null;
    if (state.code === "VALIDATION") return tOrders("VALIDATION");
    return tOrders(state.code as "NOT_FOUND");
  }, [state, tOrders]);

  const subtotalCents = useMemo(
    () =>
      (lines ?? []).reduce(
        (sum, line) => sum + line.priceCents * line.quantity,
        0,
      ),
    [lines],
  );

  const feeCents = useMemo(
    () =>
      (lines ?? []).reduce((sum, line) => {
        const lineSub = line.priceCents * line.quantity;
        return (
          sum +
          computeLineExtraFeeCents({
            feeType: line.extraFeeType,
            feeValue: line.extraFeeValue,
            lineSubtotalCents: lineSub,
            quantity: line.quantity,
          })
        );
      }, 0),
    [lines],
  );

  function setField(slug: string, key: string, value: string) {
    setFieldValuesBySlug((prev) => ({
      ...prev,
      [slug]: { ...(prev[slug] ?? {}), [key]: value },
    }));
  }

  const itemsJson = JSON.stringify(
    cartItems.map((item) => ({
      productSlug: item.slug,
      quantity: item.quantity,
      variantId: item.variantId ?? undefined,
    })),
  );

  if (loadError) {
    return (
      <div className="nex-checkout-page">
        <p className="nex-co-error">{tOrders("NOT_FOUND")}</p>
        <Link href="/cart" className="nex-co-back-link">
          {tCart("backToCart")}
        </Link>
      </div>
    );
  }

  if (!lines) {
    return (
      <div className="nex-checkout-page flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--text-muted)]" aria-hidden />
      </div>
    );
  }

  return (
    <div className="nex-checkout-page">
      <div className="nex-co-ambient nex-co-ambient--one" aria-hidden />
      <div className="nex-co-ambient nex-co-ambient--two" aria-hidden />
      <div className="nex-co-noise" aria-hidden />

      <form action={action} className="nex-co-layout">
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="itemsJson" value={itemsJson} readOnly />
        <input
          type="hidden"
          name="fieldValuesBySlugJson"
          value={JSON.stringify(fieldValuesBySlug)}
          readOnly
        />

        <header className="nex-co-header">
          <Link href="/cart" className="nex-co-back" aria-label={tCart("backToCart")}>
            <ArrowLeft strokeWidth={1.5} />
          </Link>
          <div>
            <h1 className="nex-co-title">{tCart("checkoutTitle")}</h1>
            <p className="nex-co-subtitle">{tCart("checkoutSubtitle")}</p>
          </div>
        </header>

        <div className="nex-co-columns">
          <div className="nex-co-main space-y-4">
            <div className="nex-co-card nex-co-card--details">
              <div className="nex-co-card-body">
                {!isLoggedIn && (
                  <div className="nex-co-field">
                    <label htmlFor="guestEmail" className="nex-co-label">
                      {t("guestEmail")}
                    </label>
                    <input
                      id="guestEmail"
                      name="guestEmail"
                      type="email"
                      required
                      defaultValue={userEmail ?? ""}
                      disabled={pending}
                      className="nex-co-input"
                      placeholder={t("guestEmailPlaceholder")}
                    />
                  </div>
                )}

                {lines.map((line) =>
                  line.fields.length > 0 ? (
                    <div key={line.slug} className="nex-cart-checkout-product-fields">
                      <p className="nex-co-label mb-2">{line.name}</p>
                      {line.fields.map((field) => (
                        <CheckoutDynamicField
                          key={`${line.slug}-${field.id}`}
                          inputId={`${line.slug}-${field.fieldKey}`}
                          field={field}
                          fieldValues={fieldValuesBySlug[line.slug] ?? {}}
                          onFieldChange={(key, value) => setField(line.slug, key, value)}
                          pending={pending}
                        />
                      ))}
                    </div>
                  ) : null,
                )}

                <CheckoutPaymentMethodField pending={pending} />

                <div className="nex-co-field">
                  <label htmlFor="customerNote" className="nex-co-label">
                    {t("orderNote")}
                  </label>
                  <textarea
                    id="customerNote"
                    name="customerNote"
                    rows={3}
                    disabled={pending}
                    className="nex-co-textarea"
                    placeholder={t("orderNotePlaceholder")}
                  />
                </div>
              </div>
            </div>

            <CheckoutDiscountCard
              pending={pending}
              subtotalCents={subtotalCents}
              onQuoted={(quote) => setCouponDiscountCents(quote?.discountCents ?? 0)}
            />
          </div>

          <aside className="nex-co-summary-wrap">
            <div className="nex-co-summary">
              <h2 className="nex-co-summary-title">{t("yourOrder")}</h2>
              <ul className="nex-cart-checkout-lines">
                {lines.map((line) => (
                  <li key={line.slug} className="nex-cart-checkout-line">
                    <div className="nex-co-product-thumb-wrap">
                      {line.imageUrl ? (
                        <Image
                          src={line.imageUrl}
                          alt=""
                          width={56}
                          height={56}
                          className="nex-co-product-thumb"
                        />
                      ) : (
                        <div className="nex-co-product-thumb nex-co-product-thumb--empty" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="nex-co-product-name text-sm">{line.name}</p>
                      {line.variantName ? (
                        <p className="text-xs text-[var(--text-muted)]">
                          {line.variantName} · ×{line.quantity}
                        </p>
                      ) : (
                        <p className="text-xs text-[var(--text-muted)]">
                          ×{line.quantity}
                        </p>
                      )}
                    </div>
                    <span dir="ltr" className="text-sm font-medium">
                      {formatPrice(line.priceCents * line.quantity, locale)}
                    </span>
                  </li>
                ))}
              </ul>

              <dl className="nex-co-pricing">
                <div className="nex-co-price-row">
                  <dt>{t("subtotal")}</dt>
                  <dd dir="ltr">{formatPrice(subtotalCents, locale)}</dd>
                </div>
                {feeCents > 0 ? (
                  <div className="nex-co-price-row nex-co-price-row--muted">
                    <dt>{t("serviceFee")}</dt>
                    <dd dir="ltr">{formatPrice(feeCents, locale)}</dd>
                  </div>
                ) : null}
              </dl>

              {couponDiscountCents > 0 && (
                <div className="nex-co-price-row nex-co-price-row--savings">
                  <span>{t("coupon")}</span>
                  <span dir="ltr">-{formatPrice(couponDiscountCents, locale)}</span>
                </div>
              )}
              <div className="nex-co-total-block">
                <span className="nex-co-total-label">{t("total")}</span>
                <span className="nex-co-total-amount" dir="ltr">
                  {formatPrice(
                    Math.max(0, subtotalCents - couponDiscountCents + feeCents),
                    locale,
                  )}
                </span>
              </div>

              <div className="nex-co-notice nex-co-notice--model">
                <p className="text-sm">{t("externalPaymentNotice")}</p>
              </div>
              {paymentInstructions ? (
                <div className="nex-co-notice">
                  <p className="text-sm text-[var(--text-muted)]">{paymentInstructions}</p>
                </div>
              ) : null}

              <CheckoutPremiumCheckbox
                id="cartTermsAccepted"
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

              <button
                type="submit"
                className="nex-co-submit"
                disabled={pending || !termsAccepted}
              >
                <Lock className="nex-co-submit-lock" strokeWidth={1.75} aria-hidden />
                <span>{pending ? t("submitting") : t("submitOrder")}</span>
              </button>

              <Link href="/cart" className="nex-co-back-link">
                {tCart("backToCart")}
              </Link>
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
}
