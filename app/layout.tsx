import type { Metadata } from "next";
import { Inconsolata } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

import { AuthProvider } from "@/components/AuthProvider";

const inconsolata = Inconsolata({
  subsets: ["latin"],
  variable: "--font-inconsolata",
  display: "swap",
  weight: "variable",
});

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || "https://id.samkiel.tech";

export const metadata: Metadata = {
  title: "Kiv — Check in with yourself",
  description:
    "A simple, private space to log how you're doing each day. Mood tracking and micro-journaling in under 2 minutes.",
  metadataBase: new URL("https://kiv.samkiel.tech"),
  keywords: ["journaling", "mood tracker", "daily check-in", "mental health", "self-awareness"],
  authors: [{ name: "SAMKIEL Studio", url: "https://samkiel.tech" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inconsolata.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased bg-bg text-text-primary font-body">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthProvider baseUrl={AUTH_URL}>
            {children}
            <Toaster
              position="bottom-center"
              toastOptions={{
                style: {
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-inconsolata), monospace",
                },
              }}
            />
            <Analytics />
            <SpeedInsights />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


