"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useLocale } from "@/contexts/LocaleContext";
import { telemetryService } from "@/services/telemetry";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./error.module.css";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  const { t } = useLocale();
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    // Sends unhandled runtime exceptions to telemetry logging
    telemetryService.logError(error, {
      boundary: "DashboardErrorBoundary",
      digest: error.digest,
    });
  }, [error]);

  const handleReset = () => {
    setIsRetrying(true);
    reset();
    setTimeout(() => {
      setIsRetrying(false);
    }, 800);
  };

  return (
    <div className={styles.container} data-testid="dashboard-route-error">
      <Card className={styles.card}>
        <div className={styles.iconWrapper} aria-hidden="true">
          <AlertTriangle size={32} />
        </div>

        <div className={styles.textGroup}>
          <h2 className={styles.title}>{t.errors.dashboardTitle}</h2>
          <p className={styles.description}>{t.errors.dashboardDescription}</p>
        </div>

        <Button variant="primary" size="md" onClick={handleReset} data-testid="error-reset-button">
          <RefreshCw
            size={16}
            aria-hidden="true"
            className={isRetrying ? styles.spinIcon : undefined}
            data-testid="error-reset-icon"
          />
          {t.errors.reloadPage}
        </Button>
      </Card>
    </div>
  );
}
