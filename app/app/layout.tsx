import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AppNav } from "@/app/components/AppNav";
import { getServerUser } from "@/lib/auth";

const ACCOUNTS_URL =
  process.env.NEXT_PUBLIC_SAMKIEL_ACCOUNTS_URL || "https://account.samkiel.tech";
const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await getServerUser();

  if (!user) {
    const redirectUrl = `${ACCOUNTS_URL}/login?redirect=${encodeURIComponent(`${APP_URL}/app`)}`;
    redirect(redirectUrl);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg)",
        color: "var(--text-primary)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <AppNav />

      <main
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          paddingTop: "60px",
        }}
      >
        <div
          style={{
            padding: "40px 48px", // Defaulting to original desktop padding; we can re-add mobile logic if needed
          }}
        >
          <script
            id="user-data"
            type="application/json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(user) }}
          />
          {children}
        </div>
      </main>
    </div>
  );
}
