"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  saveStoreConfigAction,
  type StoreConfigActionResult,
} from "@/server/actions/admin-store-config.actions";
import type { StoreRuntimeConfig } from "@/lib/site/store-config";

function ToggleRow({
  name,
  label,
  description,
  defaultChecked,
}: {
  name: string;
  label: string;
  description?: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="admin-toggle-row">
      <div>
        <span className="admin-toggle-row__label">{label}</span>
        {description ? (
          <span className="admin-toggle-row__desc">{description}</span>
        ) : null}
      </div>
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="admin-toggle-row__input"
      />
    </label>
  );
}

export function AdminStoreControlsForm({
  config,
}: {
  config: StoreRuntimeConfig;
}) {
  const [state, action, pending] = useActionState<
    StoreConfigActionResult | null,
    FormData
  >(saveStoreConfigAction, null);

  useEffect(() => {
    if (!state) return;
    if (state.success) toast.success(state.message ?? "Saved");
    else toast.error(state.error);
  }, [state]);

  const { features, socialLinks } = config;

  return (
    <form action={action} className="admin-panel admin-panel--flat">
      <h3 className="font-semibold">Store controls</h3>
      <p className="mt-1 text-sm text-[var(--text-muted)]">
        Toggles and links — no code changes needed for common adjustments.
      </p>

      <div className="admin-store-controls">
        <fieldset className="admin-theme-group">
          <legend>Behavior</legend>
          <ToggleRow
            name="heroAutoplay"
            label="Hero slide autoplay"
            description="Rotate homepage hero slides automatically"
            defaultChecked={features.heroAutoplay}
          />
          <ToggleRow
            name="floatingWhatsappEnabled"
            label="Floating WhatsApp button"
            description="Uses Support WhatsApp from Settings → Site settings"
            defaultChecked={features.floatingWhatsappEnabled}
          />
          <ToggleRow
            name="maintenanceMode"
            label="Maintenance banner"
            description="Show a notice bar at the top of the storefront"
            defaultChecked={features.maintenanceMode}
          />
        </fieldset>

        <fieldset className="admin-theme-group">
          <legend>Maintenance messages</legend>
          <div>
            <label className="text-xs text-[var(--text-muted)]">English</label>
            <Input
              name="maintenanceMessageEn"
              defaultValue={features.maintenanceMessageEn}
              placeholder="We are performing scheduled maintenance…"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)]">Arabic</label>
            <Input
              name="maintenanceMessageAr"
              defaultValue={features.maintenanceMessageAr}
              placeholder="جاري صيانة مجدولة…"
              className="mt-1"
              dir="rtl"
            />
          </div>
        </fieldset>

        <fieldset className="admin-theme-group">
          <legend>Footer</legend>
          <ToggleRow
            name="showFooterSocial"
            label="Show social links"
            defaultChecked={features.showFooterSocial}
          />
          <ToggleRow
            name="showFooterNewsletter"
            label="Show newsletter block"
            defaultChecked={features.showFooterNewsletter}
          />
        </fieldset>

        <fieldset className="admin-theme-group">
          <legend>Social links</legend>
          <p className="admin-theme-form__hint">
            Leave blank to hide a network. Use full URLs (https://…) or mailto: for email.
          </p>
          <Input
            name="twitter"
            placeholder="https://x.com/yourpage"
            defaultValue={socialLinks.twitter}
          />
          <Input
            name="discord"
            placeholder="https://discord.gg/…"
            defaultValue={socialLinks.discord}
          />
          <Input
            name="instagram"
            placeholder="https://instagram.com/…"
            defaultValue={socialLinks.instagram}
          />
          <Input
            name="email"
            placeholder="mailto:support@riont.com"
            defaultValue={socialLinks.email}
          />
        </fieldset>
      </div>

      <Button type="submit" disabled={pending} className="mt-4">
        {pending ? "Saving…" : "Save store controls"}
      </Button>
    </form>
  );
}
