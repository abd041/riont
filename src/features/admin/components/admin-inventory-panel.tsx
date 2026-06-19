"use client";

import { AdminActionForm } from "./admin-action-form";
import { addInventoryAction } from "@/server/actions/admin-order.actions";

export function AdminInventoryPanel({
  productId,
  productName,
  availableStock,
}: {
  productId: string;
  productName: string;
  availableStock: number;
}) {
  return (
    <div className="admin-panel admin-panel--flat">
      <h2 className="font-semibold">Stock &amp; codes — {productName}</h2>
      <p className="mt-1 text-sm text-[var(--text-muted)]">
        Automatic delivery pulls from this pool. Available:{" "}
        <span className="text-accent-400">{availableStock}</span>
      </p>
      <p className="mt-1 text-xs text-[var(--text-muted)]">
        Paste one license key, code, or credential per line. Empty lines are ignored.
      </p>
      <AdminActionForm
        action={addInventoryAction}
        submitLabel="Add inventory lines"
        className="mt-4"
      >
        <input type="hidden" name="productId" value={productId} />
        <textarea
          name="payloads"
          rows={5}
          placeholder="One credential or key per line…"
          className="flex w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-surface px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--border-glow)] focus:outline-none"
          dir="ltr"
        />
      </AdminActionForm>
    </div>
  );
}
