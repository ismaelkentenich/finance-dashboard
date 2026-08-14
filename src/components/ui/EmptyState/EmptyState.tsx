import { Inbox } from "lucide-react";
import styles from "./EmptyState.module.css";
import type { EmptyStateProps } from "./EmptyState.types";

export function EmptyState({
  title,
  description,
  icon,
  action,
  className = "",
  "data-testid": testId = "empty-state",
}: EmptyStateProps) {
  return (
    <div role="status" data-testid={testId} className={`${styles.container} ${className}`.trim()}>
      <div className={styles.iconWrapper} aria-hidden="true">
        {icon || <Inbox size={24} />}
      </div>

      <h3 className={styles.title} data-testid={`${testId}-title`}>
        {title}
      </h3>

      <p className={styles.description} data-testid={`${testId}-description`}>
        {description}
      </p>

      {action && (
        <div className={styles.actionWrapper} data-testid={`${testId}-action`}>
          {action}
        </div>
      )}
    </div>
  );
}
