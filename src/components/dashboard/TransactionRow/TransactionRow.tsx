"use client";

import { Badge } from "@/components/ui/Badge";
import { useLocale } from "@/contexts/LocaleContext";
import { SPRING_TRANSITIONS, tableRowVariants } from "@/motion";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { motion } from "framer-motion";
import styles from "./TransactionRow.module.css";
import type { TransactionRowProps } from "./TransactionRow.types";

export function TransactionRow({
  transaction,
  className = "",
  "data-testid": testId = `transaction-row-${transaction.id}`,
  ...motionProps
}: TransactionRowProps) {
  const { t, locale } = useLocale();
  const isIncome = transaction.type === "income";

  const categoryLabel = t.categories.labels[transaction.category] || transaction.category;
  const formattedAmount = `${isIncome ? "+" : "-"} ${formatCurrency(transaction.amount, locale)}`;
  const accessibleTypeLabel = isIncome ? t.filters.types.income : t.filters.types.expense;

  return (
    <motion.tr
      layout="position"
      variants={tableRowVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={SPRING_TRANSITIONS.layout}
      data-testid={testId}
      className={`${styles.row} ${className}`.trim()}
      {...motionProps}
    >
      {/* Description */}
      <td
        data-testid="transaction-description"
        className={`${styles.td} ${styles.descriptionCell}`}
      >
        {transaction.description}
      </td>

      {/* Category */}
      <td data-testid="transaction-category" className={`${styles.td} ${styles.categoryCell}`}>
        <Badge variant="neutral" data-testid="category-badge">
          {categoryLabel}
        </Badge>
      </td>

      {/* Date */}
      <td data-testid="transaction-date" className={`${styles.td} ${styles.dateCell}`}>
        {formatDate(transaction.date, locale)}
      </td>

      {/* Amount */}
      <td
        data-testid="transaction-amount"
        className={`${styles.td} ${styles.amountCell} ${
          isIncome ? styles.incomeAmount : styles.expenseAmount
        }`}
      >
        <span className="sr-only">{accessibleTypeLabel}: </span>
        {formattedAmount}
      </td>
    </motion.tr>
  );
}
