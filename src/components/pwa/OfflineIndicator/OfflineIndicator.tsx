"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { WifiOff } from "lucide-react";
import styles from "./OfflineIndicator.module.css";

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  const { t } = useLocale();

  if (isOnline) {
    return null;
  }

  return (
    <div
      className={styles.container}
      role="status"
      aria-live="polite"
      data-testid="offline-indicator"
    >
      <WifiOff
        size={16}
        className={styles.icon}
        aria-hidden="true"
        data-testid="offline-indicator-icon"
      />

      <span>{t.pwa.offlineMessage}</span>
    </div>
  );
}
