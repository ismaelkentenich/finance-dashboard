"use client";

import { telemetryService } from "@/services/telemetry";
import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    const registerServiceWorker = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        telemetryService.log("info", "Service Worker registered", {
          feature: "pwa",
        });
      } catch (error) {
        telemetryService.logError(
          error instanceof Error ? error : new Error("Service Worker registration failed"),
          {
            feature: "pwa",
          }
        );
      }
    };

    void registerServiceWorker();
  }, []);

  return null;
}
