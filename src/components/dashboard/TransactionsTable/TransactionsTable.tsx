"use client";

import { Card } from "@/components/ui/Card";
import { useLocale } from "@/contexts/LocaleContext";
import { summaryCardItemVariants } from "@/motion";
import { AnimatePresence, motion } from "framer-motion";
import { TransactionRow } from "../TransactionRow";
import styles from "./TransactionsTable.module.css";
import type { TransactionsTableProps } from "./TransactionsTable.types";

export function TransactionsTable({
  transactions,
  title,
  id = "transactions",
  className = "",
  "data-testid": testId = "recent-transactions",
}: TransactionsTableProps) {
  const { t } = useLocale();
  const displayTitle = title || t.transactions.title;
  const titleId = `${id}-title`;

  return (
    <motion.div variants={summaryCardItemVariants} initial="initial" animate="animate">
      <Card id={id} data-testid={testId} className={className} aria-labelledby={titleId}>
        <h2 id={titleId} className={styles.cardTitle}>
          {displayTitle}
        </h2>

        {transactions.length === 0 ? (
          <p data-testid="empty-transactions-message" className={styles.emptyText}>
            {t.transactions.empty}
          </p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table} data-testid="transactions-table">
              <thead className={styles.thead}>
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
                <AnimatePresence initial={false}>
                  {transactions.map((tx) => (
                    <TransactionRow key={tx.id} transaction={tx} />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
