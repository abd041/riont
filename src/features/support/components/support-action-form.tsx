"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { SupportActionResult } from "@/server/actions/support.actions";

export function SupportActionForm({
  action,
  children,
  submitLabel,
  pendingLabel = "Sending…",
}: {
  action: (
    prev: SupportActionResult | null,
    formData: FormData,
  ) => Promise<SupportActionResult>;
  children: React.ReactNode;
  submitLabel: string;
  pendingLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      if (state.ticketNumber) toast.success("Ticket created");
      else toast.success("Sent");
    } else {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={formAction} encType="multipart/form-data" className="space-y-4">
      {children}
      <Button type="submit" disabled={pending}>
        {pending ? pendingLabel : submitLabel}
      </Button>
    </form>
  );
}
