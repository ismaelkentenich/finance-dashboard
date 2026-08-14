import type { CategorySummary } from "@/types";

export interface CategoryBreakdownProps {
  categories: CategorySummary[];
  className?: string;
  "data-testid"?: string;
}
