"use client";

import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { TransactionFormModal } from "@/components/dashboard/TransactionFormModal";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { useLocale } from "@/contexts/LocaleContext";
import { useModal } from "@/contexts/ModalContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useTransactionFilters } from "@/hooks/useTransactionFilters";
import { FilterX, Plus } from "lucide-react";
import { Suspense, useMemo, useState } from "react";
import styles from "./page.module.css";

function TransactionsSkeleton() {
  return (
    <div className={styles.container}>
      <Skeleton height="36px" width="240px" />
      <Skeleton height="56px" borderRadius="var(--border-radius-lg)" />
      <Skeleton height="400px" borderRadius="var(--border-radius-lg)" />
    </div>
  );
}

function TransactionsContent() {
  const { t } = useLocale();
  const { isTransactionModalOpen, openTransactionModal, closeTransactionModal } = useModal();
  const { filters, setFilters, resetFilters, hasActiveFilters } = useTransactionFilters();
  const { data, isLoading, error, refetch } = useDashboardData(filters);

  const [searchQuery, setSearchQuery] = useState("");

  const transactions = data?.transactions;

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    if (!searchQuery.trim()) return transactions;

    const queryLower = searchQuery.toLowerCase().trim();
    return transactions.filter((tx) => tx.description.toLowerCase().includes(queryLower));
  }, [transactions, searchQuery]);

  return (
    <div className={styles.container} data-testid="transactions-page">
      <div className={styles.headerRow}>
        <h2 className={styles.pageTitle}>{t.sidebar.navigation.transactions}</h2>
      </div>

      <div className={styles.searchBarWrapper}>
        <div className={styles.searchInput}>
          <Input
            placeholder={t.transactions?.searchDescription}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
          />
        </div>
      </div>

      <DashboardFilters
        period={filters.period}
        type={filters.type}
        category={filters.category}
        onPeriodChange={(period) => setFilters({ period })}
        onTypeChange={(type) => setFilters({ type })}
        onCategoryChange={(category) => setFilters({ category })}
        onReset={() => {
          resetFilters();
          setSearchQuery("");
        }}
        hasActiveFilters={hasActiveFilters || searchQuery.length > 0}
      />

      {isLoading ? (
        <TransactionsSkeleton />
      ) : error ? (
        <ErrorBanner
          title={t.errors.loadFailureTitle}
          message={error}
          onRetry={refetch}
          retryLabel={t.errors.retry}
        />
      ) : filteredTransactions.length === 0 ? (
        <EmptyState
          title={t.emptyStates.noTransactionsTitle}
          description={t.emptyStates.noTransactionsDescription}
          action={
            hasActiveFilters || searchQuery ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  resetFilters();
                  setSearchQuery("");
                }}
              >
                <FilterX size={16} aria-hidden="true" />
                {t.emptyStates.clearFilters}
              </Button>
            ) : (
              <Button variant="primary" size="sm" onClick={openTransactionModal}>
                <Plus size={16} aria-hidden="true" />
                {t.transactionModal.triggerButton}
              </Button>
            )
          }
        />
      ) : (
        <RecentTransactions
          title={t.transactions?.allTransactions}
          id="all-transactions"
          transactions={filteredTransactions}
        />
      )}

      <TransactionFormModal
        isOpen={isTransactionModalOpen}
        onClose={closeTransactionModal}
        onSuccess={() => refetch()}
      />
    </div>
  );
}

export default function TransactionsPage() {
  return (
    <Suspense fallback={<TransactionsSkeleton />}>
      <TransactionsContent />
    </Suspense>
  );
}
