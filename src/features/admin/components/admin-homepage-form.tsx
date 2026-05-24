"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  saveHeroBlockAction,
  saveTrustBlockAction,
  type ContentActionResult,
} from "@/server/actions/admin-content.actions";
import type { HeroBlockContent, TrustBlockContent } from "@/server/services/content-block.service";

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

  return (
    <form action={action} className="glass-card space-y-4 rounded-[var(--radius-lg)] p-6">
      <h3 className="font-semibold">Hero ({locale.toUpperCase()})</h3>
      <input type="hidden" name="locale" value={locale} />
      <div>
        <label className="text-sm text-[var(--text-muted)]">Title</label>
        <Input name="title" required defaultValue={initial?.title} className="mt-1" />
      </div>
      <div>
        <label className="text-sm text-[var(--text-muted)]">Highlight</label>
        <Input name="highlight" defaultValue={initial?.highlight} className="mt-1" />
      </div>
      <div>
        <label className="text-sm text-[var(--text-muted)]">Subtitle</label>
        <Input name="subtitle" defaultValue={initial?.subtitle} className="mt-1" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm text-[var(--text-muted)]">Primary CTA label</label>
          <Input name="primaryLabel" defaultValue={initial?.primaryLabel} className="mt-1" />
        </div>
        <div>
          <label className="text-sm text-[var(--text-muted)]">Primary CTA link</label>
          <Input name="primaryHref" defaultValue={initial?.primaryHref} className="mt-1" />
        </div>
        <div>
          <label className="text-sm text-[var(--text-muted)]">Secondary CTA label</label>
          <Input name="secondaryLabel" defaultValue={initial?.secondaryLabel} className="mt-1" />
        </div>
        <div>
          <label className="text-sm text-[var(--text-muted)]">Secondary CTA link</label>
          <Input name="secondaryHref" defaultValue={initial?.secondaryHref} className="mt-1" />
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
    <form action={action} className="glass-card space-y-4 rounded-[var(--radius-lg)] p-6">
      <h3 className="font-semibold">Trust bar ({locale.toUpperCase()})</h3>
      <input type="hidden" name="locale" value={locale} />
      {[1, 2, 3, 4].map((n) => (
        <div key={n}>
          <label className="text-sm text-[var(--text-muted)]">Item {n}</label>
          <Input
            name={`item${n}`}
            required
            defaultValue={items[n - 1]?.label}
            className="mt-1"
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
