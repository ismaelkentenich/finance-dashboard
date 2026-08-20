import type { CategorySummary, CurrencyCode, NormalizedTransaction } from "@/types";

export interface FinancialChartProps {
  transactions: NormalizedTransaction[];
  categories: CategorySummary[];
  currency: CurrencyCode;
  className?: string;
  "data-testid"?: string;
}
