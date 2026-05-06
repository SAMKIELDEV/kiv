"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        backgroundColor: "var(--bg)",
        color: "var(--text-primary)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
        textAlign: "center",
      }}
    >
      <span
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 700,
          fontSize: "12px",
          color: "var(--accent)",
          textTransform: "uppercase",
          letterSpacing: "2.5px",
          marginBottom: "16px",
        }}
      >
        Error 404
      </span>

      <h1
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 800,
          fontSize: "72px",
          color: "var(--text-primary)",
          letterSpacing: "-2px",
          lineHeight: 1,
          marginBottom: "24px",
        }}
      >
        Lost?
      </h1>

      <p
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 500,
          fontSize: "18px",
          color: "var(--text-primary)",
          marginBottom: "12px",
          maxWidth: "420px",
        }}
      >
        Some thoughts are meant to stay private.
      </p>
      <p
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "14px",
          color: "var(--text-secondary)",
          lineHeight: 1.65,
          marginBottom: "40px",
          maxWidth: "420px",
        }}
      >
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Take a breath, and let&apos;s get you back to your journal.
      </p>

      <Link
        href="/"
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "var(--accent)",
          color: "var(--accent-foreground)",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 700,
          fontSize: "15px",
          padding: "13px 28px",
          borderRadius: "999px",
          textDecoration: "none",
          transition: "opacity 0.15s ease",
        }}
      >
        <ArrowLeft size={16} />
        Back to Home
      </Link>
    </main>
  );
}
