"use server";

import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { ServiceError } from "@/lib/domain/errors";
import { OrderStatus } from "@/lib/domain/enums";
import { requireAdmin } from "@/lib/auth/require-admin";
import { transitionOrderStatus } from "@/server/services/admin-order.service";
import {
  fulfillAutoOrderItem,
  manualDeliverOrderItem,
  processAutoFulfillmentForOrder,
} from "@/server/services/delivery.service";
import { addInventoryLines } from "@/server/services/inventory.service";
import {
  addInventorySchema,
  adminNoteSchema,
  manualDeliverSchema,
  transitionOrderSchema,
} from "@/validations/admin.schema";
import { createAdminClient } from "@/lib/supabase/admin";

export type AdminActionResult =
  | { success: true; message?: string }
  | { success: false; error: string };

export async function transitionOrderAction(
  _prev: AdminActionResult | null,
  formData: FormData,
): Promise<AdminActionResult> {
  const parsed = transitionOrderSchema.safeParse({
    orderId: formData.get("orderId"),
    toStatus: formData.get("toStatus"),
    note: formData.get("note") || undefined,
  });

  if (!parsed.success) {
    return { success: false, error: "Invalid request" };
  }

  try {
    const { user } = await requireAdmin();
    await transitionOrderStatus({
      orderId: parsed.data.orderId,
      toStatus: parsed.data.toStatus,
      adminUserId: user.id,
      note: parsed.data.note,
    });

    if (parsed.data.toStatus === OrderStatus.PROCESSING) {
      const result = await processAutoFulfillmentForOrder(
        parsed.data.orderId,
        user.id,
      );
      revalidatePath(`/admin/orders/${parsed.data.orderId}`);
      revalidatePath("/admin/orders");
      if (result.errors.length > 0) {
        return {
          success: true,
          message: `Status updated. Auto-delivery issues: ${result.errors.join("; ")}`,
        };
      }
      if (result.fulfilled > 0) {
        return {
          success: true,
          message: `Status updated. Auto-delivered ${result.fulfilled} item(s).`,
        };
      }
    }

    revalidatePath(`/admin/orders/${parsed.data.orderId}`);
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    if (error instanceof ServiceError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Could not update order" };
  }
}

export async function fulfillAutoItemAction(
  _prev: AdminActionResult | null,
  formData: FormData,
): Promise<AdminActionResult> {
  const orderItemId = formData.get("orderItemId");
  if (typeof orderItemId !== "string") {
    return { success: false, error: "Invalid item" };
  }

  try {
    const { user } = await requireAdmin();
    await fulfillAutoOrderItem(orderItemId, user.id);
    const orderId = formData.get("orderId");
    if (typeof orderId === "string") {
      revalidatePath(`/admin/orders/${orderId}`);
    }
    revalidatePath("/admin/orders");
    return { success: true, message: "Auto delivery completed" };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    if (error instanceof ServiceError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Auto delivery failed" };
  }
}

export async function manualDeliverAction(
  _prev: AdminActionResult | null,
  formData: FormData,
): Promise<AdminActionResult> {
  const parsed = manualDeliverSchema.safeParse({
    orderItemId: formData.get("orderItemId"),
    deliveryText: formData.get("deliveryText"),
  });

  if (!parsed.success) {
    return { success: false, error: "Delivery content is required" };
  }

  try {
    const { user } = await requireAdmin();
    await manualDeliverOrderItem(
      parsed.data.orderItemId,
      parsed.data.deliveryText,
      user.id,
    );
    const orderId = formData.get("orderId");
    if (typeof orderId === "string") {
      revalidatePath(`/admin/orders/${orderId}`);
    }
    revalidatePath("/admin/orders");
    return { success: true, message: "Manual delivery saved" };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    if (error instanceof ServiceError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Manual delivery failed" };
  }
}

export async function addInventoryAction(
  _prev: AdminActionResult | null,
  formData: FormData,
): Promise<AdminActionResult> {
  const parsed = addInventorySchema.safeParse({
    productId: formData.get("productId"),
    payloads: formData.get("payloads"),
  });

  if (!parsed.success) {
    return { success: false, error: "Invalid inventory payload" };
  }

  const lines = parsed.data.payloads
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return { success: false, error: "Add at least one line of inventory" };
  }

  try {
    await requireAdmin();
    const count = await addInventoryLines(parsed.data.productId, lines);
    revalidatePath("/admin/orders");
    return {
      success: true,
      message: `Added ${count} inventory line(s)`,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, error: "Could not add inventory" };
  }
}

export async function updateAdminNoteAction(
  _prev: AdminActionResult | null,
  formData: FormData,
): Promise<AdminActionResult> {
  const parsed = adminNoteSchema.safeParse({
    orderId: formData.get("orderId"),
    adminNote: formData.get("adminNote") ?? "",
  });

  if (!parsed.success) {
    return { success: false, error: "Invalid note" };
  }

  try {
    await requireAdmin();
    const admin = createAdminClient();
    const { error } = await admin
      .from("orders")
      .update({
        admin_note: parsed.data.adminNote.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", parsed.data.orderId);

    if (error) throw error;

    revalidatePath(`/admin/orders/${parsed.data.orderId}`);
    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, error: "Could not save note" };
  }
}
