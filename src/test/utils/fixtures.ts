import type {
  CategorySummary,
  FinancialSummary,
  NormalizedTransaction,
  Transaction,
} from "@/types";

let transactionSequence = 0;

export function createTransactionFixture(overrides: Partial<Transaction> = {}): Transaction {
  transactionSequence += 1;

  return {
    id: `tx-test-${transactionSequence}`,
    description: "Sample Transaction",
    amount: 100,
    currency: "BRL",
    type: "expense",
    category: "food",
    date: "2026-08-14",
    createdAt: "2026-08-14T10:00:00.000Z",
    ...overrides,
  };
}

export function createFinancialSummaryFixture(
  overrides: Partial<FinancialSummary> = {}
): FinancialSummary {
  const defaultPeriodComparison: FinancialSummary["periodComparison"] = {
    balanceVariation: 12.5,
    incomeVariation: 5,
    expensesVariation: -8.2,
  };

  return {
    currentBalance: 5657.5,
    totalIncome: 8500,
    totalExpenses: 2842.5,
    savingsRate: 66.6,
    ...overrides,

    periodComparison: {
      ...defaultPeriodComparison,
      ...overrides.periodComparison,
    },
  };
}

export function createCategorySummaryFixture(
  overrides: Partial<CategorySummary> = {}
): CategorySummary {
  return {
    category: "food",
    categoryLabel: "Alimentação & Mercado",
    totalAmount: 642.5,
    percentage: 100,
    transactionCount: 1,
    ...overrides,
  };
}

/**
 * Stable fixtures for tests and Storybook scenarios that do not
 * require custom values.
 */
export const mockTransactions: Transaction[] = [
  createTransactionFixture({
    id: "tx-001",
    description: "Salário Principal",
    amount: 8500,
    type: "income",
    category: "salary",
    date: "2026-08-05",
    createdAt: "2026-08-05T09:00:00.000Z",
  }),

  createTransactionFixture({
    id: "tx-002",
    description: "Aluguel",
    amount: 2200,
    type: "expense",
    category: "housing",
    date: "2026-08-06",
    createdAt: "2026-08-06T14:30:00.000Z",
  }),

  createTransactionFixture({
    id: "tx-003",
    description: "Supermercado",
    amount: 642.5,
    type: "expense",
    category: "food",
    date: "2026-08-08",
    createdAt: "2026-08-08T18:15:00.000Z",
  }),
];

export const mockSummary = createFinancialSummaryFixture();

export const mockCategories: CategorySummary[] = [
  createCategorySummaryFixture({
    category: "housing",
    categoryLabel: "Moradia",
    totalAmount: 2200,
    percentage: 77.4,
    transactionCount: 1,
  }),

  createCategorySummaryFixture({
    category: "food",
    categoryLabel: "Alimentação & Mercado",
    totalAmount: 642.5,
    percentage: 22.6,
    transactionCount: 1,
  }),
];

export function createNormalizedTransaction(
  overrides: Partial<NormalizedTransaction> = {}
): NormalizedTransaction {
  const amount = overrides.amount ?? 100;
  const currency = overrides.currency ?? "BRL";
  return {
    id: overrides.id ?? "tx-test",
    description: overrides.description ?? "Test transaction",
    amount,
    currency,
    normalizedAmount: overrides.normalizedAmount ?? amount,
    normalizedCurrency: overrides.normalizedCurrency ?? currency,
    type: overrides.type ?? "expense",
    category: overrides.category ?? "other",
    date: overrides.date ?? "2026-08-20",
    createdAt: overrides.createdAt ?? "2026-08-20T10:00:00.000Z",
  };
}

export const normalizedTransactions = [
  createNormalizedTransaction({
    id: "tx-001",
    description: "Salário Principal",
    amount: 8500,
    currency: "BRL",
    normalizedAmount: 8500,
    normalizedCurrency: "BRL",
    type: "income",
    category: "salary",
    date: "2026-08-05",
    createdAt: "2026-08-05T09:00:00.000Z",
  }),

  createNormalizedTransaction({
    id: "tx-002",
    description: "Aluguel",
    amount: 2200,
    currency: "BRL",
    normalizedAmount: 2200,
    normalizedCurrency: "BRL",
    type: "expense",
    category: "housing",
    date: "2026-08-06",
    createdAt: "2026-08-06T14:30:00.000Z",
  }),
];
