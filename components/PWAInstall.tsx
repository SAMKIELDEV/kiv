"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

export function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode
    if (window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone) {
      setIsStandalone(true);
      return;
    }

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      
      // Only show if not installed and we haven't dismissed it this session
      const dismissed = sessionStorage.getItem("pwa-install-dismissed");
      if (!dismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Listen for successful installation
    window.addEventListener("appinstalled", () => {
      setDeferredPrompt(null);
      setIsVisible(false);
      setIsStandalone(true);
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      alert("To install Kiv on your iPhone: tap the 'Share' button in Safari and then 'Add to Home Screen' 🌿");
      return;
    }

    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  const dismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("pwa-install-dismissed", "true");
  };

  // Expose the install function globally for the settings page
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).triggerPWAInstall = handleInstall;
      (window as any).canInstallPWA = (!!deferredPrompt || isIOS) && !isStandalone;
    }
  }, [deferredPrompt, isStandalone, isIOS]);

  if (!isVisible || (!deferredPrompt && !isIOS) || isStandalone) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        left: "24px",
        right: "24px",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "16px 20px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
        maxWidth: "400px",
        margin: "0 auto",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            backgroundColor: "rgba(196, 149, 106, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent)",
          }}
        >
          <Download size={20} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "14px",
              fontWeight: 700,
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            Install Kiv
          </p>
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "12px",
              color: "var(--text-secondary)",
              margin: 0,
            }}
          >
            Add to your home screen for quick access.
          </p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          onClick={handleInstall}
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "13px",
            fontWeight: 700,
            backgroundColor: "var(--text-primary)",
            color: "var(--bg)",
            border: "none",
            borderRadius: "8px",
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          {isIOS ? "How to" : "Install"}
        </button>
        <button
          onClick={dismiss}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "var(--text-secondary)",
            cursor: "pointer",
            padding: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
