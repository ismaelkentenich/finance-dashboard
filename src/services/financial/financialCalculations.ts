import { CATEGORY_LABELS } from "@/constants/transaction.constants";
import type { CategorySummary, FinancialSummary, Transaction, TransactionCategory } from "@/types";

export function calculateFinancialSummary(
  transactions: Transaction[],
  previousPeriodTransactions: Transaction[] = []
): FinancialSummary {
  const totalIncome = transactions
    .filter((tx) => tx.type === "income")
    .reduce((acc, tx) => acc + tx.amount, 0);

  const totalExpenses = transactions
    .filter((tx) => tx.type === "expense")
    .reduce((acc, tx) => acc + tx.amount, 0);

  const currentBalance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  const prevIncome = previousPeriodTransactions
    .filter((tx) => tx.type === "income")
    .reduce((acc, tx) => acc + tx.amount, 0);

  const prevExpenses = previousPeriodTransactions
    .filter((tx) => tx.type === "expense")
    .reduce((acc, tx) => acc + tx.amount, 0);

  const prevBalance = prevIncome - prevExpenses;

  const calculateVariation = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
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

export function calculateCategoryBreakdown(transactions: Transaction[]): CategorySummary[] {
  const expenseTransactions = transactions.filter((tx) => tx.type === "expense");
  const totalExpenses = expenseTransactions.reduce((acc, tx) => acc + tx.amount, 0);

  if (totalExpenses === 0) {
    return [];
  }

  const categoryMap = new Map<TransactionCategory, { amount: number; count: number }>();

  expenseTransactions.forEach((tx) => {
    const current = categoryMap.get(tx.category) || { amount: 0, count: 0 };
    categoryMap.set(tx.category, {
      amount: current.amount + tx.amount,
      count: current.count + 1,
    });
  });

  const breakdown: CategorySummary[] = Array.from(categoryMap.entries()).map(([category, data]) => {
    const percentage = (data.amount / totalExpenses) * 100;
    return {
      category,
      categoryLabel: CATEGORY_LABELS[category] || category,
      totalAmount: Number(data.amount.toFixed(2)),
      percentage: Number(percentage.toFixed(1)),
      transactionCount: data.count,
    };
  });

  return breakdown.sort((a, b) => b.totalAmount - a.totalAmount);
}
