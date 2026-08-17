"use client";

import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";
import { motion, type HTMLMotionProps } from "framer-motion";
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
  numericValue,
  formatter,
  icon,
  iconVariant,
  badge,
  footerText,
  className = "",
  "data-testid": testId = "summary-card",
  ...motionProps
}: SummaryCardProps & HTMLMotionProps<"div">) {
  const isAnimated = typeof numericValue === "number" && typeof formatter === "function";

  const animated = useAnimatedNumber(numericValue ?? 0, {
    formatter: isAnimated ? formatter : (val: number) => String(val),
  });

  const finalFormattedValue = isAnimated ? formatter(numericValue) : value;

  const displayFormattedValue = isAnimated ? animated.displayValue : value;

  return (
    <motion.div {...motionProps}>
      <Card data-testid={testId} className={`${styles.cardContainer} ${className}`.trim()}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <div
            data-testid="summary-card-icon-wrapper"
            className={`${styles.iconWrapper} ${ICON_VARIANT_MAP[iconVariant]}`}
          >
            {icon}
          </div>
        </CardHeader>

        <div
          data-testid="summary-card-value"
          className={styles.value}
          aria-label={finalFormattedValue}
        >
          {isAnimated ? (
            <>
              <span aria-hidden="true">{displayFormattedValue}</span>
              <span className="sr-only">{finalFormattedValue}</span>
            </>
          ) : (
            displayFormattedValue
          )}
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
    </motion.div>
  );
}
