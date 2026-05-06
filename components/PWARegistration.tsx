"use client";

import { useEffect } from "react";

export function PWARegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            // Service worker registered
          })
          .catch((error) => {
            // Service worker registration failed
          });
      });
    }
  }, []);

  return null;
}
