import type { ReactNode } from "react";

export type BadgeVariant = "success" | "danger" | "neutral" | "info";

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
  "data-testid"?: string;
}
