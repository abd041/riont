"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { slugifyProductName } from "@/lib/admin/slug";
import { isValidProductSlug } from "@/lib/admin/product-form-validation";
import { saveCategoryAction } from "@/server/actions/admin-catalog.actions";
import type { AdminCategoryRow } from "@/server/services/admin-catalog.service";
import { AdminFormField, adminTextareaClassName } from "./admin-form-field";

export function AdminCategoryForm({
  category,
  onSaved,
}: {
  category?: AdminCategoryRow;
  onSaved?: (categoryId: string) => void;
}) {
  const isEdit = Boolean(category);
  const [state, action, pending] = useActionState(saveCategoryAction, null);

  const [enName, setEnName] = useState(category?.enName ?? "");
  const [enSlug, setEnSlug] = useState(category?.enSlug ?? "");
  const [arName, setArName] = useState(category?.arName ?? "");
  const [arSlug, setArSlug] = useState(category?.arSlug ?? "");
  const [enDescription, setEnDescription] = useState(category?.enDescription ?? "");
  const [arDescription, setArDescription] = useState(category?.arDescription ?? "");

  const enSlugTouched = useRef(Boolean(category?.enSlug));
  const arSlugTouched = useRef(Boolean(category?.arSlug));

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message ?? "Saved");
      if (state.categoryId) onSaved?.(state.categoryId);
    } else {
      toast.error(state.error);
    }
  }, [state, onSaved]);

  useEffect(() => {
    if (!enSlugTouched.current && enName.trim()) {
      setEnSlug(slugifyProductName(enName));
    }
  }, [enName]);

  useEffect(() => {
    if (!arSlugTouched.current && enSlug.trim()) {
      setArSlug(enSlug);
    }
  }, [enSlug]);

  function copyFromEnglish() {
    if (enName.trim()) setArName(enName.trim());
    if (enDescription.trim()) setArDescription(enDescription.trim());
    if (enSlug.trim() && !arSlugTouched.current) setArSlug(enSlug.trim());
    toast.success("Copied English into Arabic fields.");
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!enName.trim() || !arName.trim()) {
      e.preventDefault();
      toast.error("Enter category names in English and Arabic.");
      return;
    }
    if (!isValidProductSlug(enSlug) || !isValidProductSlug(arSlug)) {
      e.preventDefault();
      toast.error(
        "Link names must use lowercase letters, numbers, and hyphens only.",
      );
    }
  }

  return (
    <form action={action} onSubmit={handleSubmit} className="space-y-5">
      {category && <input type="hidden" name="categoryId" value={category.id} />}

      <div className="admin-form-grid admin-form-grid--2">
        <AdminFormField
          label="Sort order"
          htmlFor="sortOrder"
          hint="Lower numbers appear first in the category list."
        >
          <Input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={category?.sortOrder ?? 0}
          />
        </AdminFormField>

        <AdminFormField
          label="Category icon (optional)"
          htmlFor="iconUrl"
          hint="Storage path for a category image, if you use one on the storefront."
        >
          <Input
            id="iconUrl"
            name="iconUrl"
            placeholder="e.g. catalog/categories/gaming.jpg"
            defaultValue={category?.iconUrl ?? ""}
            dir="ltr"
          />
        </AdminFormField>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <fieldset className="space-y-4 rounded-md border border-[var(--border-subtle)] p-4">
          <legend className="px-1 text-sm font-semibold text-[var(--text-primary)]">
            English
          </legend>
          <AdminFormField label="Category name" htmlFor="enName" required>
            <Input
              id="enName"
              name="enName"
              required
              value={enName}
              onChange={(e) => setEnName(e.target.value)}
              placeholder="e.g. Gift Cards"
            />
          </AdminFormField>
          <AdminFormField
            label="Link name (URL)"
            htmlFor="enSlug"
            required
            hint="Auto-filled from the name. Used in /en/categories/…"
          >
            <Input
              id="enSlug"
              name="enSlug"
              required
              value={enSlug}
              onChange={(e) => {
                enSlugTouched.current = true;
                setEnSlug(e.target.value);
              }}
              dir="ltr"
              placeholder="gift-cards"
            />
            {enSlug.trim() && (
              <p className="admin-form-field__hint" dir="ltr">
                {isValidProductSlug(enSlug) ? (
                  <>Preview: /en/categories/{enSlug.trim()}</>
                ) : (
                  <span className="text-amber-400">
                    Use lowercase letters, numbers, and hyphens only.
                  </span>
                )}
              </p>
            )}
          </AdminFormField>
          <AdminFormField label="Description (optional)" htmlFor="enDescription">
            <textarea
              id="enDescription"
              name="enDescription"
              rows={3}
              value={enDescription}
              onChange={(e) => setEnDescription(e.target.value)}
              className={adminTextareaClassName}
              placeholder="Short text for the categories page…"
            />
          </AdminFormField>
        </fieldset>

        <fieldset className="space-y-4 rounded-md border border-[var(--border-subtle)] p-4">
          <legend className="px-1 text-sm font-semibold text-[var(--text-primary)]">
            Arabic
          </legend>
          <div className="mb-2">
            <Button type="button" variant="outline" size="sm" onClick={copyFromEnglish}>
              Copy from English
            </Button>
          </div>
          <AdminFormField label="اسم التصنيف" htmlFor="arName" required>
            <Input
              id="arName"
              name="arName"
              required
              value={arName}
              onChange={(e) => setArName(e.target.value)}
              dir="rtl"
              placeholder="مثال: بطاقات الهدايا"
            />
          </AdminFormField>
          <AdminFormField label="اسم الرابط" htmlFor="arSlug" required>
            <Input
              id="arSlug"
              name="arSlug"
              required
              value={arSlug}
              onChange={(e) => {
                arSlugTouched.current = true;
                setArSlug(e.target.value);
              }}
              dir="ltr"
            />
            {arSlug.trim() && (
              <p className="admin-form-field__hint" dir="ltr">
                Preview: /ar/categories/{arSlug.trim()}
              </p>
            )}
          </AdminFormField>
          <AdminFormField label="الوصف (اختياري)" htmlFor="arDescription">
            <textarea
              id="arDescription"
              name="arDescription"
              rows={3}
              value={arDescription}
              onChange={(e) => setArDescription(e.target.value)}
              className={adminTextareaClassName}
              dir="rtl"
            />
          </AdminFormField>
        </fieldset>
      </div>

      <div className="admin-form-actions admin-form-actions--sticky">
        <div className="admin-form-actions__primary">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : isEdit ? "Save changes" : "Add category"}
          </Button>
          {isEdit && (
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/categories">Cancel</Link>
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
