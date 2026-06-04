import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AdminPanel } from "./admin-panel";

export function AdminNewProductEmpty() {
  return (
    <AdminPanel title="Create a category first">
      <p className="text-sm leading-relaxed text-[var(--text-muted)]">
        Every product belongs to a category (e.g. Gift Cards, Software). Add at
        least one category, then come back here to add products.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/admin/categories">Go to categories</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/products">Back to products</Link>
        </Button>
      </div>
    </AdminPanel>
  );
}
