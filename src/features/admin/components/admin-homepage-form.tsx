"use client";

import { useActionState, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  saveHeroBlockAction,
  saveTrustBlockAction,
  type ContentActionResult,
} from "@/server/actions/admin-content.actions";
import type {
  HeroBlockContent,
  TrustBlockContent,
} from "@/server/services/content-block.service";

function HeroLivePreview({
  title,
  highlight,
  subtitle,
  primaryLabel,
  secondaryLabel,
}: {
  title: string;
  highlight: string;
  subtitle: string;
  primaryLabel: string;
  secondaryLabel: string;
}) {
  return (
    <div className="admin-hero-preview" aria-live="polite">
      <p className="admin-hero-preview__label">Preview (before save)</p>
      <div className="admin-hero-preview__card">
        <p className="admin-hero-preview__title">
          {title || "Cover title"}
          {highlight ? (
            <>
              <br />
              <span className="admin-hero-preview__highlight">{highlight}</span>
            </>
          ) : null}
        </p>
        <p className="admin-hero-preview__subtitle">
          {subtitle || "Cover subtitle appears here"}
        </p>
        <div className="admin-hero-preview__actions">
          <span className="admin-hero-preview__btn admin-hero-preview__btn--primary">
            {primaryLabel || "Primary"}
          </span>
          {secondaryLabel ? (
            <span className="admin-hero-preview__btn">
              {secondaryLabel}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function HeroForm({
  locale,
  initial,
}: {
  locale: "en" | "ar";
  initial: HeroBlockContent | null;
}) {
  const [state, action, pending] = useActionState<
    ContentActionResult | null,
    FormData
  >(saveHeroBlockAction, null);

  const [draft, setDraft] = useState({
    title: initial?.title ?? "",
    highlight: initial?.highlight ?? "",
    subtitle: initial?.subtitle ?? "",
    primaryLabel: initial?.primaryLabel ?? "",
    primaryHref: initial?.primaryHref ?? "/products",
    secondaryLabel: initial?.secondaryLabel ?? "",
    secondaryHref: initial?.secondaryHref ?? "/categories",
  });

  const preview = useMemo(() => draft, [draft]);

  return (
    <form action={action} className="admin-panel admin-panel--flat">
      <h3 className="font-semibold">Hero ({locale.toUpperCase()})</h3>
      <input type="hidden" name="locale" value={locale} />
      <HeroLivePreview
        title={preview.title}
        highlight={preview.highlight}
        subtitle={preview.subtitle}
        primaryLabel={preview.primaryLabel}
        secondaryLabel={preview.secondaryLabel}
      />
      <div>
        <label className="text-sm text-[var(--text-muted)]">Title</label>
        <Input
          name="title"
          required
          value={draft.title}
          onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
          className="mt-1"
        />
      </div>
      <div>
        <label className="text-sm text-[var(--text-muted)]">Highlight</label>
        <Input
          name="highlight"
          value={draft.highlight}
          onChange={(e) =>
            setDraft((d) => ({ ...d, highlight: e.target.value }))
          }
          className="mt-1"
        />
      </div>
      <div>
        <label className="text-sm text-[var(--text-muted)]">Subtitle</label>
        <Input
          name="subtitle"
          value={draft.subtitle}
          onChange={(e) =>
            setDraft((d) => ({ ...d, subtitle: e.target.value }))
          }
          className="mt-1"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm text-[var(--text-muted)]">Primary CTA label</label>
          <Input
            name="primaryLabel"
            value={draft.primaryLabel}
            onChange={(e) =>
              setDraft((d) => ({ ...d, primaryLabel: e.target.value }))
            }
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm text-[var(--text-muted)]">Primary CTA link</label>
          <Input
            name="primaryHref"
            value={draft.primaryHref}
            onChange={(e) =>
              setDraft((d) => ({ ...d, primaryHref: e.target.value }))
            }
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm text-[var(--text-muted)]">Secondary CTA label</label>
          <Input
            name="secondaryLabel"
            value={draft.secondaryLabel}
            onChange={(e) =>
              setDraft((d) => ({ ...d, secondaryLabel: e.target.value }))
            }
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm text-[var(--text-muted)]">Secondary CTA link</label>
          <Input
            name="secondaryHref"
            value={draft.secondaryHref}
            onChange={(e) =>
              setDraft((d) => ({ ...d, secondaryHref: e.target.value }))
            }
            className="mt-1"
          />
        </div>
      </div>
      {state && !state.success && (
        <p className="text-sm text-red-400">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-sm text-green-400">Saved.</p>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save hero"}
      </Button>
    </form>
  );
}

function TrustForm({
  locale,
  initial,
}: {
  locale: "en" | "ar";
  initial: TrustBlockContent | null;
}) {
  const [state, action, pending] = useActionState<
    ContentActionResult | null,
    FormData
  >(saveTrustBlockAction, null);

  const items = initial?.items ?? [];

  return (
    <form action={action} className="admin-panel admin-panel--flat">
      <h3 className="font-semibold">Trust bar ({locale.toUpperCase()})</h3>
      <input type="hidden" name="locale" value={locale} />
      {[1, 2, 3, 4, 5].map((n) => (
        <div key={n}>
          <label className="text-sm text-[var(--text-muted)]">Item {n}</label>
          <Input
            name={`item${n}`}
            required={n <= 4}
            defaultValue={items[n - 1]?.label}
            className="mt-1"
            placeholder={n === 5 ? "e.g. Fast Processing" : undefined}
          />
        </div>
      ))}
      {state && !state.success && (
        <p className="text-sm text-red-400">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-sm text-green-400">Saved.</p>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save trust bar"}
      </Button>
    </form>
  );
}

export function AdminHomepageForm({
  blocks,
}: {
  blocks: {
    enHero: HeroBlockContent | null;
    arHero: HeroBlockContent | null;
    enTrust: TrustBlockContent | null;
    arTrust: TrustBlockContent | null;
  };
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <HeroForm locale="en" initial={blocks.enHero} />
      <HeroForm locale="ar" initial={blocks.arHero} />
      <TrustForm locale="en" initial={blocks.enTrust} />
      <TrustForm locale="ar" initial={blocks.arTrust} />
    </div>
  );
}
