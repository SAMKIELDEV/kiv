"use client";

import { useEffect } from "react";

export function PWARegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            // console.log("SW registered:", registration);
          })
          .catch((error) => {
            // console.error("SW registration failed:", error);
          });
      });
    }
    
    // In development, you might want to skip registration or keep it quiet
    if ("serviceWorker" in navigator && process.env.NODE_ENV !== "production") {
      // Manual registration for testing if needed
      // navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  return null;
}
