import type { BadgeVariant } from "@/components/ui/Badge/Badge.types";
import type { HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

export type SummaryCardIconVariant = "balance" | "income" | "expense" | "savings";

export interface SummaryCardBadgeProps {
  text: string;
  variant: BadgeVariant;
  ariaLabel?: string;
}

export interface SummaryCardProps extends HTMLMotionProps<"div"> {
  title: string;
  value: string;
  icon: ReactNode;
  iconVariant: SummaryCardIconVariant;
  badge?: SummaryCardBadgeProps;
  footerText: string;
  className?: string;
  "data-testid"?: string;
}
