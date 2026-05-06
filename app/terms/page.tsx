"use client";

import { AppNav } from "@/app/components/AppNav";

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: "By accessing or using Kiv, you agree to be bound by these Terms of Service. If you do not agree, please do not use the application.",
  },
  {
    title: "2. Your Data",
    body: "Kiv is designed with a privacy-first philosophy. Your entries, moods, and reflections belong solely to you. We do not claim ownership over any content you log in the application.",
  },
  {
    title: "3. Use of Service",
    body: "Kiv is intended for personal, non-commercial use. You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.",
  },
  {
    title: "4. Limitations",
    body: "Kiv is a tool for self-reflection and mood tracking. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.",
  },
  {
    title: "5. Modifications",
    body: "We reserve the right to modify or terminate the service for any reason, without notice at any time. We also reserve the right to update these terms periodically.",
  },
];

export default function TermsPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg)",
        color: "var(--text-primary)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <AppNav variant="auth" />

      <main
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          padding: "100px 24px 80px",
        }}
      >
        <h1
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800,
            fontSize: "34px",
            color: "var(--text-primary)",
            letterSpacing: "-0.5px",
            marginBottom: "8px",
          }}
        >
          Terms of Service
        </h1>
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "13px",
            color: "var(--text-secondary)",
            marginBottom: "48px",
          }}
        >
          Last updated: May 2026
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {sections.map((s) => (
            <section key={s.title}>
              <h2
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: "16px",
                  color: "var(--text-primary)",
                  marginBottom: "10px",
                }}
              >
                {s.title}
              </h2>
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "15px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                }}
              >
                {s.body}
              </p>
            </section>
          ))}
        </div>

        <div
          style={{
            marginTop: "64px",
            paddingTop: "24px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "12px",
            color: "var(--text-secondary)",
          }}
        >
          <a
            href="/privacy"
            style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}
          >
            Privacy Policy →
          </a>
          <span>© {new Date().getFullYear()} Kiv</span>
        </div>
      </main>
    </div>
  );
}
