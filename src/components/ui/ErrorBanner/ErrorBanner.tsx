import { Button } from "@/components/ui/Button";
import { AlertCircle, RefreshCw } from "lucide-react";
import styles from "./ErrorBanner.module.css";
import type { ErrorBannerProps } from "./ErrorBanner.types";

export function ErrorBanner({
  title,
  message,
  onRetry,
  retryLabel = "Tentar novamente",
  children,
  className = "",
  "data-testid": testId = "error-banner",
}: ErrorBannerProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      data-testid={testId}
      className={`${styles.container} ${className}`.trim()}
    >
      <div className={styles.iconWrapper} aria-hidden="true">
        <AlertCircle size={20} />
      </div>

      <div className={styles.content}>
        {title && (
          <h4 className={styles.title} data-testid={`${testId}-title`}>
            {title}
          </h4>
        )}
        <p className={styles.message} data-testid={`${testId}-message`}>
          {message}
        </p>

        {(onRetry || children) && (
          <div className={styles.actions}>
            {onRetry && (
              <Button
                size="sm"
                variant="danger"
                onClick={onRetry}
                data-testid={`${testId}-retry-button`}
              >
                <RefreshCw size={14} aria-hidden="true" />
                {retryLabel}
              </Button>
            )}
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
