import { isRtlLocale } from "@/constants/locales";

export type SupportErrorCode =
  | "SIGN_IN_REQUIRED"
  | "VALIDATION"
  | "NOT_FOUND"
  | "CREATE_FAILED"
  | "SEND_FAILED";

export const SUPPORT_SENDER_LABELS = {
  system: { en: "System", ar: "النظام" },
  support: { en: "Support", ar: "الدعم" },
  you: { en: "You", ar: "أنت" },
} as const;

export function resolveSupportSenderLabel(
  locale: string,
  kind: keyof typeof SUPPORT_SENDER_LABELS,
): string {
  const entry = SUPPORT_SENDER_LABELS[kind];
  return isRtlLocale(locale) ? entry.ar : entry.en;
}
