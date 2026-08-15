import type { CategorySummary, Transaction } from "@/types";

export interface FinancialChartProps {
  transactions: Transaction[];
  categories: CategorySummary[];
  className?: string;
  "data-testid"?: string;
}
