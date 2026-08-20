import type { CurrencyCode, FinancialSummary } from "@/types";

export interface SummaryCardsProps {
  summary: FinancialSummary;
  currency: CurrencyCode;
  "data-testid"?: string;
}
