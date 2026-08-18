import type { HTMLAttributes, ReactNode } from "react";

export type BadgeVariant = "success" | "danger" | "neutral" | "info";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
  "data-testid"?: string;
}
