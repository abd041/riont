import { listCategoryOptions } from "@/server/services/admin-catalog.service";
import { AdminProductForm } from "@/features/admin/components/admin-product-form";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminPageShell } from "@/features/admin/components/admin-page-shell";

export default async function AdminNewProductPage() {
  const categories = await listCategoryOptions();

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="New product"
        description="Create a catalog item with pricing, delivery mode, and translations."
      />
      <AdminProductForm categories={categories} />
    </AdminPageShell>
  );
}
