"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { signOutAction } from "@/server/actions/auth.actions";

export function AdminSignOutButton() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      const supabase = createClient();
      const [{ success }, { error }] = await Promise.all([
        signOutAction(),
        supabase.auth.signOut(),
      ]);

      if (!success || error) return;

      router.push("/en/login");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <button
      type="button"
      className="admin-header__signout"
      onClick={() => void handleSignOut()}
      disabled={signingOut}
    >
      <LogOut strokeWidth={1.75} aria-hidden />
      {signingOut ? "Signing out…" : "Sign out"}
    </button>
  );
}
