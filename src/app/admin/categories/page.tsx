import { listAdminCategories } from "@/server/services/admin-catalog.service";
import { AdminCategoriesShell } from "@/features/admin/components/admin-categories-shell";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminPageShell } from "@/features/admin/components/admin-page-shell";

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; saved?: string }>;
}) {
  const { edit: editingId, saved } = await searchParams;
  const categories = await listAdminCategories();

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Categories"
        description="Add categories for your catalog, then edit any row to update names or link names."
      />

      <AdminCategoriesShell
        categories={categories}
        editingId={editingId}
        saved={saved === "1"}
      />
    </AdminPageShell>
  );
}
