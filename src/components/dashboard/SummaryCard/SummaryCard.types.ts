import type { BadgeVariant } from "@/components/ui/Badge/Badge.types";
import type { ComponentType } from "react";

export type SummaryCardIconVariant = "balance" | "income" | "expense" | "savings";

export interface SummaryCardBadgeProps {
  text: string;
  variant: BadgeVariant;
  ariaLabel?: string;
}

export interface SummaryCardProps {
  title: string;
  value: string;
  icon: ComponentType<{
    size?: number | string;
    className?: string;
    "aria-hidden"?: boolean | "true" | "false";
  }>;
  iconVariant: SummaryCardIconVariant;
  badge?: SummaryCardBadgeProps;
  footerText: string;
  className?: string;
  "data-testid"?: string;
}
