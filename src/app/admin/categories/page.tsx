import { listAdminCategories } from "@/server/services/admin-catalog.service";
import { AdminCategoryForm } from "@/features/admin/components/admin-category-form";

export default async function AdminCategoriesPage() {
  const categories = await listAdminCategories();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Categories</h1>
        <p className="text-sm text-[var(--text-muted)]">Reorder and edit category names and slugs.</p>
      </div>

      <AdminCategoryForm />

      <div className="glass-card overflow-hidden rounded-[var(--radius-lg)]">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
            <tr>
              <th className="px-4 py-3 text-start">EN</th>
              <th className="px-4 py-3 text-start">AR</th>
              <th className="px-4 py-3">Order</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-[var(--border-subtle)]">
                <td className="px-4 py-3">{c.enName}</td>
                <td className="px-4 py-3">{c.arName}</td>
                <td className="px-4 py-3 text-center">{c.sortOrder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
