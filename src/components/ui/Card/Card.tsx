import type { ReactNode } from "react";
import styles from "./Card.module.css";
import { CardProps } from "./Card.types";

export function Card({
  children,
  className = "",
  "data-testid": testId = "card-container",
  ...props
}: CardProps) {
  return (
    <div data-testid={testId} className={`${styles.card} ${className}`} {...props}>
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
    <div data-testid={testId} className={`${styles.cardHeader} ${className}`}>
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
    <h3 data-testid={testId} className={`${styles.cardTitle} ${className}`}>
      {children}
    </h3>
  );
}
