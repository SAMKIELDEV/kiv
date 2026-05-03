import type { Metadata } from "next";
import { Syne } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kiv — Check in with yourself",
  description:
    "A simple, private space to log how you're doing each day. Mood tracking and micro-journaling in under 2 minutes.",
  keywords: ["journaling", "mood tracker", "daily check-in", "mental health", "self-awareness"],
  authors: [{ name: "SAMKIEL Studio", url: "https://samkiel.tech" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} h-full`}>
      <body className="min-h-full flex flex-col font-body antialiased">
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#111111",
              border: "1px solid #222222",
              color: "#FFFFFF",
              fontFamily: "var(--font-syne)",
            },
          }}
        />
      </body>
    </html>
  );
}
