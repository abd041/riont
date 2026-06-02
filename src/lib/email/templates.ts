const APP_NAME = "riyont";

export function orderSubmittedEmail(params: {
  locale: string;
  orderNumber: string;
  appUrl: string;
  trackUrl: string;
}): { subject: string; html: string } {
  const ar = params.locale === "ar";
  const subject = ar
    ? `${APP_NAME} — تم استلام طلبك ${params.orderNumber}`
    : `${APP_NAME} — Order received ${params.orderNumber}`;

  const html = ar
    ? `<p>شكراً لطلبك من ${APP_NAME}.</p>
<p><strong>رقم الطلب:</strong> ${params.orderNumber}</p>
<p>سنراجع طلبك ونرسل تعليمات الدفع قريباً.</p>
<p><a href="${params.trackUrl}">تتبع الطلب</a></p>`
    : `<p>Thanks for your order at ${APP_NAME}.</p>
<p><strong>Order number:</strong> ${params.orderNumber}</p>
<p>We will review your order and send payment instructions shortly.</p>
<p><a href="${params.trackUrl}">Track your order</a></p>`;

  return { subject, html: wrapEmail(html, params.appUrl) };
}

export function orderStatusEmail(params: {
  locale: string;
  orderNumber: string;
  statusLabel: string;
  trackUrl: string;
  appUrl: string;
}): { subject: string; html: string } {
  const ar = params.locale === "ar";
  const subject = ar
    ? `${APP_NAME} — تحديث الطلب ${params.orderNumber}`
    : `${APP_NAME} — Order update ${params.orderNumber}`;

  const html = ar
    ? `<p>تم تحديث حالة طلبك <strong>${params.orderNumber}</strong> إلى: <strong>${params.statusLabel}</strong>.</p>
<p><a href="${params.trackUrl}">عرض الطلب</a></p>`
    : `<p>Your order <strong>${params.orderNumber}</strong> is now: <strong>${params.statusLabel}</strong>.</p>
<p><a href="${params.trackUrl}">View order</a></p>`;

  return { subject, html: wrapEmail(html, params.appUrl) };
}

export function deliveryReadyEmail(params: {
  locale: string;
  orderNumber: string;
  productName: string;
  trackUrl: string;
  appUrl: string;
}): { subject: string; html: string } {
  const ar = params.locale === "ar";
  const subject = ar
    ? `${APP_NAME} — تسليم جاهز لـ ${params.orderNumber}`
    : `${APP_NAME} — Delivery ready for ${params.orderNumber}`;

  const html = ar
    ? `<p>تم تسليم <strong>${params.productName}</strong> لطلبك <strong>${params.orderNumber}</strong>.</p>
<p>افتح صفحة الطلب لعرض التفاصيل (احفظها في مكان آمن).</p>
<p><a href="${params.trackUrl}">عرض التسليم</a></p>`
    : `<p><strong>${params.productName}</strong> for order <strong>${params.orderNumber}</strong> has been delivered.</p>
<p>Open your order page to view delivery details (save them securely).</p>
<p><a href="${params.trackUrl}">View delivery</a></p>`;

  return { subject, html: wrapEmail(html, params.appUrl) };
}

export function ticketReplyEmail(params: {
  locale: string;
  ticketNumber: string;
  subject: string;
  preview: string;
  ticketUrl: string;
  appUrl: string;
}): { subject: string; html: string } {
  const ar = params.locale === "ar";
  const subjectLine = ar
    ? `${APP_NAME} — رد جديد على التذكرة ${params.ticketNumber}`
    : `${APP_NAME} — New reply on ticket ${params.ticketNumber}`;

  const html = ar
    ? `<p>رد جديد على تذكرة الدعم: <strong>${params.subject}</strong></p>
<p>${escapeHtml(params.preview)}</p>
<p><a href="${params.ticketUrl}">فتح التذكرة</a></p>`
    : `<p>New reply on support ticket: <strong>${params.subject}</strong></p>
<p>${escapeHtml(params.preview)}</p>
<p><a href="${params.ticketUrl}">Open ticket</a></p>`;

  return { subject: subjectLine, html: wrapEmail(html, params.appUrl) };
}

function wrapEmail(body: string, appUrl: string): string {
  return `<!DOCTYPE html><html><body style="font-family:sans-serif;line-height:1.5;color:#111">
${body}
<hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
<p style="font-size:12px;color:#666"><a href="${appUrl}">${APP_NAME}</a></p>
</body></html>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export const ORDER_STATUS_LABELS: Record<string, { en: string; ar: string }> = {
  pending_review: { en: "Pending review", ar: "قيد المراجعة" },
  awaiting_payment: { en: "Awaiting payment", ar: "بانتظار الدفع" },
  payment_received: { en: "Payment received", ar: "تم استلام الدفع" },
  processing: { en: "Processing", ar: "قيد المعالجة" },
  delivered: { en: "Delivered", ar: "تم التسليم" },
  completed: { en: "Completed", ar: "مكتمل" },
  cancelled: { en: "Cancelled", ar: "ملغى" },
  needs_customer_response: { en: "Needs your response", ar: "بحاجة لردك" },
  on_hold: { en: "On hold", ar: "معلّق" },
};
