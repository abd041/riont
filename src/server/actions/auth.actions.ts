"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { mapSupabaseAuthError } from "@/lib/auth/map-auth-error";
import type { AuthActionResult } from "@/lib/domain/errors";
import { signInSchema, signUpSchema } from "@/validations/auth.schema";

export async function signInWithEmailAction(
  _prev: AuthActionResult | null,
  formData: FormData,
): Promise<AuthActionResult> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { success: false, code: "VALIDATION" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { success: false, code: mapSupabaseAuthError(error) };
  }

  revalidatePath("/", "layout");
  return { success: true, intent: "signedIn" };
}

export async function signUpWithEmailAction(
  _prev: AuthActionResult | null,
  formData: FormData,
): Promise<AuthActionResult> {
  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    displayName: formData.get("displayName") || undefined,
  });

  if (!parsed.success) {
    const passwordIssue = parsed.error.issues.some(
      (issue) => issue.path[0] === "password",
    );
    return {
      success: false,
      code: passwordIssue ? "WEAK_PASSWORD" : "VALIDATION",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: parsed.data.displayName
        ? { display_name: parsed.data.displayName }
        : undefined,
    },
  });

  if (error) {
    return { success: false, code: mapSupabaseAuthError(error) };
  }

  if (data.user && parsed.data.displayName) {
    await supabase
      .from("profiles")
      .update({ display_name: parsed.data.displayName })
      .eq("id", data.user.id);
  }

  revalidatePath("/", "layout");

  if (data.session) {
    return { success: true, intent: "signedIn" };
  }

  return { success: true, intent: "registered" };
}

export async function signOutAction(): Promise<{ success: boolean }> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { success: false };
  }

  revalidatePath("/", "layout");
  return { success: true };
}
