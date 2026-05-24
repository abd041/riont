import Link from "next/link";
import { listAdminProducts } from "@/server/services/admin-catalog.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function AdminProductsPage() {
  const products = await listAdminProducts();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Manage catalog, pricing, delivery mode, and translations.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">Add product</Link>
        </Button>
      </div>

      <div className="glass-card overflow-hidden rounded-[var(--radius-lg)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Delivery</th>
              <th className="px-4 py-3">Price</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[var(--text-muted)]">
                  No products yet.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-[var(--border-subtle)] hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="font-medium text-accent-400 hover:underline"
                    >
                      {p.name}
                    </Link>
                    {p.isFeatured && (
                      <Badge variant="accent" className="ms-2">
                        Featured
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">{p.categoryName}</td>
                  <td className="px-4 py-3">{p.status}</td>
                  <td className="px-4 py-3">{p.deliveryMode}</td>
                  <td className="px-4 py-3" dir="ltr">
                    ${(p.priceCents / 100).toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
