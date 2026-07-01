"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
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
  onChange,
}: {
  name: string;
  label: string;
  description?: string;
  defaultChecked: boolean;
  onChange?: (checked: boolean) => void;
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
        onChange={(e) => onChange?.(e.target.checked)}
      />
    </label>
  );
}

function LabeledInput({
  name,
  label,
  hint,
  placeholder,
  defaultValue,
  dir,
}: {
  name: string;
  label: string;
  hint?: string;
  placeholder: string;
  defaultValue: string;
  dir?: "rtl" | "ltr";
}) {
  return (
    <div className="admin-labeled-field">
      <label className="admin-labeled-field__label" htmlFor={name}>
        {label}
      </label>
      {hint ? <p className="admin-labeled-field__hint">{hint}</p> : null}
      <Input
        id={name}
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="mt-1"
        dir={dir}
      />
    </div>
  );
}

export function AdminStoreControlsForm({
  config,
}: {
  config: StoreRuntimeConfig;
}) {
  const [maintenanceOn, setMaintenanceOn] = useState(
    config.features.maintenanceMode,
  );
  const [state, action, pending] = useActionState<
    StoreConfigActionResult | null,
    FormData
  >(saveStoreConfigAction, null);

  useEffect(() => {
    if (!state) return;
    if (state.success) toast.success(state.message ?? "Saved");
    else toast.error(state.error);
  }, [state]);

  const { features, socialLinks, supportWhatsapp } = config;

  return (
    <form action={action} className="admin-store-controls-page">
      <section className="admin-panel admin-panel--flat">
        <div className="admin-section-intro">
          <h3 className="font-semibold">Homepage behavior</h3>
          <p className="admin-section-intro__desc">
            Controls for the hero banner and floating contact button visitors see
            on every page.
          </p>
        </div>

        <div className="admin-store-controls">
          <ToggleRow
            name="heroAutoplay"
            label="Auto-rotate hero slides"
            description="Cycles through the 3 homepage promo slides every few seconds"
            defaultChecked={features.heroAutoplay}
          />
          <ToggleRow
            name="floatingWhatsappEnabled"
            label="Show floating WhatsApp button"
            description={
              supportWhatsapp
                ? `Uses ${supportWhatsapp} from Site settings`
                : "Add a WhatsApp number in Site settings first"
            }
            defaultChecked={features.floatingWhatsappEnabled}
          />
          {!supportWhatsapp && (
            <p className="admin-inline-notice">
              <Link href="/admin/settings">Site settings →</Link> add your
              Support WhatsApp number to enable the floating button.
            </p>
          )}
        </div>
      </section>

      <section className="admin-panel admin-panel--flat">
        <div className="admin-section-intro">
          <h3 className="font-semibold">Maintenance notice</h3>
          <p className="admin-section-intro__desc">
            Shows a bar at the top of the storefront. Useful during updates or
            payment outages.
          </p>
        </div>

        <div className="admin-store-controls">
          <ToggleRow
            name="maintenanceMode"
            label="Show maintenance banner"
            description="Visitors still browse the shop — this is a notice, not a lockout"
            defaultChecked={features.maintenanceMode}
            onChange={setMaintenanceOn}
          />

          {maintenanceOn ? (
            <fieldset className="admin-theme-group admin-theme-group--nested">
              <legend>Banner text (at least one language required)</legend>
              <LabeledInput
                name="maintenanceMessageEn"
                label="English message"
                hint="Shown to English visitors"
                placeholder="We are performing scheduled maintenance…"
                defaultValue={features.maintenanceMessageEn}
              />
              <LabeledInput
                name="maintenanceMessageAr"
                label="Arabic message"
                hint="Shown to Arabic visitors"
                placeholder="جاري صيانة مجدولة…"
                defaultValue={features.maintenanceMessageAr}
                dir="rtl"
              />
            </fieldset>
          ) : (
            <>
              <input
                type="hidden"
                name="maintenanceMessageEn"
                value={features.maintenanceMessageEn}
              />
              <input
                type="hidden"
                name="maintenanceMessageAr"
                value={features.maintenanceMessageAr}
              />
            </>
          )}
        </div>
      </section>

      <section className="admin-panel admin-panel--flat">
        <div className="admin-section-intro">
          <h3 className="font-semibold">Footer</h3>
          <p className="admin-section-intro__desc">
            Choose which blocks appear at the bottom of every storefront page.
          </p>
        </div>

        <div className="admin-store-controls">
          <ToggleRow
            name="showFooterSocial"
            label="Social media icons"
            description="X, Discord, Instagram, and email links you configure below"
            defaultChecked={features.showFooterSocial}
          />
          <ToggleRow
            name="showFooterNewsletter"
            label="Newsletter signup"
            description="Email capture form in the footer (demo — no mailing list yet)"
            defaultChecked={features.showFooterNewsletter}
          />
        </div>
      </section>

      <section className="admin-panel admin-panel--flat">
        <div className="admin-section-intro">
          <h3 className="font-semibold">Social & contact links</h3>
          <p className="admin-section-intro__desc">
            Leave a field empty to hide that network in the footer. Only filled
            links are shown.
          </p>
        </div>

        <div className="admin-store-controls admin-store-controls--fields">
          <LabeledInput
            name="twitter"
            label="X (Twitter)"
            hint="Full profile URL"
            placeholder="https://x.com/yourpage"
            defaultValue={socialLinks.twitter}
          />
          <LabeledInput
            name="discord"
            label="Discord"
            hint="Invite or server URL"
            placeholder="https://discord.gg/your-server"
            defaultValue={socialLinks.discord}
          />
          <LabeledInput
            name="instagram"
            label="Instagram"
            hint="Profile URL"
            placeholder="https://instagram.com/yourpage"
            defaultValue={socialLinks.instagram}
          />
          <LabeledInput
            name="email"
            label="Contact email"
            hint='Use mailto: — e.g. mailto:support@riont.com. Clear to hide.'
            placeholder="mailto:support@riont.com"
            defaultValue={socialLinks.email}
          />
        </div>
      </section>

      <div className="admin-store-controls__submit">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save storefront settings"}
        </Button>
      </div>
    </form>
  );
}
