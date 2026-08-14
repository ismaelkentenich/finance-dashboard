import { Badge } from "@/components/ui/Badge";
import { CATEGORY_LABELS } from "@/constants/transaction.constants";
import { formatCurrency, formatDate } from "@/utils/formatters";
import styles from "./TransactionRow.module.css";
import type { TransactionRowProps } from "./TransactionRow.types";

export function TransactionRow({
  transaction,
  "data-testid": testId = `transaction-row-${transaction.id}`,
}: TransactionRowProps) {
  const isIncome = transaction.type === "income";
  const categoryLabel = CATEGORY_LABELS[transaction.category] || transaction.category;
  const formattedAmount = `${isIncome ? "+" : "-"} ${formatCurrency(transaction.amount)}`;

  return (
    <tr data-testid={testId} className={styles.row}>
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
        {formatDate(transaction.date)}
      </td>

      {/* Amount Column */}
      <td
        data-testid="transaction-amount"
        className={`${styles.td} ${styles.amountCell} ${
          isIncome ? styles.incomeAmount : styles.expenseAmount
        }`}
      >
        {formattedAmount}
      </td>
    </tr>
  );
}
