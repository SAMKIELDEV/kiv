// app/layout.tsx (updated metadata)
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Syne } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || "https://id.samkiel.tech";

export const metadata: Metadata = {
  title: "Kiv — Check in with yourself",
  description:
    "A simple, private space to log how you're doing each day. Mood tracking and micro-journaling in under 2 minutes.",
  metadataBase: new URL("https://kiv.samkiel.tech"),
  keywords: ["journaling", "mood tracker", "daily check-in", "mental health", "self-awareness"],
  authors: [{ name: "SAMKIEL Studio", url: "https://samkiel.tech" }],
  openGraph: {
    title: "Kiv — Check in with yourself",
    description: "Your private space for daily reflection and mood tracking",
    images: ["/favicon.ico"],
  },
  icons: {
    apple: "/favicon.ico",
  },
};

export const viewport = {
  themeColor: "#0F0F0F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { PWAInstall } from "@/components/PWAInstall";
import { AlertProvider } from "@/lib/context/AlertContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${syne.variable} h-full`} suppressHydrationWarning>
      <body
        className="min-h-full bg-bg text-text-primary font-body antialiased"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthProvider baseUrl={AUTH_URL}>
            <AlertProvider>
              <PWAInstall />
              {children}
              <Toaster
                position="bottom-right"
                theme="dark"
                expand={false}
                closeButton={false}
                toastOptions={{
                  classNames: {
                    toast: "group toast group-[.toaster]:bg-[var(--surface)] group-[.toaster]:text-[var(--text-primary)] group-[.toaster]:border-[var(--border)] group-[.toaster]:shadow-2xl group-[.toaster]:rounded-xl group-[.toaster]:font-jakarta",
                    description: "group-[.toast]:text-[var(--text-secondary)]",
                    actionButton: "group-[.toast]:bg-[var(--accent)] group-[.toast]:text-[var(--accent-foreground)]",
                    closeButton: "hidden",
                  },
                }}
              />
              <Analytics />
              <SpeedInsights />
            </AlertProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}