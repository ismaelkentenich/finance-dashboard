import type { PeriodFilter } from "./filter.types";
import type { CategorySummary, FinancialSummary } from "./financial.types";
import type { Transaction, TransactionType } from "./transaction.types";

export interface GetDashboardDataResponse {
  data: {
    transactions: Transaction[];
    summary: FinancialSummary;
    categories: CategorySummary[];
  };
  meta: {
    totalCount: number;
    period: PeriodFilter;
  };
}

export interface FetchTransactionsParams {
  period?: PeriodFilter;
  type?: "all" | TransactionType;
  category?: string;
}
