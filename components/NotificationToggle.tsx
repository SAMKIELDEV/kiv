"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Bell, BellOff, Loader2 } from "lucide-react";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

export function NotificationToggle() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      checkSubscription();
    } else {
      setLoading(false);
    }
  }, []);

  async function checkSubscription() {
    try {
      // Add a timeout to avoid hanging if SW is broken
      const swReady = navigator.serviceWorker.ready;
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout waiting for Service Worker")), 5000)
      );

      const registration = await Promise.race([swReady, timeout]) as ServiceWorkerRegistration;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error("Subscription check failed:", error);
    } finally {
      setLoading(false);
    }
  }

  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  async function subscribe() {
    if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
      toast.error("Push notifications are not configured: Missing Public Key.");
      return;
    }

    if (Notification.permission === "denied") {
      toast.error("Notifications are blocked. Please enable them in your browser settings.");
      return;
    }

    setToggling(true);
    try {
      const swReady = navigator.serviceWorker.ready;
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Service Worker timeout")), 5000)
      );

      const registration = await Promise.race([swReady, timeout]) as ServiceWorkerRegistration;
      
      // Request permission explicitly first for better UX
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        throw new Error("Permission not granted");
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
      });

      const res = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription }),
      });

      if (res.ok) {
        setIsSubscribed(true);
        toast.success("Daily reminders enabled!");
      } else {
        throw new Error("Failed to save subscription");
      }
    } catch (error) {
      console.error("Subscription failed:", error);
      toast.error("Could not enable notifications. Please ensure you've allowed permissions.");
    } finally {
      setToggling(false);
    }
  }

  async function unsubscribe() {
    setToggling(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        await fetch("/api/notifications/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
      }
      
      setIsSubscribed(false);
      toast.success("Reminders disabled.");
    } catch (error) {
      toast.error("Could not disable notifications.");
    } finally {
      setToggling(false);
    }
  }

  if (!isSupported) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "16px 20px",
        marginTop: "24px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--text-primary)",
          }}
        >
          Daily Reminders
        </p>
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "12px",
            color: "var(--text-secondary)",
          }}
        >
          Get a nudge to check in every evening.
        </p>
      </div>

      <button
        onClick={isSubscribed ? unsubscribe : subscribe}
        disabled={loading || toggling}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "40px",
          height: "40px",
          borderRadius: "10px",
          border: "1px solid var(--border)",
          backgroundColor: isSubscribed ? "rgba(196, 149, 106, 0.1)" : "transparent",
          cursor: "pointer",
          transition: "all 0.15s ease",
          color: isSubscribed ? "var(--accent)" : "var(--text-secondary)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--text-primary)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
        }}
      >
        {loading || toggling ? (
          <Loader2 size={18} className="animate-spin" />
        ) : isSubscribed ? (
          <Bell size={18} />
        ) : (
          <BellOff size={18} />
        )}
      </button>
    </div>
  );
}
