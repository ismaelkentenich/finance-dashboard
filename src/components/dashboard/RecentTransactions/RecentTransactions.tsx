"use client";

import { Card } from "@/components/ui/Card";
import { useLocale } from "@/contexts/LocaleContext";
import { TransactionRow } from "../TransactionRow";
import styles from "./RecentTransactions.module.css";
import type { RecentTransactionsProps } from "./RecentTransactions.types";

export function RecentTransactions({
  transactions,
  className = "",
  "data-testid": testId = "recent-transactions",
}: RecentTransactionsProps) {
  const { t } = useLocale();

  return (
    <Card data-testid={testId} className={className} aria-labelledby="recent-transactions-title">
      <h2 id="recent-transactions-title" className={styles.cardTitle}>
        {t.transactions.title}
      </h2>

      {transactions.length === 0 ? (
        <p data-testid="empty-transactions-message" className={styles.emptyText}>
          {t.transactions.empty}
        </p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table} data-testid="transactions-table">
            <thead>
              <tr>
                <th className={styles.th}>{t.transactions.table.description}</th>
                <th className={styles.th}>{t.transactions.table.category}</th>
                <th className={styles.th}>{t.transactions.table.date}</th>
                <th className={`${styles.th} ${styles.alignRight}`}>
                  {t.transactions.table.amount}
                </th>
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
