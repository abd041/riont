"use client";

import { useActionState, useCallback, useEffect, useRef, useState } from "react";
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
import { useRouter } from "@/i18n/navigation";
import { useRouter as useAppRouter } from "next/navigation";
import { cn } from "@/utils/cn";
import { AuthToastListener, type AuthNotice } from "./auth-toast-listener";

const OAUTH_LOADING_TIMEOUT_MS = 15_000;

export function LoginForm({
  locale,
  authNotice,
  initialMode = "signIn",
  redirectTo,
}: {
  locale: string;
  authNotice: AuthNotice;
  initialMode?: "signIn" | "signUp";
  /** Locale-safe post-login path (from server). */
  redirectTo: string;
}) {
  const t = useTranslations("auth");
  const tToast = useTranslations("auth.toast");
  const router = useRouter();
  const appRouter = useAppRouter();
  const [mode, setMode] = useState<"signIn" | "signUp">(initialMode);

  const navigateAfterAuth = useCallback(
    (path: string) => {
      if (path.startsWith("/admin")) {
        appRouter.replace(path);
      } else {
        router.replace(path);
      }
      router.refresh();
    },
    [appRouter, router],
  );

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);
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

  const handledSuccess = useRef<string | null>(null);

  const state = mode === "signIn" ? signInState : signUpState;
  const errorCode: AuthErrorCode | null =
    state?.success === false ? state.code : null;
  const errorMessage = errorCode ? t(`errors.${errorCode}`) : null;
  const pending = mode === "signIn" ? signInPending : signUpPending;

  useEffect(() => {
    if (!signInState?.success) return;
    const key = `signIn-${signInState.intent}`;
    if (handledSuccess.current === key) return;
    handledSuccess.current = key;
    navigateAfterAuth(redirectTo);
  }, [signInState, redirectTo, navigateAfterAuth]);

  useEffect(() => {
    if (!signUpState?.success) return;
    const key = `signUp-${signUpState.intent}`;
    if (handledSuccess.current === key) return;
    handledSuccess.current = key;
    if (signUpState.intent === "registered") {
      toast.success(tToast("registered"));
      router.replace("/login?registered=1");
    } else {
      navigateAfterAuth(redirectTo);
    }
  }, [signUpState, redirectTo, navigateAfterAuth, router, tToast]);

  useEffect(() => {
    if (!oauthLoading) return;
    const id = window.setTimeout(() => setOauthLoading(null), OAUTH_LOADING_TIMEOUT_MS);
    return () => window.clearTimeout(id);
  }, [oauthLoading]);

  async function signInWithOAuth(provider: "google" | "apple") {
    setOauthLoading(provider);
    try {
      const supabase = createClient();
      const next = encodeURIComponent(redirectTo);
      const redirectToUrl = `${window.location.origin}/auth/callback?next=${next}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: redirectToUrl },
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

        <div className="sf-auth-tabs" role="tablist" aria-label={t("subtitle")}>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "signIn"}
            className={cn(
              "sf-auth-tab",
              mode === "signIn" && "sf-auth-tab--active",
            )}
            disabled={pending || oauthLoading !== null}
            onClick={() => setMode("signIn")}
          >
            {t("tabSignIn")}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "signUp"}
            className={cn(
              "sf-auth-tab",
              mode === "signUp" && "sf-auth-tab--active",
            )}
            disabled={pending || oauthLoading !== null}
            onClick={() => setMode("signUp")}
          >
            {t("tabSignUp")}
          </button>
        </div>

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

        <p className="sf-auth-footer-hint">
          {mode === "signIn" ? t("noAccount") : t("hasAccount")}
        </p>
      </div>
    </>
  );
}
