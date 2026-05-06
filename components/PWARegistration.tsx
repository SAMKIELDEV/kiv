"use client";

import { useEffect } from "react";

export function PWARegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            // console.log("SW registered:", reg);
            // Ensure any updates are applied immediately
            reg.onupdatefound = () => {
              const installingWorker = reg.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (installingWorker.state === "installed") {
                    if (navigator.serviceWorker.controller) {
                      // New content is available, but wait for user to refresh or do it automatically
                    }
                  }
                };
              }
            };
          })
          .catch((err) => {
            console.error("SW registration failed:", err);
          });
      });
    }
  }, []);

  return null;
}
