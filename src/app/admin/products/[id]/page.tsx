import { notFound } from "next/navigation";
import Link from "next/link";
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
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminPageShell } from "@/features/admin/components/admin-page-shell";

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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

  return (
    <AdminPageShell>
      <Link href="/admin/products" className="admin-back">
        ← Products
      </Link>
      <AdminPageHeader title="Edit product" description={product.en.name} />
      <AdminProductForm product={product} categories={categories} />
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
