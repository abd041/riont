"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveSiteSettingsAction } from "@/server/actions/admin-catalog.actions";

export function AdminSettingsForm({
  settings,
}: {
  settings: {
    paymentInstructionsEn: string;
    paymentInstructionsAr: string;
    supportEmail: string;
    supportWhatsapp: string;
  };
}) {
  const [state, action, pending] = useActionState(saveSiteSettingsAction, null);

  useEffect(() => {
    if (!state) return;
    if (state.success) toast.success(state.message ?? "Saved");
    else toast.error(state.error);
  }, [state]);

  return (
    <form action={action} className="admin-panel admin-panel--flat">
      <div>
        <label className="text-xs text-[var(--text-muted)]">Payment instructions (EN)</label>
        <textarea
          name="paymentInstructionsEn"
          rows={4}
          required
          defaultValue={settings.paymentInstructionsEn}
          className="mt-1 w-full rounded-md border border-[var(--border-default)] bg-surface px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-xs text-[var(--text-muted)]">Payment instructions (AR)</label>
        <textarea
          name="paymentInstructionsAr"
          rows={4}
          required
          defaultValue={settings.paymentInstructionsAr}
          className="mt-1 w-full rounded-md border border-[var(--border-default)] bg-surface px-3 py-2 text-sm"
        />
      </div>
      <Input name="supportEmail" type="email" placeholder="Support email" defaultValue={settings.supportEmail} />
      <Input name="supportWhatsapp" placeholder="Support WhatsApp" defaultValue={settings.supportWhatsapp} />
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save settings"}
      </Button>
    </form>
  );
}
