"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  archiveProductAction,
  saveProductAction,
} from "@/server/actions/admin-catalog.actions";
import { resolveMediaUrl } from "@/lib/storage/media-url";
import type { AdminProductEdit } from "@/server/services/admin-catalog.service";

export function AdminProductForm({
  product,
  categories,
}: {
  product?: AdminProductEdit;
  categories: Array<{ id: string; name: string }>;
}) {
  const [state, saveAction, saving] = useActionState(saveProductAction, null);
  const [archiveState, archiveAction, archiving] = useActionState(
    archiveProductAction,
    null,
  );

  useEffect(() => {
    if (state?.success === false) toast.error(state.error);
    if (archiveState?.success) toast.success(archiveState.message ?? "Archived");
    if (archiveState?.success === false) toast.error(archiveState.error);
  }, [state, archiveState]);

  const imageUrl = product?.imagePath
    ? resolveMediaUrl(product.imagePath)
    : null;

  return (
    <div className="space-y-6">
      <form action={saveAction} className="admin-panel admin-panel--flat">
        {product && <input type="hidden" name="productId" value={product.id} />}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs text-[var(--text-muted)]">Category</label>
            <select
              name="categoryId"
              required
              defaultValue={product?.categoryId ?? categories[0]?.id}
              className="mt-1 flex h-10 w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-surface px-3 text-sm"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)]">Status</label>
            <select
              name="status"
              defaultValue={product?.status ?? "active"}
              className="mt-1 flex h-10 w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-surface px-3 text-sm"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)]">Delivery</label>
            <select
              name="deliveryMode"
              defaultValue={product?.deliveryMode ?? "manual"}
              className="mt-1 flex h-10 w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-surface px-3 text-sm"
            >
              <option value="auto">Auto</option>
              <option value="manual">Manual</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)]">Price (USD cents)</label>
            <Input
              name="priceCents"
              type="number"
              required
              defaultValue={product?.priceCents ?? 999}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)]">Compare-at (cents)</label>
            <Input
              name="compareAtCents"
              type="number"
              defaultValue={product?.compareAtCents ?? ""}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)]">Sort order</label>
            <Input
              name="sortOrder"
              type="number"
              defaultValue={product?.sortOrder ?? 0}
              className="mt-1"
            />
          </div>
          <div className="flex items-end gap-2 pb-2">
            <input
              type="checkbox"
              name="isFeatured"
              id="isFeatured"
              defaultChecked={product?.isFeatured}
              className="h-4 w-4"
            />
            <label htmlFor="isFeatured" className="text-sm">
              Featured on homepage
            </label>
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)]">Badge</label>
            <select
              name="badge"
              defaultValue={product?.badge ?? "none"}
              className="mt-1 flex h-10 w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-surface px-3 text-sm"
            >
              <option value="none">Auto / none</option>
              <option value="bestSeller">Best seller</option>
              <option value="instant">Instant delivery</option>
              <option value="hot">Hot</option>
              <option value="trending">Trending</option>
              <option value="limited">Limited</option>
              <option value="offer">Special offer</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <fieldset className="space-y-3 rounded-md border border-[var(--border-subtle)] p-4">
            <legend className="px-1 text-sm font-semibold">English</legend>
            <Input name="enName" placeholder="Name" required defaultValue={product?.en.name} />
            <Input name="enSlug" placeholder="Slug" required defaultValue={product?.en.slug} />
            <textarea
              name="enShortDescription"
              placeholder="Short description"
              rows={2}
              defaultValue={product?.en.shortDescription}
              className="w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-surface px-3 py-2 text-sm"
            />
            <textarea
              name="enDescription"
              placeholder="Description"
              rows={4}
              defaultValue={product?.en.description}
              className="w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-surface px-3 py-2 text-sm"
            />
          </fieldset>
          <fieldset className="space-y-3 rounded-md border border-[var(--border-subtle)] p-4">
            <legend className="px-1 text-sm font-semibold">Arabic</legend>
            <Input name="arName" placeholder="الاسم" required defaultValue={product?.ar.name} />
            <Input name="arSlug" placeholder="Slug" required defaultValue={product?.ar.slug} />
            <textarea
              name="arShortDescription"
              placeholder="وصف قصير"
              rows={2}
              defaultValue={product?.ar.shortDescription}
              className="w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-surface px-3 py-2 text-sm"
            />
            <textarea
              name="arDescription"
              placeholder="الوصف"
              rows={4}
              defaultValue={product?.ar.description}
              className="w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-surface px-3 py-2 text-sm"
            />
          </fieldset>
        </div>

        <div>
          <label className="text-xs text-[var(--text-muted)]">Product image</label>
          {imageUrl && (
            <div className="relative mt-2 mb-3 h-32 w-32 overflow-hidden rounded-md">
              <Image src={imageUrl} alt="" fill className="object-cover" />
            </div>
          )}
          <input
            type="file"
            name="image"
            accept="image/jpeg,image/png,image/webp"
            className="mt-1 block w-full text-sm text-[var(--text-muted)]"
          />
        </div>

        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save product"}
        </Button>
      </form>

      {product && (
        <form action={archiveAction}>
          <input type="hidden" name="productId" value={product.id} />
          <Button type="submit" variant="outline" disabled={archiving}>
            Archive product
          </Button>
        </form>
      )}
    </div>
  );
}
