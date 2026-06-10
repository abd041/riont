"use client";

import {
  approveStoreReviewAdminFormAction,
  deleteStoreReviewAdminFormAction,
} from "@/server/actions/admin-review.actions";
import type { AdminStoreReview } from "@/server/services/admin-review.service";
import { AdminActionForm } from "./admin-action-form";
import { AdminPanel } from "./admin-panel";

export function AdminStoreReviews({ reviews }: { reviews: AdminStoreReview[] }) {
  const pending = reviews.filter((r) => !r.isApproved);

  return (
    <AdminPanel title="Store reviews (homepage)">
      <p className="text-sm text-[var(--text-muted)] mb-4">
        Customer reviews about the store appear on the homepage after approval.
      </p>

      {pending.length > 0 ? (
        <p className="text-sm text-amber-300 mb-4">
          {pending.length} review{pending.length === 1 ? "" : "s"} waiting for approval.
        </p>
      ) : null}

      {reviews.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">No store reviews yet.</p>
      ) : (
        <ul className="space-y-3">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="rounded-[var(--radius-md)] border border-[var(--border-default)] p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-sm">
                  {review.authorName} · {review.rating}/5 · {review.locale.toUpperCase()}
                </span>
                <span
                  className={`text-xs ${review.isApproved ? "text-emerald-400" : "text-amber-400"}`}
                >
                  {review.isApproved ? "Approved" : "Pending approval"}
                </span>
              </div>
              <p className="mt-2 text-sm text-[var(--text-muted)]">{review.body}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {!review.isApproved ? (
                  <AdminActionForm
                    action={approveStoreReviewAdminFormAction}
                    submitLabel="Approve"
                    variant="primary"
                  >
                    <input type="hidden" name="reviewId" value={review.id} />
                  </AdminActionForm>
                ) : null}
                <AdminActionForm
                  action={deleteStoreReviewAdminFormAction}
                  submitLabel="Delete"
                  variant="outline"
                >
                  <input type="hidden" name="reviewId" value={review.id} />
                </AdminActionForm>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AdminPanel>
  );
}
