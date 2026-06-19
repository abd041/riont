import { notFound } from "next/navigation";
import Link from "next/link";
import { AdminInventoryPanel } from "@/features/admin/components/admin-inventory-panel";
import { AdminProductCreatedBanner } from "@/features/admin/components/admin-product-created-banner";
import {
  getAdminProductEdit,
  getAdminProductFields,
  getAdminProductRelatedIds,
  getAdminProductVariants,
  listCategoryOptions,
  listProductsForRelatedPicker,
} from "@/server/services/admin-catalog.service";
import { AdminProductForm } from "@/features/admin/components/admin-product-form";
import { AdminProductExtras } from "@/features/admin/components/admin-product-extras";
import { AdminProductReviews } from "@/features/admin/components/admin-product-reviews";
import { listAdminProductReviews } from "@/server/services/admin-review.service";
import { getAvailableStock } from "@/server/services/inventory.service";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminPageShell } from "@/features/admin/components/admin-page-shell";

export default async function AdminEditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ welcome?: string; saved?: string }>;
}) {
  const { id } = await params;
  const { welcome, saved } = await searchParams;
  const [product, categories, variants, fields, relatedIds, productOptions, reviews] =
    await Promise.all([
      getAdminProductEdit(id),
      listCategoryOptions(),
      getAdminProductVariants(id),
      getAdminProductFields(id),
      getAdminProductRelatedIds(id),
      listProductsForRelatedPicker(id),
      listAdminProductReviews(id),
    ]);

  if (!product) notFound();

  const availableStock =
    product.deliveryMode === "auto"
      ? await getAvailableStock(product.id)
      : 0;

  return (
    <AdminPageShell>
      <Link href="/admin/products" className="admin-back">
        ← Products
      </Link>
      <AdminPageHeader
        title="Edit product"
        description={`${product.en.name} — update details below, then scroll for stock, variants, and reviews.`}
      />

      {welcome === "1" && (
        <AdminProductCreatedBanner
          productName={product.en.name}
          deliveryMode={product.deliveryMode}
        />
      )}

      {saved === "1" && !welcome && (
        <div className="admin-banner admin-banner--success" role="status">
          <p className="admin-banner__title">Changes saved</p>
        </div>
      )}

      <AdminProductForm product={product} categories={categories} />

      {product.deliveryMode === "auto" && (
        <AdminInventoryPanel
          productId={product.id}
          productName={product.en.name}
          availableStock={availableStock}
        />
      )}

      <AdminProductExtras
        productId={product.id}
        initialVariants={variants}
        initialFields={fields}
        initialRelatedIds={relatedIds}
        productOptions={productOptions}
      />
      <AdminProductReviews productId={product.id} reviews={reviews} />
    </AdminPageShell>
  );
}
