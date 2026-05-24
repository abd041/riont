import { listCategoryOptions } from "@/server/services/admin-catalog.service";
import { AdminProductForm } from "@/features/admin/components/admin-product-form";

export default async function AdminNewProductPage() {
  const categories = await listCategoryOptions();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">New product</h1>
      <AdminProductForm categories={categories} />
    </div>
  );
}
