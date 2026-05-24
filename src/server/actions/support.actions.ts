"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getSession } from "@/server/services/auth.service";
import { notifyTicketReplyToCustomer } from "@/server/services/notification.service";
import {
  createTicket,
  getTicketById,
  replyToTicket,
  updateTicketStatus,
} from "@/server/services/support.service";
import {
  createTicketSchema,
  replyTicketByNumberSchema,
  replyTicketSchema,
  updateTicketStatusSchema,
} from "@/validations/support.schema";

export type SupportActionResult =
  | { success: true; ticketNumber?: string }
  | { success: false; error: string };

function getOptionalAttachment(formData: FormData): File | undefined {
  const raw = formData.get("attachment");
  if (raw instanceof File && raw.size > 0) return raw;
  return undefined;
}

export async function createTicketAction(
  _prev: SupportActionResult | null,
  formData: FormData,
): Promise<SupportActionResult> {
  const user = await getSession();
  if (!user) {
    return { success: false, error: "Sign in required" };
  }

  const parsed = createTicketSchema.safeParse({
    locale: formData.get("locale"),
    subject: formData.get("subject"),
    body: formData.get("body"),
    ticketType: formData.get("ticketType") || "general",
    orderId: formData.get("orderId") || undefined,
  });

  if (!parsed.success) {
    return { success: false, error: "Invalid form" };
  }

  try {
    const { ticketNumber } = await createTicket({
      userId: user.id,
      subject: parsed.data.subject,
      body: parsed.data.body,
      ticketType: parsed.data.ticketType,
      orderId: parsed.data.orderId,
      attachment: getOptionalAttachment(formData),
    });

    revalidatePath(`/${parsed.data.locale}/support`);
    redirect(
      `/${parsed.data.locale}/support/tickets/${ticketNumber}`,
    );
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, error: "Could not create ticket" };
  }
}

export async function replyTicketAction(
  _prev: SupportActionResult | null,
  formData: FormData,
): Promise<SupportActionResult> {
  const user = await getSession();
  if (!user) {
    return { success: false, error: "Sign in required" };
  }

  const parsed = replyTicketByNumberSchema.safeParse({
    ticketNumber: formData.get("ticketNumber"),
    body: formData.get("body"),
  });

  if (!parsed.success) {
    return { success: false, error: "Invalid message" };
  }

  const locale = String(formData.get("locale") ?? "en");

  try {
    const { getTicketByNumber } = await import(
      "@/server/services/support.service"
    );
    const ticket = await getTicketByNumber({
      ticketNumber: parsed.data.ticketNumber,
      userId: user.id,
    });

    if (!ticket) {
      return { success: false, error: "Ticket not found" };
    }

    await replyToTicket({
      ticketId: ticket.id,
      senderUserId: user.id,
      body: parsed.data.body,
      asAdmin: false,
      attachment: getOptionalAttachment(formData),
    });

    revalidatePath(`/${locale}/support/tickets/${parsed.data.ticketNumber}`);
    return { success: true };
  } catch {
    return { success: false, error: "Could not send message" };
  }
}

export async function adminReplyTicketAction(
  _prev: SupportActionResult | null,
  formData: FormData,
): Promise<SupportActionResult> {
  const parsed = replyTicketSchema.safeParse({
    ticketId: formData.get("ticketId"),
    body: formData.get("body"),
  });

  if (!parsed.success) {
    return { success: false, error: "Invalid message" };
  }

  try {
    const { user } = await requireAdmin();
    const ticket = await getTicketById(parsed.data.ticketId);
    if (!ticket) {
      return { success: false, error: "Ticket not found" };
    }

    const admin = await import("@/lib/supabase/admin").then((m) =>
      m.createAdminClient(),
    );
    const { data: ticketRow } = await admin
      .from("support_tickets")
      .select("user_id")
      .eq("id", parsed.data.ticketId)
      .single();

    await replyToTicket({
      ticketId: parsed.data.ticketId,
      senderUserId: user.id,
      body: parsed.data.body,
      asAdmin: true,
      attachment: getOptionalAttachment(formData),
    });

    const customerId = (ticketRow as { user_id: string }).user_id;
    const locale = String(formData.get("locale") ?? "en");

    void notifyTicketReplyToCustomer({
      ticketNumber: ticket.ticketNumber,
      subject: ticket.subject,
      customerUserId: customerId,
      locale,
      messagePreview: parsed.data.body,
    }).catch(() => undefined);

    revalidatePath(`/admin/tickets/${parsed.data.ticketId}`);
    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, error: "Could not send reply" };
  }
}

export async function adminUpdateTicketStatusAction(
  _prev: SupportActionResult | null,
  formData: FormData,
): Promise<SupportActionResult> {
  const parsed = updateTicketStatusSchema.safeParse({
    ticketId: formData.get("ticketId"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { success: false, error: "Invalid status" };
  }

  try {
    await requireAdmin();
    await updateTicketStatus(parsed.data.ticketId, parsed.data.status);
    revalidatePath(`/admin/tickets/${parsed.data.ticketId}`);
    revalidatePath("/admin/tickets");
    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, error: "Could not update status" };
  }
}
