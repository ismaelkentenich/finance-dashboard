import { CATEGORY_LABELS } from "@/constants/transaction.constants";
import type {
  CategorySummary,
  FinancialSummary,
  NormalizedTransaction,
  TransactionCategory,
} from "@/types";

export function calculateFinancialSummary(
  transactions: NormalizedTransaction[],
  previousPeriodTransactions: NormalizedTransaction[] = []
): FinancialSummary {
  const totalIncome = transactions
    .filter((tx) => tx.type === "income")
    .reduce((acc, tx) => acc + tx.normalizedAmount, 0);

  const totalExpenses = transactions
    .filter((tx) => tx.type === "expense")
    .reduce((acc, tx) => acc + tx.normalizedAmount, 0);

  const currentBalance = totalIncome - totalExpenses;

  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  const prevIncome = previousPeriodTransactions
    .filter((tx) => tx.type === "income")
    .reduce((acc, tx) => acc + tx.normalizedAmount, 0);

  const prevExpenses = previousPeriodTransactions
    .filter((tx) => tx.type === "expense")
    .reduce((acc, tx) => acc + tx.normalizedAmount, 0);

  const prevBalance = prevIncome - prevExpenses;

  const calculateVariation = (current: number, previous: number): number => {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }

    return ((current - previous) / Math.abs(previous)) * 100;
  };

  return {
    currentBalance,
    totalIncome,
    totalExpenses,
    savingsRate: Number(savingsRate.toFixed(1)),
    periodComparison: {
      balanceVariation: Number(calculateVariation(currentBalance, prevBalance).toFixed(1)),
      incomeVariation: Number(calculateVariation(totalIncome, prevIncome).toFixed(1)),
      expensesVariation: Number(calculateVariation(totalExpenses, prevExpenses).toFixed(1)),
    },
  };
}

export function calculateCategoryBreakdown(
  transactions: NormalizedTransaction[]
): CategorySummary[] {
  const expenseTransactions = transactions.filter((tx) => tx.type === "expense");

  const totalExpenses = expenseTransactions.reduce((acc, tx) => acc + tx.normalizedAmount, 0);

  if (totalExpenses === 0) {
    return [];
  }

  const categoryMap = new Map<
    TransactionCategory,
    {
      amount: number;
      count: number;
    }
  >();

  expenseTransactions.forEach((tx) => {
    const existing = categoryMap.get(tx.category) ?? {
      amount: 0,
      count: 0,
    };

    categoryMap.set(tx.category, {
      amount: existing.amount + tx.normalizedAmount,
      count: existing.count + 1,
    });
  });

  return Array.from(categoryMap.entries())
    .map(([category, { amount, count }]) => ({
      category,
      categoryLabel: CATEGORY_LABELS[category] ?? category,
      totalAmount: Number(amount.toFixed(2)),
      percentage: Number(((amount / totalExpenses) * 100).toFixed(1)),
      transactionCount: count,
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount);
}
