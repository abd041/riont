"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/utils/cn";
import type { AdminCategoryRow } from "@/server/services/admin-catalog.service";
import { AdminCategoryForm } from "./admin-category-form";
import { AdminDataTable, AdminTableEmpty } from "./admin-data-table";
import { AdminPanel } from "./admin-panel";

type AdminCategoriesShellProps = {
  categories: AdminCategoryRow[];
  editingId?: string;
  saved?: boolean;
};

export function AdminCategoriesShell({
  categories,
  editingId,
  saved,
}: AdminCategoriesShellProps) {
  const router = useRouter();
  const editing = editingId
    ? categories.find((c) => c.id === editingId)
    : undefined;

  return (
    <>
      {saved && (
        <div className="admin-banner admin-banner--success" role="status">
          <p className="admin-banner__title">Category saved</p>
        </div>
      )}

      <AdminPanel
        title={editing ? `Edit: ${editing.enName}` : "Add new category"}
      >
        {editing && (
          <p className="mb-4 text-sm text-[var(--text-muted)]">
            Update names, link names, or order below.{" "}
            <Link href="/admin/categories" className="text-[#a78bfa] underline">
              Add a different category
            </Link>
          </p>
        )}
        <AdminCategoryForm
          key={editing?.id ?? "new"}
          category={editing}
          onSaved={(categoryId) => {
            router.push(`/admin/categories?edit=${categoryId}&saved=1`);
            router.refresh();
          }}
        />
      </AdminPanel>

      <div>
        <h2 className="admin-dashboard-section__title">All categories</h2>
        <p className="mb-3 text-sm text-[var(--text-muted)]">
          Click a row or Edit to change an existing category.
        </p>
        <AdminDataTable columns={["English", "Arabic", "Order", ""]}>
          {categories.length === 0 ? (
            <AdminTableEmpty
              colSpan={4}
              message="No categories yet. Use the form above to add your first one."
            />
          ) : (
            categories.map((c) => {
              const isActive = editingId === c.id;
              return (
                <tr
                  key={c.id}
                  className={cn(isActive && "admin-table__row--active")}
                >
                  <td>
                    <Link
                      href={`/admin/categories?edit=${c.id}`}
                      className="admin-table__link"
                    >
                      {c.enName}
                    </Link>
                    <span className="block text-xs text-[var(--text-muted)]" dir="ltr">
                      /en/categories/{c.enSlug}
                    </span>
                  </td>
                  <td>
                    {c.arName}
                    <span className="block text-xs text-[var(--text-muted)]" dir="ltr">
                      /ar/categories/{c.arSlug}
                    </span>
                  </td>
                  <td className="text-center">{c.sortOrder}</td>
                  <td className="text-end">
                    <Link
                      href={`/admin/categories?edit=${c.id}`}
                      className={cn(
                        "admin-table__action",
                        isActive && "admin-table__action--active",
                      )}
                    >
                      {isActive ? "Editing" : "Edit"}
                    </Link>
                  </td>
                </tr>
              );
            })
          )}
        </AdminDataTable>
      </div>
    </>
  );
}
