"use client";

import { useLocale } from "next-intl";
import { useCurrency } from "@/features/currency/components/currency-provider";

export function OrderAmount({
  cents,
  className,
}: {
  cents: number;
  className?: string;
}) {
  const locale = useLocale();
  const { formatPrice } = useCurrency();

  return (
    <span className={className} dir="ltr">
      {formatPrice(cents, locale)}
    </span>
  );
}

export function OrderSummaryPricing({
  subtotalCents,
  discountCents,
  totalCents,
  labels,
}: {
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
  labels: { subtotal: string; discount: string; total: string };
}) {
  return (
    <dl className="mt-4 space-y-2 text-sm">
      <div className="flex justify-between">
        <dt className="text-[var(--text-muted)]">{labels.subtotal}</dt>
        <dd>
          <OrderAmount cents={subtotalCents} />
        </dd>
      </div>
      {discountCents > 0 && (
        <div className="flex justify-between">
          <dt className="text-[var(--text-muted)]">{labels.discount}</dt>
          <dd className="text-emerald-400">
            -
            <OrderAmount cents={discountCents} />
          </dd>
        </div>
      )}
      <div className="flex justify-between border-t border-[var(--border-subtle)] pt-2 text-base font-semibold">
        <dt>{labels.total}</dt>
        <dd className="text-accent-400">
          <OrderAmount cents={totalCents} />
        </dd>
      </div>
    </dl>
  );
}
