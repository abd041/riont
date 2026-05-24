"use client";

import { useActionState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteCouponAction } from "@/server/actions/admin-catalog.actions";

export function DeleteCouponButton({
  couponId,
  code,
}: {
  couponId: string;
  code: string;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState(deleteCouponAction, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message ?? "Coupon deleted");
      router.refresh();
    } else if (state?.success === false) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (
          !window.confirm(
            `Delete coupon "${code}"? This cannot be undone.`,
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="couponId" value={couponId} />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        disabled={pending}
        aria-label={`Delete ${code}`}
        className="text-red-400 hover:text-red-300"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </form>
  );
}
