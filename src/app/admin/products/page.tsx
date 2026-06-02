import Link from "next/link";
import { listAdminProducts } from "@/server/services/admin-catalog.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AdminDataTable,
  AdminTableEmpty,
} from "@/features/admin/components/admin-data-table";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminPageShell } from "@/features/admin/components/admin-page-shell";

export default async function AdminProductsPage() {
  const products = await listAdminProducts();

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Products"
        description="Manage catalog, pricing, delivery mode, and translations."
        actions={
          <Button asChild>
            <Link href="/admin/products/new">Add product</Link>
          </Button>
        }
      />

      <AdminDataTable columns={["Name", "Category", "Status", "Delivery", "Price"]}>
        {products.length === 0 ? (
          <AdminTableEmpty colSpan={5} message="No products yet." />
        ) : (
          products.map((p) => (
            <tr key={p.id}>
              <td>
                <Link href={`/admin/products/${p.id}`} className="admin-table__link">
                  {p.name}
                </Link>
                {p.isFeatured && (
                  <Badge variant="accent" className="ms-2">
                    Featured
                  </Badge>
                )}
              </td>
              <td>{p.categoryName}</td>
              <td>{p.status}</td>
              <td>{p.deliveryMode}</td>
              <td dir="ltr">${(p.priceCents / 100).toFixed(2)}</td>
            </tr>
          ))
        )}
      </AdminDataTable>
    </AdminPageShell>
  );
}
