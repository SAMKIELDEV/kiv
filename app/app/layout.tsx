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
    <div className="min-h-screen bg-bg text-text-primary font-sans">
      <AppNav />

      <main className="max-w-[680px] mx-auto pt-[60px]">
        <div className="px-5 py-8 sm:px-12 sm:py-10">
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
