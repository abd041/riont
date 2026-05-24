"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { AdminActionResult } from "@/server/actions/admin-order.actions";

type AdminActionFormProps = {
  action: (
    prev: AdminActionResult | null,
    formData: FormData,
  ) => Promise<AdminActionResult>;
  children: React.ReactNode;
  submitLabel: string;
  pendingLabel?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  className?: string;
  multipart?: boolean;
};

export function AdminActionForm({
  action,
  children,
  submitLabel,
  pendingLabel = "Working…",
  variant = "secondary",
  className,
  multipart = false,
}: AdminActionFormProps) {
  const [state, formAction, pending] = useActionState(action, null);

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      if (state.message) toast.success(state.message);
      else toast.success("Saved");
    } else {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form
      action={formAction}
      className={className}
      encType={multipart ? "multipart/form-data" : undefined}
    >
      {children}
      <Button type="submit" variant={variant} disabled={pending} className="mt-3">
        {pending ? pendingLabel : submitLabel}
      </Button>
    </form>
  );
}
