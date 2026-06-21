"use client";

import { useActionState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { SupportActionResult } from "@/server/actions/support.actions";

export function SupportActionForm({
  action,
  children,
  submitLabel,
}: {
  action: (
    prev: SupportActionResult | null,
    formData: FormData,
  ) => Promise<SupportActionResult>;
  children: React.ReactNode;
  submitLabel: string;
}) {
  const t = useTranslations("support");
  const [state, formAction, pending] = useActionState(action, null);

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      if (state.ticketNumber) toast.success(t("toast.ticketCreated"));
      else toast.success(t("toast.messageSent"));
    } else {
      toast.error(t(`errors.${state.code}`));
    }
  }, [state, t]);

  return (
    <form action={formAction} encType="multipart/form-data" className="space-y-4">
      {children}
      <Button type="submit" disabled={pending}>
        {pending ? t("sending") : submitLabel}
      </Button>
    </form>
  );
}
