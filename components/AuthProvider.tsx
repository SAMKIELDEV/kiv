"use client";

import { AuthProvider as BaseAuthProvider } from "@samkiel/authsdk/react";

export function AuthProvider({
  children,
  baseUrl,
}: {
  children: React.ReactNode;
  baseUrl: string;
}) {
  return <BaseAuthProvider baseUrl={baseUrl}>{children}</BaseAuthProvider>;
}
