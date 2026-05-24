import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env/public";

const DEFAULT_PAYMENT_EN =
  "After submitting your order, our team will review it and send payment instructions by email. Typical methods: bank transfer, mobile wallet, or crypto — details will be provided once your order is approved.";
const DEFAULT_PAYMENT_AR =
  "بعد إرسال طلبك، سيقوم فريقنا بمراجعته وإرسال تعليمات الدفع عبر البريد. الطرق المعتادة: تحويل بنكي، محفظة، أو عملات رقمية — سيتم تزويدك بالتفاصيل بعد الموافقة.";

export async function getPaymentInstructions(locale: string): Promise<string> {
  if (!isSupabaseConfigured()) {
    return locale === "ar" ? DEFAULT_PAYMENT_AR : DEFAULT_PAYMENT_EN;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("payment_instructions_en, payment_instructions_ar")
      .eq("id", "default")
      .maybeSingle();

    if (error) throw error;

    const text =
      locale === "ar"
        ? data?.payment_instructions_ar
        : data?.payment_instructions_en;

    return (
      text?.trim() ||
      (locale === "ar" ? DEFAULT_PAYMENT_AR : DEFAULT_PAYMENT_EN)
    );
  } catch {
    return locale === "ar" ? DEFAULT_PAYMENT_AR : DEFAULT_PAYMENT_EN;
  }
}
