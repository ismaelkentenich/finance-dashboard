"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useLocale } from "@/contexts/LocaleContext";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useEffect } from "react";
import styles from "./error.module.css";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  const { t } = useLocale();

  // TODO - Melhorar o tratamento de erros.
  useEffect(() => {
    console.error("Unhandled Dashboard Error:", error);
  }, [error]);

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

        <Button
          variant="primary"
          size="md"
          onClick={() => reset()}
          data-testid="error-reset-button"
        >
          <RefreshCw size={16} aria-hidden="true" />
          {t.errors.reloadPage}
        </Button>
      </Card>
    </div>
  );
}
