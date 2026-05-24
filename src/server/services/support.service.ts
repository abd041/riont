import { createAdminClient } from "@/lib/supabase/admin";
import { ServiceError } from "@/lib/domain/errors";
import { generateTicketNumber } from "@/lib/crypto/tokens";
import { resolveSupportAttachmentUrl } from "@/lib/storage/media-url";
import {
  linkAttachmentToMessage,
  uploadSupportAttachment,
} from "@/server/services/support-attachment.service";
import type {
  SupportMessage,
  SupportTicketDetail,
  SupportTicketListItem,
  SupportTicketStatus,
  SupportTicketType,
} from "@/types/support";

export async function createTicket(params: {
  userId: string;
  subject: string;
  body: string;
  ticketType?: SupportTicketType;
  orderId?: string;
  orderItemId?: string;
  initialSenderType?: "customer" | "system";
  attachment?: File;
}): Promise<{ ticketId: string; ticketNumber: string }> {
  const admin = createAdminClient();
  const ticketNumber = generateTicketNumber();
  const ticketType = params.ticketType ?? "general";

  if (params.orderId) {
    const { data: order } = await admin
      .from("orders")
      .select("user_id")
      .eq("id", params.orderId)
      .maybeSingle();

    if (!order || (order as { user_id: string | null }).user_id !== params.userId) {
      throw new ServiceError("FORBIDDEN", "Order not found");
    }
  }

  const { data: ticket, error } = await admin
    .from("support_tickets")
    .insert({
      ticket_number: ticketNumber,
      user_id: params.userId,
      order_id: params.orderId ?? null,
      order_item_id: params.orderItemId ?? null,
      ticket_type: ticketType,
      status: "open",
      subject: params.subject.trim(),
    })
    .select("id")
    .single();

  if (error || !ticket) {
    throw new ServiceError("INTERNAL", "Failed to create ticket");
  }

  const ticketId = (ticket as { id: string }).id;

  const { data: message, error: messageError } = await admin
    .from("support_messages")
    .insert({
      ticket_id: ticketId,
      sender_user_id:
        params.initialSenderType === "system" ? null : params.userId,
      sender_type: params.initialSenderType ?? "customer",
      body: params.body.trim(),
    })
    .select("id")
    .single();

  if (messageError || !message) {
    throw new ServiceError("INTERNAL", "Failed to create ticket message");
  }

  const messageId = (message as { id: string }).id;

  if (params.attachment) {
    const uploaded = await uploadSupportAttachment(
      ticketId,
      messageId,
      params.attachment,
    );
    await linkAttachmentToMessage(messageId, uploaded);
  }

  return { ticketId, ticketNumber };
}

export async function ensureFulfillmentTicketsForOrder(
  orderId: string,
): Promise<void> {
  const admin = createAdminClient();
  const { data: order } = await admin
    .from("orders")
    .select("user_id, order_number, locale")
    .eq("id", orderId)
    .maybeSingle();

  if (!order) return;

  const orderRow = order as {
    user_id: string | null;
    order_number: string;
    locale: string;
  };

  if (!orderRow.user_id) return;

  const { data: items } = await admin
    .from("order_items")
    .select("id, delivery_mode, product_name_snapshot")
    .eq("order_id", orderId)
    .eq("delivery_mode", "manual");

  for (const raw of items ?? []) {
    const item = raw as {
      id: string;
      product_name_snapshot: Record<string, string>;
    };

    const { data: existing } = await admin
      .from("support_tickets")
      .select("id")
      .eq("order_item_id", item.id)
      .eq("ticket_type", "fulfillment")
      .maybeSingle();

    if (existing) continue;

    const name =
      item.product_name_snapshot[orderRow.locale] ??
      item.product_name_snapshot.en ??
      "Product";

    await createTicket({
      userId: orderRow.user_id,
      subject: `Fulfillment: ${name} (${orderRow.order_number})`,
      body:
        orderRow.locale === "ar"
          ? "طلبك قيد المعالجة اليدوية. يمكنك الرد هنا لأي تحديثات أو أسئلة."
          : "Your order is being fulfilled manually. Reply here for updates or questions.",
      ticketType: "fulfillment",
      orderId,
      orderItemId: item.id,
      initialSenderType: "system",
    });
  }
}

export async function replyToTicket(params: {
  ticketId: string;
  senderUserId: string;
  body: string;
  asAdmin: boolean;
  attachment?: File;
}): Promise<void> {
  const admin = createAdminClient();
  const trimmed = params.body.trim();
  if (!trimmed) {
    throw new ServiceError("VALIDATION", "Message is required");
  }

  const { data: ticket, error } = await admin
    .from("support_tickets")
    .select("id, user_id, status, ticket_number, subject")
    .eq("id", params.ticketId)
    .maybeSingle();

  if (error || !ticket) {
    throw new ServiceError("NOT_FOUND", "Ticket not found");
  }

  const row = ticket as {
    id: string;
    user_id: string;
    status: SupportTicketStatus;
    ticket_number: string;
    subject: string;
  };

  if (!params.asAdmin && row.user_id !== params.senderUserId) {
    throw new ServiceError("FORBIDDEN", "Not allowed");
  }

  if (row.status === "closed") {
    throw new ServiceError("VALIDATION", "Ticket is closed");
  }

  const { data: message, error: messageError } = await admin
    .from("support_messages")
    .insert({
      ticket_id: params.ticketId,
      sender_user_id: params.senderUserId,
      sender_type: params.asAdmin ? "admin" : "customer",
      body: trimmed,
    })
    .select("id")
    .single();

  if (messageError || !message) {
    throw new ServiceError("INTERNAL", "Failed to send message");
  }

  if (params.attachment) {
    const messageId = (message as { id: string }).id;
    const uploaded = await uploadSupportAttachment(
      params.ticketId,
      messageId,
      params.attachment,
    );
    await linkAttachmentToMessage(messageId, uploaded);
  }

  const newStatus: SupportTicketStatus = params.asAdmin
    ? "waiting_customer"
    : "waiting_admin";

  await admin
    .from("support_tickets")
    .update({
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.ticketId);
}

export async function updateTicketStatus(
  ticketId: string,
  status: SupportTicketStatus,
): Promise<void> {
  const admin = createAdminClient();
  const updates: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (status === "closed" || status === "resolved") {
    updates.closed_at = new Date().toISOString();
  }

  const { error } = await admin
    .from("support_tickets")
    .update(updates)
    .eq("id", ticketId);

  if (error) throw error;
}

export async function listCustomerTickets(
  userId: string,
): Promise<SupportTicketListItem[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("support_tickets")
    .select(
      `
      id,
      ticket_number,
      subject,
      status,
      ticket_type,
      updated_at,
      orders (order_number),
      support_messages (body, created_at)
    `,
    )
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) throw error;

  return mapTicketList(data ?? []);
}

export async function listAdminTickets(
  status?: SupportTicketStatus,
  limit = 50,
): Promise<SupportTicketListItem[]> {
  const admin = createAdminClient();
  let query = admin
    .from("support_tickets")
    .select(
      `
      id,
      ticket_number,
      subject,
      status,
      ticket_type,
      updated_at,
      orders (order_number),
      support_messages (body, created_at)
    `,
    )
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) throw error;

  return mapTicketList(data ?? []);
}

function mapTicketList(rows: unknown[]): SupportTicketListItem[] {
  return rows.map((raw) => {
    const row = raw as {
      id: string;
      ticket_number: string;
      subject: string;
      status: SupportTicketStatus;
      ticket_type: SupportTicketType;
      updated_at: string;
      orders: { order_number: string } | { order_number: string }[] | null;
      support_messages: Array<{ body: string; created_at: string }>;
    };

    const orderRel = row.orders;
    const orderNumber = Array.isArray(orderRel)
      ? orderRel[0]?.order_number ?? null
      : orderRel?.order_number ?? null;

    const messages = [...(row.support_messages ?? [])].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    return {
      id: row.id,
      ticketNumber: row.ticket_number,
      subject: row.subject,
      status: row.status,
      ticketType: row.ticket_type,
      orderNumber,
      updatedAt: row.updated_at,
      lastMessagePreview: messages[0]?.body?.slice(0, 120) ?? null,
    };
  });
}

export async function getTicketByNumber(params: {
  ticketNumber: string;
  userId: string;
  asAdmin?: boolean;
}): Promise<SupportTicketDetail | null> {
  const admin = createAdminClient();
  const query = admin
    .from("support_tickets")
    .select(
      `
      id,
      ticket_number,
      subject,
      status,
      ticket_type,
      order_id,
      created_at,
      updated_at,
      user_id,
      orders (order_number),
      support_messages (
        id,
        sender_type,
        body,
        created_at,
        sender_user_id,
        profiles (display_name),
        support_message_attachments (
          id,
          storage_path,
          file_name,
          mime_type
        )
      )
    `,
    )
    .eq("ticket_number", params.ticketNumber);

  const { data, error } = await query.maybeSingle();
  if (error || !data) return null;

  const row = data as unknown as Parameters<typeof mapTicketDetail>[0] & {
    user_id: string;
  };

  if (!params.asAdmin && row.user_id !== params.userId) {
    return null;
  }

  return mapTicketDetail(row);
}

export async function getTicketById(
  ticketId: string,
): Promise<SupportTicketDetail | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("support_tickets")
    .select(
      `
      id,
      ticket_number,
      subject,
      status,
      ticket_type,
      order_id,
      created_at,
      updated_at,
      user_id,
      orders (order_number),
      support_messages (
        id,
        sender_type,
        body,
        created_at,
        sender_user_id,
        profiles (display_name),
        support_message_attachments (
          id,
          storage_path,
          file_name,
          mime_type
        )
      )
    `,
    )
    .eq("id", ticketId)
    .maybeSingle();

  if (error || !data) return null;
  return mapTicketDetail(data as unknown as Parameters<typeof mapTicketDetail>[0]);
}

function mapTicketDetail(row: {
  id: string;
  ticket_number: string;
  subject: string;
  status: SupportTicketStatus;
  ticket_type: SupportTicketType;
  order_id: string | null;
  created_at: string;
  updated_at: string;
  orders: { order_number: string } | { order_number: string }[] | null;
  support_messages: Array<{
    id: string;
    sender_type: string;
    body: string;
    created_at: string;
    sender_user_id: string | null;
    profiles: { display_name: string | null } | { display_name: string | null }[] | null;
    support_message_attachments?: Array<{
      id: string;
      storage_path: string;
      file_name: string;
      mime_type: string | null;
    }>;
  }>;
}): SupportTicketDetail {
  const messages: SupportMessage[] = [...row.support_messages]
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    )
    .map((msg) => {
      const profile = Array.isArray(msg.profiles)
        ? msg.profiles[0]
        : msg.profiles;
      const senderLabel =
        msg.sender_type === "system"
          ? "System"
          : msg.sender_type === "admin"
            ? profile?.display_name ?? "Support"
            : profile?.display_name ?? "You";

      const attachments = (msg.support_message_attachments ?? []).map((a) => ({
        id: a.id,
        fileName: a.file_name,
        url: resolveSupportAttachmentUrl(a.storage_path),
        mimeType: a.mime_type,
      }));

      return {
        id: msg.id,
        senderType: msg.sender_type as SupportMessage["senderType"],
        body: msg.body,
        createdAt: msg.created_at,
        senderLabel,
        attachments,
      };
    });

  return {
    id: row.id,
    ticketNumber: row.ticket_number,
    subject: row.subject,
    status: row.status,
    ticketType: row.ticket_type,
    orderId: row.order_id,
    orderNumber: (() => {
      const o = row.orders;
      if (!o) return null;
      if (Array.isArray(o)) return o[0]?.order_number ?? null;
      return o.order_number;
    })(),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    messages,
  };
}

export async function createOrderIssueTicket(params: {
  userId: string;
  orderId: string;
  subject: string;
  body: string;
}): Promise<{ ticketNumber: string }> {
  const { ticketNumber } = await createTicket({
    userId: params.userId,
    subject: params.subject,
    body: params.body,
    ticketType: "order_issue",
    orderId: params.orderId,
  });
  return { ticketNumber };
}
