import type { ReactNode } from "react";
import styles from "./Card.module.css";
import type { CardProps, CardVariant } from "./Card.types";

const VARIANT_CLASS_MAP: Record<CardVariant, string> = {
  flat: styles.flat,
  raised: styles.raised,
  interactive: styles.interactive,
};

export function Card({
  children,
  variant = "flat",
  className = "",
  "data-testid": testId = "card-container",
  ...props
}: CardProps) {
  const variantClass = VARIANT_CLASS_MAP[variant] || styles.flat;

  return (
    <div
      data-testid={testId}
      className={`${styles.card} ${variantClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
  "data-testid": testId = "card-header",
}: {
  children: ReactNode;
  className?: string;
  "data-testid"?: string;
}) {
  return (
    <div data-testid={testId} className={`${styles.cardHeader} ${className}`.trim()}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = "",
  "data-testid": testId = "card-title",
}: {
  children: ReactNode;
  className?: string;
  "data-testid"?: string;
}) {
  return (
    <h3 data-testid={testId} className={`${styles.cardTitle} ${className}`.trim()}>
      {children}
    </h3>
  );
}
