"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DELIVERY_MODE_HINTS,
  PRODUCT_BADGE_LABELS,
  PRODUCT_STATUS_OPTIONS,
} from "@/lib/admin/labels";
import { centsToDollars } from "@/lib/admin/money";
import {
  calcDiscountPercent,
  isValidProductSlug,
  parsePriceDollars,
  validateProductFormClient,
} from "@/lib/admin/product-form-validation";
import { slugifyProductName } from "@/lib/admin/slug";
import {
  archiveProductAction,
  saveProductAction,
} from "@/server/actions/admin-catalog.actions";
import { resolveMediaUrl } from "@/lib/storage/media-url";
import type { AdminProductEdit } from "@/server/services/admin-catalog.service";
import {
  AdminFormField,
  AdminFormSection,
  adminSelectClassName,
  adminTextareaClassName,
} from "./admin-form-field";
import { AdminProductLivePreview } from "./admin-product-live-preview";

export function AdminProductForm({
  product,
  categories,
}: {
  product?: AdminProductEdit;
  categories: Array<{ id: string; name: string }>;
}) {
  const isNew = !product;
  const [state, saveAction, saving] = useActionState(saveProductAction, null);
  const [archiveState, archiveAction, archiving] = useActionState(
    archiveProductAction,
    null,
  );

  const [enName, setEnName] = useState(product?.en.name ?? "");
  const [enSlug, setEnSlug] = useState(product?.en.slug ?? "");
  const [arName, setArName] = useState(product?.ar.name ?? "");
  const [arSlug, setArSlug] = useState(product?.ar.slug ?? "");
  const [enShortDescription, setEnShortDescription] = useState(
    product?.en.shortDescription ?? "",
  );
  const [arShortDescription, setArShortDescription] = useState(
    product?.ar.shortDescription ?? "",
  );
  const [enDescription, setEnDescription] = useState(product?.en.description ?? "");
  const [arDescription, setArDescription] = useState(product?.ar.description ?? "");
  const [priceDollars, setPriceDollars] = useState(
    product ? centsToDollars(product.priceCents) : "9.99",
  );
  const [compareAtDollars, setCompareAtDollars] = useState(
    product?.compareAtCents != null ? centsToDollars(product.compareAtCents) : "",
  );
  const [badge, setBadge] = useState<string>(product?.badge ?? "none");
  const [status, setStatus] = useState(product?.status ?? "draft");
  const [deliveryMode, setDeliveryMode] = useState<"auto" | "manual">(
    product?.deliveryMode ?? "manual",
  );
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const enSlugTouched = useRef(Boolean(product?.en.slug));
  const arSlugTouched = useRef(Boolean(product?.ar.slug));
  const imagePreviewRef = useRef<string | null>(null);

  useEffect(() => {
    if (state?.success === false) toast.error(state.error);
    if (archiveState?.success) toast.success(archiveState.message ?? "Archived");
    if (archiveState?.success === false) toast.error(archiveState.error);
  }, [state, archiveState]);

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

  useEffect(() => {
    return () => {
      if (imagePreviewRef.current) {
        URL.revokeObjectURL(imagePreviewRef.current);
      }
    };
  }, []);

  const existingImageUrl = product?.imagePath
    ? resolveMediaUrl(product.imagePath)
    : null;

  const price = parsePriceDollars(priceDollars);
  const compare = parsePriceDollars(compareAtDollars);
  const discountHint =
    price !== null ? calcDiscountPercent(price, compare) : null;

  function copyFromEnglish() {
    if (enName.trim()) setArName(enName.trim());
    if (enShortDescription.trim()) setArShortDescription(enShortDescription.trim());
    if (enDescription.trim()) setArDescription(enDescription.trim());
    if (enSlug.trim() && !arSlugTouched.current) setArSlug(enSlug.trim());
    toast.success("Copied English text into Arabic fields.");
  }

  function handleImageChange(file: File | null) {
    if (imagePreviewRef.current) {
      URL.revokeObjectURL(imagePreviewRef.current);
      imagePreviewRef.current = null;
    }
    if (!file) {
      setImagePreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    imagePreviewRef.current = url;
    setImagePreviewUrl(url);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("image") as HTMLInputElement | null;
    const imageFile = fileInput?.files?.[0] ?? null;

    const error = validateProductFormClient({
      categoryId: (form.elements.namedItem("categoryId") as HTMLSelectElement)
        ?.value,
      enName,
      enSlug,
      arName,
      arSlug,
      priceDollars,
      compareAtDollars,
      imageFile,
    });

    if (error) {
      e.preventDefault();
      toast.error(error);
    }
  }

  const formContent = (
    <form
      action={saveAction}
      onSubmit={handleSubmit}
      className="admin-panel admin-panel--flat space-y-8"
    >
      {product && <input type="hidden" name="productId" value={product.id} />}

      <AdminFormSection
        step={1}
        title="Basics"
        description="Where the product lives in your shop and how you deliver it to buyers."
      >
        <div className="admin-form-grid admin-form-grid--2">
          <AdminFormField label="Category" htmlFor="categoryId" required>
            <select
              id="categoryId"
              name="categoryId"
              required
              defaultValue={product?.categoryId ?? categories[0]?.id}
              className={adminSelectClassName}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </AdminFormField>

          <AdminFormField
            label="Visibility"
            htmlFor="status"
            hint="Start with Draft until everything looks right."
          >
            <select
              id="status"
              name="status"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "draft" | "active" | "archived")
              }
              className={adminSelectClassName}
            >
              {PRODUCT_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </AdminFormField>

          <AdminFormField
            label="How is it delivered?"
            htmlFor="deliveryMode"
            className="sm:col-span-2"
          >
            <select
              id="deliveryMode"
              name="deliveryMode"
              value={deliveryMode}
              onChange={(e) =>
                setDeliveryMode(e.target.value as "auto" | "manual")
              }
              className={adminSelectClassName}
            >
              <option value="manual">Manual — you send details on each order</option>
              <option value="auto">
                Automatic — site sends codes/keys from your stock
              </option>
            </select>
            <p className="admin-callout">{DELIVERY_MODE_HINTS[deliveryMode]}</p>
            {deliveryMode === "auto" && isNew && (
              <p className="admin-form-field__hint">
                After you save, add stock (one code or key per line) on the next
                screen.
              </p>
            )}
          </AdminFormField>
        </div>
      </AdminFormSection>

      <AdminFormSection
        step={2}
        title="Pricing & highlights"
        description="Prices shown to customers in US dollars."
      >
        <div className="admin-form-grid admin-form-grid--2">
          <AdminFormField
            label="Sale price (USD)"
            htmlFor="priceDollars"
            required
            hint="What the customer pays today."
          >
            <div className="admin-input-prefix">
              <span className="admin-input-prefix__symbol" aria-hidden>
                $
              </span>
              <Input
                id="priceDollars"
                name="priceDollars"
                type="number"
                inputMode="decimal"
                min={0.01}
                step={0.01}
                required
                value={priceDollars}
                onChange={(e) => setPriceDollars(e.target.value)}
                className="admin-input-prefix__input"
                dir="ltr"
              />
            </div>
          </AdminFormField>

          <AdminFormField
            label="Original price (USD)"
            htmlFor="compareAtDollars"
            hint={
              discountHint != null && discountHint > 0
                ? `Shows a ${discountHint}% discount on the card.`
                : "Optional. Must be higher than sale price to show a discount."
            }
          >
            <div className="admin-input-prefix">
              <span className="admin-input-prefix__symbol" aria-hidden>
                $
              </span>
              <Input
                id="compareAtDollars"
                name="compareAtDollars"
                type="number"
                inputMode="decimal"
                min={0}
                step={0.01}
                value={compareAtDollars}
                onChange={(e) => setCompareAtDollars(e.target.value)}
                className="admin-input-prefix__input"
                dir="ltr"
                placeholder="Optional"
              />
            </div>
          </AdminFormField>

          <AdminFormField label="Promo badge" htmlFor="badge">
            <select
              id="badge"
              name="badge"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              className={adminSelectClassName}
            >
              {(
                Object.entries(PRODUCT_BADGE_LABELS) as Array<
                  [keyof typeof PRODUCT_BADGE_LABELS, string]
                >
              ).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </AdminFormField>

          <div className="admin-form-check sm:col-span-2">
            <input
              type="checkbox"
              name="isFeatured"
              id="isFeatured"
              defaultChecked={product?.isFeatured}
              className="h-4 w-4 rounded border-[var(--border-default)]"
            />
            <label htmlFor="isFeatured" className="admin-form-check__label">
              <span className="font-medium text-[var(--text-primary)]">
                Feature on homepage
              </span>
              <span className="block text-xs text-[var(--text-muted)]">
                Shows in Featured Products when live.
              </span>
            </label>
          </div>

          <div className="sm:col-span-2">
            <button
              type="button"
              className="admin-form-advanced-toggle"
              onClick={() => setShowAdvanced((v) => !v)}
              aria-expanded={showAdvanced}
            >
              {showAdvanced ? "Hide" : "Show"} advanced options
            </button>
            {showAdvanced && (
              <div className="mt-3">
                <AdminFormField
                  label="Sort order"
                  htmlFor="sortOrder"
                  hint="Lower numbers appear first in lists. Use 0 for default."
                >
                  <Input
                    id="sortOrder"
                    name="sortOrder"
                    type="number"
                    defaultValue={product?.sortOrder ?? 0}
                  />
                </AdminFormField>
              </div>
            )}
            {!showAdvanced && (
              <input type="hidden" name="sortOrder" value={product?.sortOrder ?? 0} />
            )}
          </div>
        </div>
      </AdminFormSection>

      <AdminFormSection
        step={3}
        title="English listing"
        description="What English-speaking customers see on the product page."
      >
        <div className="space-y-4">
          <AdminFormField label="Product name" htmlFor="enName" required>
            <Input
              id="enName"
              name="enName"
              required
              value={enName}
              onChange={(e) => setEnName(e.target.value)}
              placeholder="e.g. Steam Premium Account"
            />
          </AdminFormField>
          <AdminFormField
            label="Link name (URL)"
            htmlFor="enSlug"
            required
            hint="Used in the web address. Auto-filled from the name; you can edit."
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
              placeholder="steam-premium-account"
              dir="ltr"
              aria-invalid={enSlug.length > 0 && !isValidProductSlug(enSlug)}
            />
            {enSlug.trim() && (
              <p className="admin-form-field__hint" dir="ltr">
                {isValidProductSlug(enSlug) ? (
                  <>Preview: /en/products/{enSlug.trim()}</>
                ) : (
                  <span className="text-amber-400">
                    Use lowercase letters, numbers, and hyphens only.
                  </span>
                )}
              </p>
            )}
          </AdminFormField>
          <AdminFormField label="Short summary" htmlFor="enShortDescription">
            <textarea
              id="enShortDescription"
              name="enShortDescription"
              rows={2}
              value={enShortDescription}
              onChange={(e) => setEnShortDescription(e.target.value)}
              className={adminTextareaClassName}
              placeholder="Brief highlight for search and cards…"
              maxLength={500}
            />
          </AdminFormField>
          <AdminFormField label="Full description" htmlFor="enDescription">
            <textarea
              id="enDescription"
              name="enDescription"
              rows={5}
              value={enDescription}
              onChange={(e) => setEnDescription(e.target.value)}
              className={adminTextareaClassName}
              placeholder="Full product description…"
            />
          </AdminFormField>
        </div>
      </AdminFormSection>

      <AdminFormSection
        step={4}
        title="Arabic listing"
        description="Same information for Arabic customers (/ar/…)."
      >
        <div className="mb-4">
          <Button type="button" variant="outline" size="sm" onClick={copyFromEnglish}>
            Copy from English
          </Button>
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            Fills Arabic name and descriptions from English. Adjust wording if
            needed.
          </p>
        </div>
        <div className="space-y-4">
          <AdminFormField label="اسم المنتج" htmlFor="arName" required>
            <Input
              id="arName"
              name="arName"
              required
              value={arName}
              onChange={(e) => setArName(e.target.value)}
              placeholder="مثال: حساب ستيم بريميوم"
              dir="rtl"
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
              aria-invalid={arSlug.length > 0 && !isValidProductSlug(arSlug)}
            />
            {arSlug.trim() && (
              <p className="admin-form-field__hint" dir="ltr">
                Preview: /ar/products/{arSlug.trim()}
              </p>
            )}
          </AdminFormField>
          <AdminFormField label="ملخص قصير" htmlFor="arShortDescription">
            <textarea
              id="arShortDescription"
              name="arShortDescription"
              rows={2}
              value={arShortDescription}
              onChange={(e) => setArShortDescription(e.target.value)}
              className={adminTextareaClassName}
              dir="rtl"
              maxLength={500}
            />
          </AdminFormField>
          <AdminFormField label="الوصف الكامل" htmlFor="arDescription">
            <textarea
              id="arDescription"
              name="arDescription"
              rows={5}
              value={arDescription}
              onChange={(e) => setArDescription(e.target.value)}
              className={adminTextareaClassName}
              dir="rtl"
            />
          </AdminFormField>
        </div>
      </AdminFormSection>

      <AdminFormSection
        step={5}
        title="Product photo"
        description="Square or landscape image works best. JPG, PNG, or WebP — max 5 MB."
      >
        {(existingImageUrl || imagePreviewUrl) && (
          <div className="relative mb-4 h-40 w-40 overflow-hidden rounded-xl border border-[var(--border-subtle)]">
            <Image
              src={imagePreviewUrl ?? existingImageUrl!}
              alt=""
              fill
              className="object-cover"
              unoptimized={Boolean(imagePreviewUrl)}
            />
          </div>
        )}
        <AdminFormField
          label={existingImageUrl ? "Replace image" : "Upload image"}
          htmlFor="image"
          hint={isNew ? "Recommended so the product card looks complete." : undefined}
        >
          <input
            id="image"
            type="file"
            name="image"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-[var(--text-muted)] file:me-3 file:rounded-md file:border-0 file:bg-accent-500/15 file:px-3 file:py-2 file:text-sm file:font-medium file:text-accent-300"
          />
        </AdminFormField>
      </AdminFormSection>

      <div className="admin-form-actions admin-form-actions--sticky">
        <div className="admin-form-actions__primary">
          <Button type="submit" disabled={saving}>
            {saving
              ? "Saving…"
              : isNew
                ? "Save product"
                : "Save changes"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/products">Cancel</Link>
          </Button>
        </div>
        {isNew && (
          <p className="admin-form-actions__hint">
            Saves as draft by default. You can add stock and go live on the next
            screen.
          </p>
        )}
      </div>
    </form>
  );

  return (
    <div className="admin-product-form">
      {isNew && (
        <div className="admin-product-form__steps" aria-label="Steps to add a product">
          <span className="admin-product-form__step admin-product-form__step--active">
            1. Basics & pricing
          </span>
          <span className="admin-product-form__step">2. English & Arabic</span>
          <span className="admin-product-form__step">3. Photo & save</span>
        </div>
      )}

      <div className={isNew ? "admin-new-product-layout" : undefined}>
        <div className={isNew ? "admin-new-product-layout__form" : undefined}>
          {formContent}
          {product && (
            <form action={archiveAction} className="admin-product-form__archive">
              <input type="hidden" name="productId" value={product.id} />
              <Button type="submit" variant="outline" disabled={archiving}>
                Archive product (hide from shop)
              </Button>
            </form>
          )}
        </div>

        {isNew && (
          <AdminProductLivePreview
            enName={enName}
            enShortDescription={enShortDescription}
            priceDollars={priceDollars}
            compareAtDollars={compareAtDollars}
            badge={badge}
            imagePreviewUrl={imagePreviewUrl ?? existingImageUrl}
            enSlug={enSlug}
            status={status}
          />
        )}
      </div>
    </div>
  );
}
