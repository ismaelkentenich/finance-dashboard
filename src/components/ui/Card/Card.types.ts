import type { HTMLAttributes, ReactNode } from "react";

export type CardVariant = "flat" | "raised" | "interactive";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: CardVariant;
  className?: string;
  "data-testid"?: string;
}
