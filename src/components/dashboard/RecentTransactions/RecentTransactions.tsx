import { Card } from "@/components/ui/Card";
import { TransactionRow } from "./components/TransactionRow";
import styles from "./RecentTransactions.module.css";
import type { RecentTransactionsProps } from "./RecentTransactions.types";

export function RecentTransactions({
  transactions,
  "data-testid": testId = "recent-transactions",
}: RecentTransactionsProps) {
  return (
    <Card data-testid={testId} aria-labelledby="recent-transactions-title">
      <h2 id="recent-transactions-title" className={styles.cardTitle}>
        Recent Transactions
      </h2>

      {transactions.length === 0 ? (
        <p data-testid="empty-transactions-message" className={styles.emptyText}>
          No transactions found for the selected period.
        </p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table} data-testid="transactions-table">
            <thead>
              <tr>
                <th className={styles.th}>Description</th>
                <th className={styles.th}>Category</th>
                <th className={styles.th}>Date</th>
                <th className={`${styles.th} ${styles.alignRight}`}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <TransactionRow key={tx.id} transaction={tx} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
