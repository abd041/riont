"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { signOutAction } from "@/server/actions/auth.actions";
import { UserRole } from "@/lib/domain/enums";
import type { StorefrontUser } from "@/types/auth";
import type { UserNotification } from "@/server/services/notification-list.service";

type StorefrontAuthContextValue = {
  user: StorefrontUser | null;
  notifications: UserNotification[];
  signingOut: boolean;
  signOut: () => Promise<void>;
};

const StorefrontAuthContext = createContext<StorefrontAuthContextValue | null>(
  null,
);

export function StorefrontAuthProvider({
  children,
  initialUser,
  initialNotifications,
}: {
  children: ReactNode;
  initialUser: StorefrontUser | null;
  initialNotifications: UserNotification[];
}) {
  const router = useRouter();
  const tAuth = useTranslations("auth.toast");
  const [user, setUser] = useState<StorefrontUser | null>(initialUser);
  const [notifications, setNotifications] = useState<UserNotification[]>(
    initialUser ? initialNotifications : [],
  );
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    setUser(initialUser);
    setNotifications(initialUser ? initialNotifications : []);
  }, [initialUser, initialNotifications]);

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT" || !session?.user) {
        setUser(null);
        setNotifications([]);
        return;
      }

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        router.refresh();
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, role")
        .eq("id", session.user.id)
        .maybeSingle();

      setUser({
        id: session.user.id,
        email: session.user.email ?? "",
        displayName: profile?.display_name ?? null,
        role: (profile?.role as UserRole | undefined) ?? UserRole.CUSTOMER,
      });
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const signOut = useCallback(async () => {
    setSigningOut(true);
    try {
      const supabase = createClient();
      const [{ success }, { error: clientError }] = await Promise.all([
        signOutAction(),
        supabase.auth.signOut(),
      ]);

      if (!success || clientError) {
        toast.error(tAuth("authFailed"));
        return;
      }

      setUser(null);
      setNotifications([]);
      toast.success(tAuth("signedOut"));
      router.push("/");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }, [router, tAuth]);

  const value = useMemo(
    () => ({ user, notifications, signingOut, signOut }),
    [user, notifications, signingOut, signOut],
  );

  return (
    <StorefrontAuthContext.Provider value={value}>
      {children}
    </StorefrontAuthContext.Provider>
  );
}

export function useStorefrontAuth() {
  const ctx = useContext(StorefrontAuthContext);
  if (!ctx) {
    throw new Error("useStorefrontAuth must be used within StorefrontAuthProvider");
  }
  return ctx;
}
