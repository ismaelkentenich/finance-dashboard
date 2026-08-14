export type TransactionType = "income" | "expense";

/**
 * Standard expense and income categories supported by the dashboard
 */
export type TransactionCategory =
  | "housing"
  | "food"
  | "transportation"
  | "utilities"
  | "entertainment"
  | "healthcare"
  | "education"
  | "shopping"
  | "services"
  | "salary"
  | "freelance"
  | "investment"
  | "other";

/**
 * Core domain model representing a single financial transaction
 */
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string;
  createdAt: string;
}

/**
 * Aggregated financial balance metrics for a given period
 */
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

/**
 * Category-based expense breakdown item
 */
export interface CategorySummary {
  category: TransactionCategory;
  categoryLabel: string;
  totalAmount: number;
  percentage: number;
  transactionCount: number;
}

/**
 * Supported time range filters for the dashboard
 */
export type PeriodFilter = "current-month" | "previous-month" | "last-3-months" | "custom";

/**
 * Query criteria for fetching filtered transactions
 */
export interface TransactionFilterParams {
  period?: PeriodFilter;
  type?: "all" | TransactionType;
  category?: TransactionCategory | "all";
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
}
