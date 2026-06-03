import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/resend-client";
import {
  deliveryReadyEmail,
  ORDER_STATUS_LABELS,
  orderStatusEmail,
  orderSubmittedEmail,
  ticketReplyEmail,
} from "@/lib/email/templates";
import type { OrderStatus } from "@/lib/domain/enums";
import type { LocalizedLabel } from "@/lib/i18n/json-label";

function appUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

async function getOrderRecipient(
  orderId: string,
): Promise<{ email: string; locale: string; orderNumber: string; userId: string | null } | null> {
  const admin = createAdminClient();
  const { data: order } = await admin
    .from("orders")
    .select("order_number, guest_email, user_id, locale")
    .eq("id", orderId)
    .maybeSingle();

  if (!order) return null;

  const row = order as {
    order_number: string;
    guest_email: string | null;
    user_id: string | null;
    locale: string;
  };

  if (row.guest_email) {
    return {
      email: row.guest_email,
      locale: row.locale,
      orderNumber: row.order_number,
      userId: null,
    };
  }

  if (row.user_id) {
    const { data: authUser } = await admin.auth.admin.getUserById(row.user_id);
    const email = authUser?.user?.email;
    if (!email) return null;
    return {
      email,
      locale: row.locale,
      orderNumber: row.order_number,
      userId: row.user_id,
    };
  }

  return null;
}

async function getUserEmail(userId: string): Promise<string | null> {
  const admin = createAdminClient();
  const { data } = await admin.auth.admin.getUserById(userId);
  return data?.user?.email ?? null;
}

export async function notifyOrderSubmitted(orderId: string): Promise<void> {
  const recipient = await getOrderRecipient(orderId);
  if (!recipient) return;

  const base = appUrl();
  const trackUrl = `${base}/${recipient.locale}/orders/${recipient.orderNumber}`;
  const { subject, html } = orderSubmittedEmail({
    locale: recipient.locale,
    orderNumber: recipient.orderNumber,
    appUrl: base,
    trackUrl,
  });

  await sendEmail({ to: recipient.email, subject, html });

  await notifyAdminsNewOrder(recipient.orderNumber, recipient.locale);
}

async function notifyAdminsNewOrder(
  orderNumber: string,
  locale: string,
): Promise<void> {
  const admin = createAdminClient();
  const { data: admins } = await admin
    .from("profiles")
    .select("id")
    .eq("role", "admin");

  const base = appUrl();
  const adminUrl = `${base}/admin/orders`;
  const subject = `New order request ${orderNumber}`;
  const html = `<p>A new <strong>order request</strong> <strong>${orderNumber}</strong> is pending review (payment not confirmed yet).</p><p><a href="${adminUrl}">Open admin queue</a></p>`;

  for (const row of admins ?? []) {
    const email = await getUserEmail((row as { id: string }).id);
    if (email) {
      await sendEmail({ to: email, subject, html });
    }
  }

  void locale;
}

export async function notifyOrderStatusChanged(
  orderId: string,
  toStatus: OrderStatus,
): Promise<void> {
  const recipient = await getOrderRecipient(orderId);
  if (!recipient) return;

  const labels = ORDER_STATUS_LABELS[toStatus];
  const statusLabel =
    recipient.locale === "ar" ? labels?.ar : labels?.en ?? toStatus;

  const base = appUrl();
  const trackUrl = `${base}/${recipient.locale}/orders/${recipient.orderNumber}`;
  const { subject, html } = orderStatusEmail({
    locale: recipient.locale,
    orderNumber: recipient.orderNumber,
    statusLabel: statusLabel ?? toStatus,
    trackUrl,
    appUrl: base,
  });

  await sendEmail({ to: recipient.email, subject, html });

  if (recipient.userId) {
    await insertInAppNotification({
      userId: recipient.userId,
      notificationType: "order_status",
      title: { en: "Order updated", ar: "تحديث الطلب" },
      body: {
        en: `${recipient.orderNumber}: ${labels?.en ?? toStatus}`,
        ar: `${recipient.orderNumber}: ${labels?.ar ?? toStatus}`,
      },
      link: `/${recipient.locale}/orders/${recipient.orderNumber}`,
    });
  }
}

export async function notifyDeliveryReady(
  orderItemId: string,
): Promise<void> {
  const admin = createAdminClient();
  const { data: item } = await admin
    .from("order_items")
    .select("order_id, product_name_snapshot")
    .eq("id", orderItemId)
    .maybeSingle();

  if (!item) return;

  const row = item as {
    order_id: string;
    product_name_snapshot: Record<string, string>;
  };

  const recipient = await getOrderRecipient(row.order_id);
  if (!recipient) return;

  const productName =
    row.product_name_snapshot[recipient.locale] ??
    row.product_name_snapshot.en ??
    "Product";

  const base = appUrl();
  const trackUrl = `${base}/${recipient.locale}/orders/${recipient.orderNumber}`;
  const { subject, html } = deliveryReadyEmail({
    locale: recipient.locale,
    orderNumber: recipient.orderNumber,
    productName,
    trackUrl,
    appUrl: base,
  });

  await sendEmail({ to: recipient.email, subject, html });

  if (recipient.userId) {
    await insertInAppNotification({
      userId: recipient.userId,
      notificationType: "delivery_ready",
      title: { en: "Delivery ready", ar: "التسليم جاهز" },
      body: {
        en: `${productName} — ${recipient.orderNumber}`,
        ar: `${productName} — ${recipient.orderNumber}`,
      },
      link: `/${recipient.locale}/orders/${recipient.orderNumber}`,
    });
  }
}

export async function notifyTicketReplyToCustomer(params: {
  ticketNumber: string;
  subject: string;
  customerUserId: string;
  locale: string;
  messagePreview: string;
}): Promise<void> {
  const base = appUrl();
  const ticketUrl = `${base}/${params.locale}/support/tickets/${params.ticketNumber}`;
  const email = await getUserEmail(params.customerUserId);

  if (email) {
    const { subject, html } = ticketReplyEmail({
      locale: params.locale,
      ticketNumber: params.ticketNumber,
      subject: params.subject,
      preview: params.messagePreview.slice(0, 280),
      ticketUrl,
      appUrl: base,
    });
    await sendEmail({ to: email, subject, html });
  }

  await insertInAppNotification({
    userId: params.customerUserId,
    notificationType: "ticket_reply",
    title: { en: "Support reply", ar: "رد الدعم" },
    body: { en: params.subject, ar: params.subject },
    link: `/${params.locale}/support/tickets/${params.ticketNumber}`,
  });
}

async function insertInAppNotification(params: {
  userId: string;
  notificationType: string;
  title: LocalizedLabel;
  body: LocalizedLabel;
  link: string;
}): Promise<void> {
  const admin = createAdminClient();
  await admin.from("notifications").insert({
    user_id: params.userId,
    notification_type: params.notificationType,
    title: params.title,
    body: params.body,
    link: params.link,
  });
}
