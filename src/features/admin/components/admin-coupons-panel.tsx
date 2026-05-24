"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminCouponForm } from "./admin-coupon-form";
import { DeleteCouponButton } from "./delete-coupon-button";
import type { AdminCouponRow } from "@/server/services/admin-catalog.service";

export function AdminCouponsPanel({ coupons }: { coupons: AdminCouponRow[] }) {
  const [editing, setEditing] = useState<AdminCouponRow | null>(null);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-4 text-lg font-semibold">
          {editing ? `Edit: ${editing.code}` : "Create coupon"}
        </h2>
        <AdminCouponForm
          key={editing?.id ?? "new"}
          coupon={editing ?? undefined}
          onCancel={editing ? () => setEditing(null) : undefined}
          onSaved={() => setEditing(null)}
        />
      </div>

      <div className="glass-card overflow-hidden rounded-[var(--radius-lg)]">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
            <tr>
              <th className="px-4 py-3 text-start">Code</th>
              <th className="px-4 py-3 text-start">Type</th>
              <th className="px-4 py-3 text-start">Value</th>
              <th className="px-4 py-3 text-start">Usage</th>
              <th className="px-4 py-3 text-start">Status</th>
              <th className="px-4 py-3 text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-[var(--text-muted)]"
                >
                  No coupons yet.
                </td>
              </tr>
            ) : (
              coupons.map((c) => (
                <tr
                  key={c.id}
                  className={`border-b border-[var(--border-subtle)] ${
                    editing?.id === c.id ? "bg-accent-500/5" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-mono font-medium" dir="ltr">
                    {c.code}
                  </td>
                  <td className="px-4 py-3">{c.couponType}</td>
                  <td className="px-4 py-3">
                    {c.couponType === "percent" ? `${c.value}%` : `$${(c.value / 100).toFixed(2)}`}
                  </td>
                  <td className="px-4 py-3">
                    {c.usageCount}
                    {c.usageLimit != null ? ` / ${c.usageLimit}` : ""}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={c.isActive ? "success" : "default"}>
                      {c.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Edit ${c.code}`}
                        onClick={() => setEditing(c)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <DeleteCouponButton couponId={c.id} code={c.code} />
                    </div>
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
