"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  signInWithEmailAction,
  signUpWithEmailAction,
} from "@/server/actions/auth.actions";
import type { AuthErrorCode } from "@/lib/auth/map-auth-error";
import { mapSupabaseAuthError } from "@/lib/auth/map-auth-error";
import { isAppleAuthEnabled } from "@/lib/env/public";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { AuthToastListener, type AuthNotice } from "./auth-toast-listener";

export function LoginForm({
  locale,
  authNotice,
}: {
  locale: string;
  authNotice: AuthNotice;
}) {
  const t = useTranslations("auth");
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [oauthLoading, setOauthLoading] = useState<"google" | "apple" | null>(
    null,
  );

  const [signInState, signInAction, signInPending] = useActionState(
    signInWithEmailAction,
    null,
  );
  const [signUpState, signUpAction, signUpPending] = useActionState(
    signUpWithEmailAction,
    null,
  );

  const state = mode === "signIn" ? signInState : signUpState;
  const errorCode: AuthErrorCode | null =
    state?.success === false ? state.code : null;
  const errorMessage = errorCode ? t(`errors.${errorCode}`) : null;
  const pending = mode === "signIn" ? signInPending : signUpPending;

  async function signInWithOAuth(provider: "google" | "apple") {
    setOauthLoading(provider);
    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=/${locale}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo },
      });

      if (error) {
        const code = mapSupabaseAuthError(error);
        toast.error(t(`errors.${code}`));
        setOauthLoading(null);
      }
    } catch {
      toast.error(t("errors.OAUTH_FAILED"));
      setOauthLoading(null);
    }
  }

  const submitLabel =
    mode === "signIn"
      ? pending
        ? t("signingIn")
        : t("signIn")
      : pending
        ? t("signingUp")
        : t("signUp");

  return (
    <>
      <AuthToastListener notice={authNotice} />
      <div className="sf-auth-card">
        <h1 className="sf-auth-card__title">
          {mode === "signIn" ? t("welcomeBack") : t("createAccountTitle")}
        </h1>
        <p className="sf-auth-card__subtitle">{t("subtitle")}</p>

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            className="sf-auth-oauth-btn"
            disabled={oauthLoading !== null || pending}
            onClick={() => signInWithOAuth("google")}
          >
            {oauthLoading === "google" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : null}
            {t("continueGoogle")}
          </button>
          {isAppleAuthEnabled() && (
            <button
              type="button"
              className="sf-auth-oauth-btn"
              disabled={oauthLoading !== null || pending}
              onClick={() => signInWithOAuth("apple")}
            >
              {oauthLoading === "apple" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              {t("continueApple")}
            </button>
          )}
        </div>

        <div className="sf-auth-divider">
          <div className="sf-auth-divider__line" />
          <span className="sf-auth-divider__label">{t("orEmail")}</span>
          <div className="sf-auth-divider__line" />
        </div>

        {errorMessage && (
          <p
            role="alert"
            className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400"
          >
            {errorMessage}
          </p>
        )}

        <form
          action={mode === "signIn" ? signInAction : signUpAction}
          className="space-y-4"
        >
          <input type="hidden" name="locale" value={locale} />
          {mode === "signUp" && (
            <div>
              <label
                htmlFor="displayName"
                className="mb-1 block text-sm text-[var(--text-muted)]"
              >
                {t("displayName")}
              </label>
              <Input
                id="displayName"
                name="displayName"
                type="text"
                maxLength={80}
                disabled={pending}
              />
            </div>
          )}
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm text-[var(--text-muted)]"
            >
              {t("email")}
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              disabled={pending}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm text-[var(--text-muted)]"
            >
              {t("password")}
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete={
                mode === "signIn" ? "current-password" : "new-password"
              }
              disabled={pending}
            />
          </div>
          <button
            type="submit"
            className="sf-btn-primary w-full"
            disabled={pending || oauthLoading !== null}
          >
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitLabel}
          </button>
        </form>

        <button
          type="button"
          className="sf-auth-switch"
          onClick={() => setMode(mode === "signIn" ? "signUp" : "signIn")}
          disabled={pending}
        >
          {mode === "signIn" ? t("noAccount") : t("hasAccount")}
        </button>
      </div>
    </>
  );
}
