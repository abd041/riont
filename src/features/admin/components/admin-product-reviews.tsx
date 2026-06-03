"use client";

import {
  approveProductReviewAdminFormAction,
  createProductReviewAdminFormAction,
  deleteProductReviewAdminFormAction,
} from "@/server/actions/admin-review.actions";
import type { AdminProductReview } from "@/server/services/admin-review.service";
import { AdminActionForm } from "./admin-action-form";
import { AdminPanel } from "./admin-panel";

const fieldClass =
  "flex h-10 w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-surface px-3 text-sm";

export function AdminProductReviews({
  productId,
  reviews,
}: {
  productId: string;
  reviews: AdminProductReview[];
}) {
  return (
    <AdminPanel title="Product reviews">
      {reviews.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">No reviews yet.</p>
      ) : (
        <ul className="space-y-3 mb-6">
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
                    action={approveProductReviewAdminFormAction}
                    submitLabel="Approve"
                    variant="primary"
                  >
                    <input type="hidden" name="reviewId" value={review.id} />
                    <input type="hidden" name="productId" value={productId} />
                  </AdminActionForm>
                ) : null}
                <AdminActionForm
                  action={deleteProductReviewAdminFormAction}
                  submitLabel="Delete"
                  variant="outline"
                >
                  <input type="hidden" name="reviewId" value={review.id} />
                  <input type="hidden" name="productId" value={productId} />
                </AdminActionForm>
              </div>
            </li>
          ))}
        </ul>
      )}

      <h3 className="text-sm font-semibold mb-3">Add review</h3>
      <AdminActionForm action={createProductReviewAdminFormAction} submitLabel="Add review">
        <input type="hidden" name="productId" value={productId} />
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            name="authorName"
            required
            placeholder="Author name"
            className={fieldClass}
          />
          <input
            name="rating"
            type="number"
            min={1}
            max={5}
            required
            defaultValue={5}
            placeholder="Rating 1–5"
            className={fieldClass}
          />
          <select name="locale" defaultValue="en" className={fieldClass}>
            <option value="en">English</option>
            <option value="ar">Arabic</option>
          </select>
          <input
            name="sortOrder"
            type="number"
            min={0}
            defaultValue={0}
            placeholder="Sort order"
            className={fieldClass}
          />
        </div>
        <textarea
          name="body"
          required
          rows={3}
          placeholder="Review text"
          className="mt-3 flex w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-surface px-3 py-2 text-sm"
        />
        <label className="mt-3 flex items-center gap-2 text-sm">
          <input type="checkbox" name="isApproved" defaultChecked />
          Visible on storefront
        </label>
      </AdminActionForm>
    </AdminPanel>
  );
}
