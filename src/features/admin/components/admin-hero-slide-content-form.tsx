"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  saveHeroSlideContentAction,
  type ThemeActionResult,
} from "@/server/actions/admin-theme.actions";
import { HERO_SLIDES } from "@/features/homepage/components/hero-slides";
import type { HeroSlideContentMap } from "@/lib/site/hero-slide-content";
import { EMPTY_HERO_SLIDE_COPY } from "@/lib/site/hero-slide-content";

const SLIDE_LABELS: Record<string, string> = {
  "promo-deals": "Slide 1 — Deals",
  "promo-gaming": "Slide 2 — Gaming",
  "promo-instant": "Slide 3 — Instant delivery",
};

function CopyFields({
  slideId,
  locale,
  values,
}: {
  slideId: string;
  locale: "en" | "ar";
  values: { title: string; highlight: string; subtitle: string; tag: string };
}) {
  const prefix = `${slideId}_${locale}`;
  const label = locale === "en" ? "English" : "Arabic";

  return (
    <fieldset className="admin-theme-group admin-theme-group--nested">
      <legend>{label}</legend>
      <div className="admin-labeled-field">
        <label className="admin-labeled-field__label" htmlFor={`${prefix}_tag`}>
          Badge label
        </label>
        <Input
          id={`${prefix}_tag`}
          name={`${prefix}_tag`}
          defaultValue={values.tag}
          placeholder="WEEKLY DEALS"
          dir={locale === "ar" ? "rtl" : "ltr"}
        />
      </div>
      <div className="admin-labeled-field">
        <label className="admin-labeled-field__label" htmlFor={`${prefix}_title`}>
          Title line
        </label>
        <Input
          id={`${prefix}_title`}
          name={`${prefix}_title`}
          defaultValue={values.title}
          placeholder="SAVE UP TO"
          dir={locale === "ar" ? "rtl" : "ltr"}
        />
      </div>
      <div className="admin-labeled-field">
        <label
          className="admin-labeled-field__label"
          htmlFor={`${prefix}_highlight`}
        >
          Highlight line
        </label>
        <Input
          id={`${prefix}_highlight`}
          name={`${prefix}_highlight`}
          defaultValue={values.highlight}
          placeholder="40% OFF DIGITAL"
          dir={locale === "ar" ? "rtl" : "ltr"}
        />
      </div>
      <div className="admin-labeled-field">
        <label
          className="admin-labeled-field__label"
          htmlFor={`${prefix}_subtitle`}
        >
          Subtitle
        </label>
        <Input
          id={`${prefix}_subtitle`}
          name={`${prefix}_subtitle`}
          defaultValue={values.subtitle}
          placeholder="Steam, subscriptions & gift cards…"
          dir={locale === "ar" ? "rtl" : "ltr"}
        />
      </div>
    </fieldset>
  );
}

export function AdminHeroSlideContentForm({
  heroSlideContent,
}: {
  heroSlideContent: HeroSlideContentMap;
}) {
  const [state, action, pending] = useActionState<
    ThemeActionResult | null,
    FormData
  >(saveHeroSlideContentAction, null);

  useEffect(() => {
    if (!state) return;
    if (state.success) toast.success(state.message ?? "Saved");
    else toast.error(state.error);
  }, [state]);

  return (
    <form action={action} className="admin-hero-content-form">
      {HERO_SLIDES.map((slide) => {
        const entry = heroSlideContent[slide.id];
        const en = entry?.en ?? EMPTY_HERO_SLIDE_COPY;
        const ar = entry?.ar ?? EMPTY_HERO_SLIDE_COPY;

        return (
          <section key={slide.id} className="admin-panel admin-panel--flat">
            <div className="admin-section-intro">
              <h3 className="font-semibold">
                {SLIDE_LABELS[slide.id] ?? slide.id}
              </h3>
              <p className="admin-section-intro__desc">
                Override the default translation for this carousel slide. Leave
                fields empty to keep the built-in text.
              </p>
            </div>
            <CopyFields slideId={slide.id} locale="en" values={en} />
            <CopyFields slideId={slide.id} locale="ar" values={ar} />
          </section>
        );
      })}

      <div className="admin-store-controls__submit">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save hero slide text"}
        </Button>
      </div>
    </form>
  );
}
