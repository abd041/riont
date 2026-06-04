import Link from "next/link";
import { listCategoryOptions } from "@/server/services/admin-catalog.service";
import { AdminProductForm } from "@/features/admin/components/admin-product-form";
import { AdminNewProductEmpty } from "@/features/admin/components/admin-new-product-empty";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminPageShell } from "@/features/admin/components/admin-page-shell";

export default async function AdminNewProductPage() {
  const categories = await listCategoryOptions();

  return (
    <AdminPageShell>
      <Link href="/admin/products" className="admin-back">
        ← Products
      </Link>

      <AdminPageHeader
        title="Add a product"
        description="Set up pricing and descriptions, save as draft, then add a photo and stock if needed. Use the preview on the right to see how the card will look."
      />

      {categories.length === 0 ? (
        <AdminNewProductEmpty />
      ) : (
        <AdminProductForm categories={categories} />
      )}
    </AdminPageShell>
  );
}
