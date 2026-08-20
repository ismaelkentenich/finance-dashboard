import type { CategorySummary, NormalizedTransaction } from "@/types";

export interface FinancialChartProps {
  transactions: NormalizedTransaction[];
  categories: CategorySummary[];
  className?: string;
  "data-testid"?: string;
}
