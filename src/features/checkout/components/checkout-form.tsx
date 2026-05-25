"use client";

import { useActionState, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  submitOrderAction,
  type OrderActionResult,
} from "@/server/actions/order.actions";
import type { CheckoutProduct } from "@/types/order";
import { CheckoutHeader } from "./checkout-header";
import { CheckoutDetailsCard } from "./checkout-details-card";
import { CheckoutDiscountCard } from "./checkout-discount-card";
import { CheckoutOrderSummary } from "./checkout-order-summary";
import { CheckoutMotionStagger } from "./checkout-motion";

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
  const tOrders = useTranslations("orders.errors");
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [state, action, pending] = useActionState<
    OrderActionResult | null,
    FormData
  >(submitOrderAction, null);

  const errorMessage = useMemo(() => {
    if (!state || state.success) return null;
    if (state.code === "VALIDATION") return tOrders("VALIDATION");
    return tOrders(state.code as "NOT_FOUND");
  }, [state, tOrders]);

  function setField(key: string, value: string) {
    setFieldValues((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="nex-checkout-page">
      <div className="nex-co-ambient nex-co-ambient--one" aria-hidden />
      <div className="nex-co-ambient nex-co-ambient--two" aria-hidden />
      <div className="nex-co-noise" aria-hidden />

      <form action={action} className="nex-co-layout">
        <input type="hidden" name="productSlug" value={product.slug} />
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="quantity" value={1} />
        <input
          type="hidden"
          name="fieldValuesJson"
          value={JSON.stringify(fieldValues)}
          readOnly
        />

        <CheckoutHeader />

        <div className="nex-co-columns">
          <CheckoutMotionStagger className="nex-co-main">
            <CheckoutDetailsCard
              fields={product.fields}
              fieldValues={fieldValues}
              onFieldChange={setField}
              isLoggedIn={isLoggedIn}
              userEmail={userEmail}
              pending={pending}
            />
            <CheckoutDiscountCard pending={pending} />
          </CheckoutMotionStagger>

          <CheckoutOrderSummary
            product={product}
            locale={locale}
            paymentInstructions={paymentInstructions}
            pending={pending}
            errorMessage={errorMessage}
          />
        </div>
      </form>
    </div>
  );
}
