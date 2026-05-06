"use client";

import { AppNav } from "@/app/components/AppNav";

const sections = [
  {
    title: "Our Commitment",
    body: "At Kiv, we believe your thoughts and feelings should stay between you and your journal. Privacy isn't just a feature — it's our foundation.",
  },
  {
    title: "Data Collection",
    body: "We only collect the information necessary to provide the service. This includes your account details (email) and the data you explicitly enter (mood logs, notes). We do not track your location or use intrusive analytics.",
  },
  {
    title: "No Data Selling",
    body: "We will never sell, rent, or trade your personal data or your journal entries to third parties. Period.",
  },
  {
    title: "Security",
    body: "We use industry-standard encryption to protect your data both in transit and at rest. Your privacy is protected by the same security protocols used by leading financial institutions.",
  },
  {
    title: "Your Rights",
    body: "You have the right to access, export, or delete your data at any time. Your journal is yours, and you can take it with you whenever you choose.",
  },
];

export default function PrivacyPage() {
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
          Privacy Policy
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
            href="/terms"
            style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}
          >
            Terms of Service →
          </a>
          <span>© {new Date().getFullYear()} Kiv</span>
        </div>
      </main>
    </div>
  );
}
