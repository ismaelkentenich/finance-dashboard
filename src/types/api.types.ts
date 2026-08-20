import { CurrencyCode } from "./currency.types";
import type { PeriodFilter } from "./filter.types";
import type { CategorySummary, FinancialSummary } from "./financial.types";
import type {
  NormalizedTransaction,
  TransactionCategory,
  TransactionType,
} from "./transaction.types";

export interface GetDashboardDataResponse {
  data: {
    transactions: NormalizedTransaction[];
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
  category?: TransactionCategory | "all";
  currency?: CurrencyCode;
}
