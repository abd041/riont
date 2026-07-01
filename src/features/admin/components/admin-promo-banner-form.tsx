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

export function AdminPromoBannerForm({ config }: { config: StoreRuntimeConfig }) {
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
    <form action={action} className="admin-promo-form">
      <input
        type="hidden"
        name="heroAutoplay"
        value={features.heroAutoplay ? "on" : "off"}
      />
      <input
        type="hidden"
        name="floatingWhatsappEnabled"
        value={features.floatingWhatsappEnabled ? "on" : "off"}
      />
      <input
        type="hidden"
        name="maintenanceMode"
        value={features.maintenanceMode ? "on" : "off"}
      />
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
      <input
        type="hidden"
        name="showFooterSocial"
        value={features.showFooterSocial ? "on" : "off"}
      />
      <input
        type="hidden"
        name="showFooterNewsletter"
        value={features.showFooterNewsletter ? "on" : "off"}
      />
      <input type="hidden" name="twitter" value={socialLinks.twitter} />
      <input type="hidden" name="discord" value={socialLinks.discord} />
      <input type="hidden" name="instagram" value={socialLinks.instagram} />
      <input type="hidden" name="email" value={socialLinks.email} />

      <section className="admin-panel admin-panel--flat">
        <div className="admin-section-intro">
          <h3 className="font-semibold">Promo strip</h3>
          <p className="admin-section-intro__desc">
            Thin banner above the homepage hero. Customize the gradient under
            Colors → Promo strip.
          </p>
        </div>

        <div className="admin-store-controls">
          <ToggleRow
            name="promoBannerEnabled"
            label="Show promo strip"
            description="Hides the banner entirely when off"
            defaultChecked={features.promoBannerEnabled}
          />

          <div className="admin-labeled-field">
            <label className="admin-labeled-field__label" htmlFor="promoBannerTextEn">
              English text
            </label>
            <p className="admin-labeled-field__hint">
              Leave empty to use the default translation
            </p>
            <Input
              id="promoBannerTextEn"
              name="promoBannerTextEn"
              defaultValue={features.promoBannerTextEn}
              placeholder="Limited offers — premium digital deals updated weekly"
            />
          </div>

          <div className="admin-labeled-field">
            <label className="admin-labeled-field__label" htmlFor="promoBannerTextAr">
              Arabic text
            </label>
            <Input
              id="promoBannerTextAr"
              name="promoBannerTextAr"
              defaultValue={features.promoBannerTextAr}
              placeholder="عروض محدودة — صفقات رقمية مميزة…"
              dir="rtl"
            />
          </div>

          <div className="admin-labeled-field">
            <label className="admin-labeled-field__label" htmlFor="promoBannerHref">
              Optional link
            </label>
            <p className="admin-labeled-field__hint">
              Full URL or path (e.g. /products). Leave empty for text only.
            </p>
            <Input
              id="promoBannerHref"
              name="promoBannerHref"
              defaultValue={features.promoBannerHref}
              placeholder="/products"
            />
          </div>
        </div>

        <div className="admin-store-controls__submit">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save promo strip"}
          </Button>
        </div>
      </section>
    </form>
  );
}
