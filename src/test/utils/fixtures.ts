import type { CategorySummary, FinancialSummary, Transaction } from "@/types";

export const mockTransactions: Transaction[] = [
  {
    id: "tx-001",
    description: "Salário Principal",
    amount: 8500.0,
    type: "income",
    category: "salary",
    date: "2026-08-05",
    createdAt: "2026-08-05T09:00:00.000Z",
  },
  {
    id: "tx-002",
    description: "Aluguel",
    amount: 2200.0,
    type: "expense",
    category: "housing",
    date: "2026-08-06",
    createdAt: "2026-08-06T14:30:00.000Z",
  },
  {
    id: "tx-003",
    description: "Supermercado",
    amount: 642.5,
    type: "expense",
    category: "food",
    date: "2026-08-08",
    createdAt: "2026-08-08T18:15:00.000Z",
  },
];

export const mockSummary: FinancialSummary = {
  currentBalance: 5657.5,
  totalIncome: 8500.0,
  totalExpenses: 2842.5,
  savingsRate: 66.6,
  periodComparison: {
    balanceVariation: 12.5,
    incomeVariation: 5.0,
    expensesVariation: -8.2,
  },
};

export const mockCategories: CategorySummary[] = [
  {
    category: "housing",
    categoryLabel: "Moradia",
    totalAmount: 2200.0,
    percentage: 77.4,
    transactionCount: 1,
  },
  {
    category: "food",
    categoryLabel: "Alimentação & Mercado",
    totalAmount: 642.5,
    percentage: 22.6,
    transactionCount: 1,
  },
];
