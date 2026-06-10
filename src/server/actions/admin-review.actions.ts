"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import type { AdminActionResult } from "@/server/actions/admin-order.actions";
import { writeAuditLog } from "@/server/services/audit.service";
import {
  approveReviewSchema,
  adminReviewSchema,
  deleteReviewSchema,
  approveStoreReviewSchema,
  deleteStoreReviewSchema,
} from "@/validations/admin-review.schema";
import {
  approveAdminProductReview,
  approveAdminStoreReview,
  createAdminProductReview,
  deleteAdminProductReview,
  deleteAdminStoreReview,
} from "@/server/services/admin-review.service";

export type AdminReviewActionResult =
  | { success: true }
  | { success: false; error: string };

export async function createProductReviewAction(
  _prev: AdminReviewActionResult | null,
  formData: FormData,
): Promise<AdminReviewActionResult> {
  const parsed = adminReviewSchema.safeParse({
    productId: formData.get("productId"),
    authorName: formData.get("authorName"),
    rating: formData.get("rating"),
    body: formData.get("body"),
    locale: formData.get("locale"),
    sortOrder: formData.get("sortOrder") ?? 0,
    isApproved: formData.get("isApproved"),
  });

  if (!parsed.success) {
    return { success: false, error: "Invalid review data" };
  }

  try {
    const { user } = await requireAdmin();
    await createAdminProductReview({
      ...parsed.data,
      isApproved: parsed.data.isApproved ?? true,
    });

    void writeAuditLog({
      actorUserId: user.id,
      action: "product.review_created",
      entityType: "product",
      entityId: parsed.data.productId,
    });

    revalidatePath(`/admin/products/${parsed.data.productId}`);
    revalidatePath(`/products`);
    return { success: true };
  } catch {
    return { success: false, error: "Could not save review" };
  }
}

export async function createProductReviewAdminFormAction(
  prev: AdminActionResult | null,
  formData: FormData,
): Promise<AdminActionResult> {
  void prev;
  const result = await createProductReviewAction(null, formData);
  if (result.success) {
    return { success: true, message: "Review added" };
  }
  return { success: false, error: result.error };
}

export async function deleteProductReviewAdminFormAction(
  prev: AdminActionResult | null,
  formData: FormData,
): Promise<AdminActionResult> {
  void prev;
  const result = await deleteProductReviewAction(null, formData);
  if (result.success) {
    return { success: true, message: "Review deleted" };
  }
  return { success: false, error: result.error };
}

export async function approveProductReviewAdminFormAction(
  prev: AdminActionResult | null,
  formData: FormData,
): Promise<AdminActionResult> {
  void prev;
  const parsed = approveReviewSchema.safeParse({
    reviewId: formData.get("reviewId"),
    productId: formData.get("productId"),
  });

  if (!parsed.success) {
    return { success: false, error: "Invalid request" };
  }

  try {
    const { user } = await requireAdmin();
    await approveAdminProductReview(parsed.data.reviewId);

    void writeAuditLog({
      actorUserId: user.id,
      action: "product.review_approved",
      entityType: "product",
      entityId: parsed.data.productId,
    });

    revalidatePath(`/admin/products/${parsed.data.productId}`);
    revalidatePath(`/products`);
    return { success: true, message: "Review approved" };
  } catch {
    return { success: false, error: "Could not approve review" };
  }
}

export async function deleteProductReviewAction(
  _prev: AdminReviewActionResult | null,
  formData: FormData,
): Promise<AdminReviewActionResult> {
  const parsed = deleteReviewSchema.safeParse({
    reviewId: formData.get("reviewId"),
    productId: formData.get("productId"),
  });

  if (!parsed.success) {
    return { success: false, error: "Invalid request" };
  }

  try {
    const { user } = await requireAdmin();
    await deleteAdminProductReview(parsed.data.reviewId);

    void writeAuditLog({
      actorUserId: user.id,
      action: "product.review_deleted",
      entityType: "product",
      entityId: parsed.data.productId,
    });

    revalidatePath(`/admin/products/${parsed.data.productId}`);
    return { success: true };
  } catch {
    return { success: false, error: "Could not delete review" };
  }
}

export async function approveStoreReviewAdminFormAction(
  prev: AdminActionResult | null,
  formData: FormData,
): Promise<AdminActionResult> {
  void prev;
  const parsed = approveStoreReviewSchema.safeParse({
    reviewId: formData.get("reviewId"),
  });

  if (!parsed.success) {
    return { success: false, error: "Invalid request" };
  }

  try {
    const { user } = await requireAdmin();
    await approveAdminStoreReview(parsed.data.reviewId);

    void writeAuditLog({
      actorUserId: user.id,
      action: "store.review_approved",
      entityType: "store",
      entityId: parsed.data.reviewId,
    });

    revalidatePath("/admin/reviews");
    revalidatePath("/");
    return { success: true, message: "Store review approved" };
  } catch {
    return { success: false, error: "Could not approve review" };
  }
}

export async function deleteStoreReviewAdminFormAction(
  prev: AdminActionResult | null,
  formData: FormData,
): Promise<AdminActionResult> {
  void prev;
  const parsed = deleteStoreReviewSchema.safeParse({
    reviewId: formData.get("reviewId"),
  });

  if (!parsed.success) {
    return { success: false, error: "Invalid request" };
  }

  try {
    const { user } = await requireAdmin();
    await deleteAdminStoreReview(parsed.data.reviewId);

    void writeAuditLog({
      actorUserId: user.id,
      action: "store.review_deleted",
      entityType: "store",
      entityId: parsed.data.reviewId,
    });

    revalidatePath("/admin/reviews");
    revalidatePath("/");
    return { success: true, message: "Store review deleted" };
  } catch {
    return { success: false, error: "Could not delete review" };
  }
}
