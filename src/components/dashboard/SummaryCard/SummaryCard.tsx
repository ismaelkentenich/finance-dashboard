import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import styles from "./SummaryCard.module.css";
import type { SummaryCardIconVariant, SummaryCardProps } from "./SummaryCard.types";

const ICON_VARIANT_MAP: Record<SummaryCardIconVariant, string> = {
  balance: styles.iconBalance,
  income: styles.iconIncome,
  expense: styles.iconExpense,
  savings: styles.iconSavings,
};

export function SummaryCard({
  title,
  value,
  icon: IconComponent,
  iconVariant,
  badge,
  footerText,
  className = "",
  "data-testid": testId = "summary-card",
}: SummaryCardProps) {
  return (
    <Card data-testid={testId} className={`${styles.cardContainer} ${className}`.trim()}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <div
          data-testid="summary-card-icon-wrapper"
          className={`${styles.iconWrapper} ${ICON_VARIANT_MAP[iconVariant]}`}
        >
          <IconComponent size={16} aria-hidden="true" />
        </div>
      </CardHeader>

      <div data-testid="summary-card-value" className={styles.value}>
        {value}
      </div>

      <div className={styles.footerInfo}>
        {badge && (
          <Badge
            variant={badge.variant}
            aria-label={badge.ariaLabel}
            data-testid="summary-card-badge"
          >
            {badge.text}
          </Badge>
        )}
        <span data-testid="summary-card-footer-text">{footerText}</span>
      </div>
    </Card>
  );
}
