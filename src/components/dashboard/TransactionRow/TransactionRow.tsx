"use client";

import { Badge } from "@/components/ui/Badge";
import { useLocale } from "@/contexts/LocaleContext";
import { formatCurrency, formatDate } from "@/utils/formatters";
import styles from "./TransactionRow.module.css";
import type { TransactionRowProps } from "./TransactionRow.types";

export function TransactionRow({
  transaction,
  className = "",
  "data-testid": testId = `transaction-row-${transaction.id}`,
}: TransactionRowProps) {
  const { t, locale } = useLocale();
  const isIncome = transaction.type === "income";

  const categoryLabel = t.categories.labels[transaction.category] || transaction.category;
  const formattedAmount = `${isIncome ? "+" : "-"} ${formatCurrency(transaction.amount, locale)}`;
  const accessibleTypeLabel = isIncome ? t.filters.types.income : t.filters.types.expense;

  return (
    <tr data-testid={testId} className={`${styles.row} ${className}`.trim()}>
      {/* Description Column */}
      <td
        data-testid="transaction-description"
        className={`${styles.td} ${styles.descriptionCell}`}
      >
        {transaction.description}
      </td>

      {/* Category Column */}
      <td data-testid="transaction-category" className={styles.td}>
        <Badge variant="neutral" data-testid="category-badge">
          {categoryLabel}
        </Badge>
      </td>

      {/* Date Column */}
      <td data-testid="transaction-date" className={`${styles.td} ${styles.dateCell}`}>
        {formatDate(transaction.date, locale)}
      </td>

      {/* Amount Column */}
      <td
        data-testid="transaction-amount"
        className={`${styles.td} ${styles.amountCell} ${
          isIncome ? styles.incomeAmount : styles.expenseAmount
        }`}
      >
        <span className="sr-only">{accessibleTypeLabel}: </span>
        {formattedAmount}
      </td>
    </tr>
  );
}
