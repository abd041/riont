import { Resend } from "resend";

export type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export type SendEmailResult =
  | { sent: true; id?: string }
  | { sent: false; skipped: true }
  | { sent: false; error: string };

export async function sendEmail(
  params: SendEmailParams,
): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.info("[email skipped — no RESEND_API_KEY]", params.subject, params.to);
    }
    return { sent: false, skipped: true };
  }

  const from = process.env.EMAIL_FROM?.trim() || "onboarding@resend.dev";
  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from,
    to: params.to,
    subject: params.subject,
    html: params.html,
    text: params.text ?? stripHtml(params.html),
  });

  if (error) {
    console.error("[email error]", error.message);
    return { sent: false, error: error.message };
  }

  return { sent: true, id: data?.id };
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
