"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { archiveCategoryAction } from "@/server/actions/admin-catalog.actions";

export function AdminCategoryArchiveButton({
  categoryId,
  categoryName,
}: {
  categoryId: string;
  categoryName: string;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState(archiveCategoryAction, null);

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message ?? "Category archived");
      router.push("/admin/categories");
      router.refresh();
    } else {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <form action={action} className="admin-category-archive">
      <input type="hidden" name="categoryId" value={categoryId} />
      <p className="admin-category-archive__hint">
        Hides <strong>{categoryName}</strong> from the storefront. Products must be
        archived or moved first.
      </p>
      <Button
        type="submit"
        variant="outline"
        disabled={pending}
        className="admin-category-archive__btn"
      >
        {pending ? "Hiding…" : "Hide from storefront"}
      </Button>
    </form>
  );
}
