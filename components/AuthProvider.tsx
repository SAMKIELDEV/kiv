"use client";

import { useEffect } from "react";
import { AuthProvider as BaseAuthProvider, useAuthContext } from "@samkiel/authsdk/react";

const ACCOUNTS_URL =
  process.env.NEXT_PUBLIC_SAMKIEL_ACCOUNTS_URL || "https://account.samkiel.tech";

function AuthLogoutRedirect() {
  const { auth } = useAuthContext();
  useEffect(() => {
    const unsubscribe = auth.onAuthLogout(() => {
      if (typeof window === "undefined") return;
      // Skip the redirect on public pages — there's nothing to protect.
      const path = window.location.pathname;
      if (!path.startsWith("/app")) return;
      const redirect = encodeURIComponent(`${window.location.origin}${path}`);
      window.location.replace(`${ACCOUNTS_URL}/login?redirect=${redirect}&error=session_expired`);
    });
    return unsubscribe;
  }, [auth]);
  return null;
}

export function AuthProvider({
  children,
  baseUrl,
}: {
  children: React.ReactNode;
  baseUrl: string;
}) {
  return (
    // productSlug records a "Kiv" product session on the user's SAMKIEL ID so it
    // shows on the account products page with real activity.
    <BaseAuthProvider baseUrl={baseUrl} productSlug="kiv">
      <AuthLogoutRedirect />
      {children}
    </BaseAuthProvider>
  );
}
