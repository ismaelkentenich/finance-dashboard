import type { CategorySummary, CurrencyCode } from "@/types";

export interface CategoryBreakdownProps {
  categories: CategorySummary[];
  className?: string;
  currency: CurrencyCode;
  "data-testid"?: string;
}
