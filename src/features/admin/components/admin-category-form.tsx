"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveCategoryAction } from "@/server/actions/admin-catalog.actions";
import type { AdminCategoryRow } from "@/server/services/admin-catalog.service";

export function AdminCategoryForm({ category }: { category?: AdminCategoryRow }) {
  const [state, action, pending] = useActionState(saveCategoryAction, null);

  useEffect(() => {
    if (!state) return;
    if (state.success) toast.success(state.message ?? "Saved");
    else toast.error(state.error);
  }, [state]);

  return (
    <form action={action} className="glass-card space-y-4 rounded-[var(--radius-lg)] p-6">
      {category && <input type="hidden" name="categoryId" value={category.id} />}
      <Input name="sortOrder" type="number" placeholder="Sort order" defaultValue={category?.sortOrder ?? 0} />
      <Input name="iconUrl" placeholder="Icon path (e.g. catalog/categories/gaming.jpg)" defaultValue={category?.iconUrl ?? ""} />
      <div className="grid gap-4 sm:grid-cols-2">
        <fieldset className="space-y-2 border border-[var(--border-subtle)] p-3 rounded-md">
          <legend className="text-sm font-medium">English</legend>
          <Input name="enName" placeholder="Name" required defaultValue={category?.enName} />
          <Input name="enSlug" placeholder="Slug" required defaultValue={category?.enSlug} />
          <textarea name="enDescription" placeholder="Description" rows={2} defaultValue="" className="w-full rounded-md border border-[var(--border-default)] bg-surface px-3 py-2 text-sm" />
        </fieldset>
        <fieldset className="space-y-2 border border-[var(--border-subtle)] p-3 rounded-md">
          <legend className="text-sm font-medium">Arabic</legend>
          <Input name="arName" placeholder="الاسم" required defaultValue={category?.arName} />
          <Input name="arSlug" placeholder="Slug" required defaultValue={category?.arSlug} />
        </fieldset>
      </div>
      <Button type="submit" disabled={pending}>Save category</Button>
    </form>
  );
}
