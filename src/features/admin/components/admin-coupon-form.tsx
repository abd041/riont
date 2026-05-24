"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveCouponAction } from "@/server/actions/admin-catalog.actions";
import type { AdminCouponRow } from "@/server/services/admin-catalog.service";

export function AdminCouponForm({
  coupon,
  onCancel,
  onSaved,
}: {
  coupon?: AdminCouponRow;
  onCancel?: () => void;
  onSaved?: () => void;
}) {
  const router = useRouter();
  const [state, saveAction, saving] = useActionState(saveCouponAction, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message ?? "Saved");
      router.refresh();
      onSaved?.();
    }
    if (state?.success === false) toast.error(state.error);
  }, [state, router, onSaved]);

  return (
    <div className="space-y-4">
      <form action={saveAction} className="glass-card grid gap-3 rounded-[var(--radius-lg)] p-6 sm:grid-cols-2">
        {coupon && <input type="hidden" name="couponId" value={coupon.id} />}
        <Input name="code" placeholder="CODE" required defaultValue={coupon?.code} />
        <select name="couponType" defaultValue={coupon?.couponType ?? "percent"} className="h-10 rounded-md border border-[var(--border-default)] bg-surface px-3 text-sm">
          <option value="percent">Percent</option>
          <option value="fixed">Fixed</option>
        </select>
        <Input name="value" type="number" placeholder="Value" required defaultValue={coupon?.value ?? 10} />
        <Input name="minOrderCents" type="number" placeholder="Min order (cents)" defaultValue={coupon?.minOrderCents ?? ""} />
        <Input name="maxDiscountCents" type="number" placeholder="Max discount (cents)" defaultValue={coupon?.maxDiscountCents ?? ""} />
        <Input name="usageLimit" type="number" placeholder="Usage limit" defaultValue={coupon?.usageLimit ?? ""} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isActive" defaultChecked={coupon?.isActive ?? true} />
          Active
        </label>
        <div className="flex flex-wrap gap-2 sm:col-span-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : coupon ? "Update coupon" : "Create coupon"}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
