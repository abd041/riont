import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAdminProductEdit,
  listCategoryOptions,
} from "@/server/services/admin-catalog.service";
import { AdminProductForm } from "@/features/admin/components/admin-product-form";

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
    <div className="space-y-6">
      <Link href="/admin/products" className="text-sm text-accent-400 hover:underline">
        ← Products
      </Link>
      <h1 className="text-2xl font-bold">Edit product</h1>
      <AdminProductForm product={product} categories={categories} />
    </div>
  );
}
