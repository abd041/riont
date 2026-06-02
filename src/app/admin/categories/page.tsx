import { listAdminCategories } from "@/server/services/admin-catalog.service";
import { AdminCategoryForm } from "@/features/admin/components/admin-category-form";
import {
  AdminDataTable,
} from "@/features/admin/components/admin-data-table";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminPageShell } from "@/features/admin/components/admin-page-shell";
import { AdminPanel } from "@/features/admin/components/admin-panel";

export default async function AdminCategoriesPage() {
  const categories = await listAdminCategories();

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Categories"
        description="Reorder and edit category names and slugs."
      />

      <AdminPanel title="Add or edit category">
        <AdminCategoryForm />
      </AdminPanel>

      <AdminDataTable columns={["EN", "AR", "Order"]}>
        {categories.map((c) => (
          <tr key={c.id}>
            <td>{c.enName}</td>
            <td>{c.arName}</td>
            <td className="text-center">{c.sortOrder}</td>
          </tr>
        ))}
      </AdminDataTable>
    </AdminPageShell>
  );
}
