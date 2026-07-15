"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { HomepageExtras } from "@/lib/site/homepage-extras";
import {
  saveHomepageExtrasAction,
} from "@/server/actions/admin-homepage-extras.actions";
import type { StoreConfigActionResult } from "@/server/actions/admin-store-config.actions";

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

function Field({
  name,
  label,
  defaultValue,
  placeholder,
  dir,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  dir?: "rtl" | "ltr";
}) {
  return (
    <div className="admin-labeled-field">
      <label className="admin-labeled-field__label" htmlFor={name}>
        {label}
      </label>
      <Input
        id={name}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-1"
        dir={dir}
      />
    </div>
  );
}

export function AdminHomepageExtrasForm({
  extras,
  products,
}: {
  extras: HomepageExtras;
  products: Array<{ id: string; name: string }>;
}) {
  const [state, action, pending] = useActionState<
    StoreConfigActionResult | null,
    FormData
  >(saveHomepageExtrasAction, null);

  useEffect(() => {
    if (!state) return;
    if (state.success) toast.success(state.message ?? "Saved");
    else toast.error(state.error);
  }, [state]);

  const productOptions = products.map((p) => ({ id: p.id, name: p.name }));

  return (
    <form action={action} className="admin-panel admin-panel--flat space-y-8">
      <div className="admin-section-intro">
        <h3 className="font-semibold">Homepage extras</h3>
        <p className="admin-section-intro__desc">
          Live status, stats, Cover motion, Pick Your Path, Most Requested
          curator, and RIYONT Picks. Changes appear on the storefront after save.
        </p>
      </div>

      <section className="admin-store-controls space-y-3">
        <h4 className="font-medium text-[var(--text-primary)]">Visibility</h4>
        <ToggleRow
          name="liveStatusEnabled"
          label="Live store status strip"
          description="Compact Support / Instant / Queue line under the Cover"
          defaultChecked={extras.liveStatusEnabled}
        />
        <ToggleRow
          name="trustStripEnabled"
          label="Trust strip"
          description="Uses Trust bar copy from Homepage content (EN/AR)"
          defaultChecked={extras.trustStripEnabled}
        />
        <ToggleRow
          name="statsEnabled"
          label="Stats strip"
          description="Small realistic counters — keep numbers honest"
          defaultChecked={extras.statsEnabled}
        />
        <ToggleRow
          name="showInstantFilter"
          label="Instant delivery filter chips"
          description="Quick filter above homepage categories"
          defaultChecked={extras.showInstantFilter}
        />
      </section>

      <section className="space-y-3">
        <h4 className="font-medium text-[var(--text-primary)]">Cover mode</h4>
        <label className="admin-labeled-field">
          <span className="admin-labeled-field__label">Cover behavior</span>
          <select
            name="heroCoverMode"
            defaultValue={extras.heroCoverMode}
            className="mt-1 w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-elevated)] px-3 py-2 text-sm"
          >
            <option value="animated">Animated (slides + rotating phrases)</option>
            <option value="static">Static (first slide only)</option>
          </select>
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="admin-labeled-field__label" htmlFor="heroPhrasesEn">
              Rotating phrases (EN) — one per line
            </label>
            <textarea
              id="heroPhrasesEn"
              name="heroPhrasesEn"
              rows={3}
              className="mt-1 w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-elevated)] px-3 py-2 text-sm"
              defaultValue={extras.heroPhrasesEn.join("\n")}
            />
          </div>
          <div>
            <label className="admin-labeled-field__label" htmlFor="heroPhrasesAr">
              Rotating phrases (AR) — one per line
            </label>
            <textarea
              id="heroPhrasesAr"
              name="heroPhrasesAr"
              rows={3}
              dir="rtl"
              className="mt-1 w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-elevated)] px-3 py-2 text-sm"
              defaultValue={extras.heroPhrasesAr.join("\n")}
            />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h4 className="font-medium text-[var(--text-primary)]">Live status items</h4>
        {extras.liveStatusItems.map((item, index) => {
          const n = index + 1;
          return (
            <div key={n} className="grid gap-3 sm:grid-cols-2">
              <Field name={`status${n}LabelEn`} label={`Item ${n} label EN`} defaultValue={item.labelEn} />
              <Field name={`status${n}LabelAr`} label={`Item ${n} label AR`} defaultValue={item.labelAr} dir="rtl" />
              <Field name={`status${n}ValueEn`} label={`Item ${n} value EN`} defaultValue={item.valueEn} />
              <Field name={`status${n}ValueAr`} label={`Item ${n} value AR`} defaultValue={item.valueAr} dir="rtl" />
            </div>
          );
        })}
      </section>

      <section className="space-y-3">
        <h4 className="font-medium text-[var(--text-primary)]">Stats</h4>
        {extras.statsItems.map((item, index) => {
          const n = index + 1;
          return (
            <div key={n} className="grid gap-3 sm:grid-cols-2">
              <Field name={`stat${n}ValueEn`} label={`Stat ${n} value EN`} defaultValue={item.valueEn} />
              <Field name={`stat${n}ValueAr`} label={`Stat ${n} value AR`} defaultValue={item.valueAr} dir="rtl" />
              <Field name={`stat${n}LabelEn`} label={`Stat ${n} label EN`} defaultValue={item.labelEn} />
              <Field name={`stat${n}LabelAr`} label={`Stat ${n} label AR`} defaultValue={item.labelAr} dir="rtl" />
            </div>
          );
        })}
      </section>

      <section className="space-y-3">
        <h4 className="font-medium text-[var(--text-primary)]">Pick Your Path</h4>
        {extras.pathCards.map((card, index) => {
          const n = index + 1;
          return (
            <div key={n} className="grid gap-3 rounded-[var(--radius-md)] border border-[var(--border-subtle)] p-3 sm:grid-cols-2">
              <Field name={`path${n}TitleEn`} label={`Card ${n} title EN`} defaultValue={card.titleEn} />
              <Field name={`path${n}TitleAr`} label={`Card ${n} title AR`} defaultValue={card.titleAr} dir="rtl" />
              <Field name={`path${n}DescEn`} label={`Card ${n} description EN`} defaultValue={card.descriptionEn} />
              <Field name={`path${n}DescAr`} label={`Card ${n} description AR`} defaultValue={card.descriptionAr} dir="rtl" />
              <Field name={`path${n}Href`} label={`Card ${n} link`} defaultValue={card.href} placeholder="/?filter=instant" />
            </div>
          );
        })}
      </section>

      <section className="space-y-3">
        <h4 className="font-medium text-[var(--text-primary)]">Most Requested (curated)</h4>
        <p className="text-sm text-[var(--text-muted)]">
          Product IDs, one per line (max 8). Leave empty to use automatic featured/bestseller
          ranking. Copy IDs from product edit URLs or the list below.
        </p>
        <textarea
          name="mostRequestedIds"
          rows={4}
          className="w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-elevated)] px-3 py-2 font-mono text-xs"
          defaultValue={extras.mostRequestedIds.join("\n")}
          placeholder="uuid-…"
        />
        <details className="text-xs text-[var(--text-muted)]">
          <summary className="cursor-pointer">Product ID reference</summary>
          <ul className="mt-2 max-h-40 space-y-1 overflow-auto">
            {productOptions.slice(0, 40).map((p) => (
              <li key={p.id}>
                <code>{p.id}</code> — {p.name}
              </li>
            ))}
          </ul>
        </details>
      </section>

      <section className="space-y-3">
        <h4 className="font-medium text-[var(--text-primary)]">RIYONT Picks (max 3)</h4>
        <p className="text-sm text-[var(--text-muted)]">
          Products already shown in Most Requested are skipped automatically so
          this section stays distinct.
        </p>
        {[0, 1, 2].map((index) => {
          const n = index + 1;
          const pick = extras.riyontPicks[index];
          return (
            <div key={n} className="grid gap-3 rounded-[var(--radius-md)] border border-[var(--border-subtle)] p-3 sm:grid-cols-2">
              <label className="admin-labeled-field sm:col-span-2">
                <span className="admin-labeled-field__label">Pick {n} product</span>
                <select
                  name={`pick${n}ProductId`}
                  defaultValue={pick?.productId ?? ""}
                  className="mt-1 w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-elevated)] px-3 py-2 text-sm"
                >
                  <option value="">— None —</option>
                  {productOptions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </label>
              <Field name={`pick${n}ReasonEn`} label="Reason EN" defaultValue={pick?.reasonEn} placeholder="Best for speed" />
              <Field name={`pick${n}ReasonAr`} label="Reason AR" defaultValue={pick?.reasonAr} dir="rtl" />
            </div>
          );
        })}
      </section>

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save homepage extras"}
      </Button>
    </form>
  );
}
