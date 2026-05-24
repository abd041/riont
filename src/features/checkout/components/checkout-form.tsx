"use client";

import { useActionState, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import {
  submitOrderAction,
  type OrderActionResult,
} from "@/server/actions/order.actions";
import type { CheckoutProduct } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductImage } from "@/features/catalog/components/product-image";
import { useCurrency } from "@/features/currency/components/currency-provider";
import { Link } from "@/i18n/navigation";

export function CheckoutForm({
  product,
  locale,
  paymentInstructions,
  isLoggedIn,
  userEmail,
}: {
  product: CheckoutProduct;
  locale: string;
  paymentInstructions: string;
  isLoggedIn: boolean;
  userEmail?: string | null;
}) {
  const t = useTranslations("checkout");
  const tOrders = useTranslations("orders.errors");
  const { formatPrice } = useCurrency();
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [state, action, pending] = useActionState<
    OrderActionResult | null,
    FormData
  >(submitOrderAction, null);

  const subtotal = product.priceCents;
  const errorMessage = useMemo(() => {
    if (!state || state.success) return null;
    if (state.code === "VALIDATION") return tOrders("VALIDATION");
    return tOrders(state.code as "NOT_FOUND");
  }, [state, tOrders]);

  function setField(key: string, value: string) {
    setFieldValues((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <form action={action} className="grid gap-8 lg:grid-cols-5">
      <input type="hidden" name="productSlug" value={product.slug} />
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="quantity" value={1} />
      <input
        type="hidden"
        name="fieldValuesJson"
        value={JSON.stringify(fieldValues)}
        readOnly
      />

      <div className="space-y-6 lg:col-span-3">
        <div className="glass-card rounded-[var(--radius-lg)] p-6">
          <h2 className="text-lg font-semibold">{t("yourDetails")}</h2>

          {!isLoggedIn && (
            <div className="mt-4">
              <label
                htmlFor="guestEmail"
                className="mb-1 block text-sm text-[var(--text-muted)]"
              >
                {t("guestEmail")}
              </label>
              <Input
                id="guestEmail"
                name="guestEmail"
                type="email"
                required
                defaultValue={userEmail ?? ""}
                disabled={pending}
              />
            </div>
          )}

          {product.fields.map((field) => (
            <div key={field.id} className="mt-4">
              <label
                htmlFor={field.fieldKey}
                className="mb-1 block text-sm text-[var(--text-muted)]"
              >
                {field.label}
                {field.required && <span className="text-red-400"> *</span>}
              </label>
              {field.fieldType === "textarea" ? (
                <textarea
                  id={field.fieldKey}
                  required={field.required}
                  disabled={pending}
                  rows={3}
                  value={fieldValues[field.fieldKey] ?? ""}
                  onChange={(e) => setField(field.fieldKey, e.target.value)}
                  className="flex w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-surface px-3 py-2 text-sm text-[var(--text-primary)]"
                />
              ) : (
                <Input
                  id={field.fieldKey}
                  type={
                    field.fieldType === "password"
                      ? "password"
                      : field.fieldType === "email"
                        ? "email"
                        : "text"
                  }
                  required={field.required}
                  disabled={pending}
                  value={fieldValues[field.fieldKey] ?? ""}
                  onChange={(e) => setField(field.fieldKey, e.target.value)}
                />
              )}
              {field.helpText && (
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {field.helpText}
                </p>
              )}
            </div>
          ))}

          <div className="mt-4">
            <label
              htmlFor="customerNote"
              className="mb-1 block text-sm text-[var(--text-muted)]"
            >
              {t("orderNote")}
            </label>
            <textarea
              id="customerNote"
              name="customerNote"
              rows={2}
              disabled={pending}
              className="flex w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-surface px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="glass-card rounded-[var(--radius-lg)] p-6">
          <h2 className="text-lg font-semibold">{t("coupon")}</h2>
          <Input
            className="mt-3"
            name="couponCode"
            placeholder={t("couponPlaceholder")}
            disabled={pending}
          />
          <p className="mt-2 text-xs text-[var(--text-muted)]">{t("couponHint")}</p>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="glass-card sticky top-24 space-y-4 rounded-[var(--radius-lg)] p-6">
          <div className="flex gap-4">
            <ProductImage
              src={product.imageUrl}
              alt={product.name}
              className="h-20 w-20 shrink-0 rounded-md"
            />
            <div>
              <h2 className="font-semibold">{product.name}</h2>
              {product.shortDescription && (
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  {product.shortDescription}
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-[var(--border-subtle)] pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">{t("subtotal")}</span>
              <span dir="ltr">{formatPrice(subtotal, locale)}</span>
            </div>
            <div className="mt-2 flex justify-between text-base font-semibold">
              <span>{t("total")}</span>
              <span className="text-accent-400" dir="ltr">
                {formatPrice(subtotal, locale)}
              </span>
            </div>
          </div>

          <div className="rounded-md border border-[var(--border-subtle)] bg-surface-2 p-3 text-xs text-[var(--text-muted)]">
            {paymentInstructions}
          </div>

          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              name="termsAccepted"
              value="on"
              required
              disabled={pending}
              className="mt-1"
            />
            <span>{t("termsLabel")}</span>
          </label>

          {errorMessage && (
            <p role="alert" className="text-sm text-red-400">
              {errorMessage}
            </p>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={pending}>
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            {pending ? t("submitting") : t("submitOrder")}
          </Button>

          <Button variant="ghost" className="w-full" asChild>
            <Link href={`/products/${product.slug}`}>{t("backToProduct")}</Link>
          </Button>
        </div>
      </div>
    </form>
  );
}
