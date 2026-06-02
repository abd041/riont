import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAdminProductEdit,
  listCategoryOptions,
} from "@/server/services/admin-catalog.service";
import { AdminProductForm } from "@/features/admin/components/admin-product-form";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminPageShell } from "@/features/admin/components/admin-page-shell";

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getAdminProductEdit(id),
    listCategoryOptions(),
  ]);

  if (!product) notFound();

  return (
    <AdminPageShell>
      <Link href="/admin/products" className="admin-back">
        ← Products
      </Link>
      <AdminPageHeader
        title="Edit product"
        description={product.en.name}
      />
      <AdminProductForm product={product} categories={categories} />
    </AdminPageShell>
  );
}
