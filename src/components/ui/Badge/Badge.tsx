import styles from "./Badge.module.css";
import { BadgeProps, BadgeVariant } from "./Badge.types";

export function Badge({
  children,
  variant = "neutral",
  className = "",
  "data-testid": testId = "badge",
}: BadgeProps) {
  const variantClassMap: Record<BadgeVariant, string> = {
    success: styles.badgeSuccess,
    danger: styles.badgeDanger,
    neutral: styles.badgeNeutral,
    info: styles.badgeInfo,
  };

  return (
    <span
      data-testid={testId}
      className={`${styles.badge} ${variantClassMap[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
