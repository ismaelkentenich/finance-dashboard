import type { TransactionCategory } from "./transaction.types";

export interface FinancialSummary {
  currentBalance: number;
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
  periodComparison: {
    balanceVariation: number;
    incomeVariation: number;
    expensesVariation: number;
  };
}

export interface CategorySummary {
  category: TransactionCategory;
  categoryLabel: string;
  totalAmount: number;
  percentage: number;
  transactionCount: number;
}
