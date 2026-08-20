"use client";

import {
  getCategoryOptions,
  getPeriodOptions,
  getTypeOptions,
} from "@/components/dashboard/DashboardFilters/DashboardFilters.helpers";
import { TransactionFormModal } from "@/components/dashboard/TransactionFormModal";
import { TransactionsTable } from "@/components/dashboard/TransactionsTable";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { useLocale } from "@/contexts/LocaleContext";
import { useModal } from "@/contexts/ModalContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useTransactionFilters } from "@/hooks/useTransactionFilters";
import type { PeriodFilter, TransactionCategory, TransactionType } from "@/types";
import { FilterX, Plus, Search } from "lucide-react";
import { Suspense, useMemo, useState } from "react";
import styles from "./page.module.css";

function TransactionsSkeleton() {
  return (
    <div className={styles.container}>
      <Skeleton height="36px" width="200px" />
      <Skeleton height="64px" borderRadius="var(--border-radius-lg)" />
      <Skeleton height="400px" borderRadius="var(--border-radius-lg)" />
    </div>
  );
}

function TransactionsContent() {
  const { t } = useLocale();
  const { isTransactionModalOpen, openTransactionModal, closeTransactionModal } = useModal();
  const { filters, setFilters, resetFilters, hasActiveFilters } = useTransactionFilters();
  const { data, isLoading, isFetching, error, refetch } = useDashboardData(filters);

  const [searchQuery, setSearchQuery] = useState("");

  const periodOptions = useMemo(() => getPeriodOptions(t), [t]);
  const typeOptions = useMemo(() => getTypeOptions(t), [t]);
  const categoryOptions = useMemo(() => getCategoryOptions(t), [t]);

  const transactions = data?.transactions;

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    if (!searchQuery.trim()) return transactions;

    const queryLower = searchQuery.toLowerCase().trim();
    return transactions.filter((tx) => tx.description.toLowerCase().includes(queryLower));
  }, [transactions, searchQuery]);

  const searchStatsMessage = useMemo(() => {
    if (!transactions) return "";
    const count = filteredTransactions.length;
    const trimmedQuery = searchQuery.trim();

    if (trimmedQuery) {
      const template =
        count === 1 ? t.transactions.resultsForQuery : t.transactions.resultsForQueryPlural;
      return template.replace("{count}", String(count)).replace("{query}", trimmedQuery);
    }

    const template = count === 1 ? t.transactions.totalFound : t.transactions.totalFoundPlural;
    return template.replace("{count}", String(count));
  }, [transactions, filteredTransactions.length, searchQuery, t]);

  const isFiltered = hasActiveFilters || searchQuery.length > 0;
  const isUpdating = isFetching && !isLoading;

  const handleResetAll = () => {
    resetFilters();
    setSearchQuery("");
  };

  return (
    <div className={styles.container} data-testid="transactions-page">
      <div className={styles.headerRow}>
        <div className={styles.titleWrapper}>
          <h2 className={styles.pageTitle}>{t.sidebar.navigation.transactions}</h2>
          {!isLoading && !error && transactions && (
            <span
              className={styles.statsBadge}
              data-testid="transaction-search-stats"
              role="status"
              aria-live="polite"
            >
              {searchStatsMessage}
            </span>
          )}
        </div>
      </div>

      {/* Unified Toolbar Card */}
      <section
        className={styles.filterToolbarCard}
        aria-label={t.transactions.filtersAndSearchLabel}
      >
        <div className={styles.searchWrapper}>
          <Input
            variant="outline"
            size="md"
            placeholder={t.transactions?.searchDescription}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startIcon={<Search size={16} />}
            onClear={searchQuery ? () => setSearchQuery("") : undefined}
            clearButtonAriaLabel={t.transactions.clearSearch}
            data-testid="transaction-search-input"
            fullWidth
          />
        </div>

        <div className={styles.filtersGroup}>
          <div className={styles.selectItem}>
            <Select
              options={periodOptions}
              value={filters.period}
              onChange={(e) => setFilters({ period: e.target.value as PeriodFilter })}
              data-testid="period-filter-select"
              aria-label={t.filters.periodLabel}
              fullWidth
            />
          </div>

          <div className={styles.selectItem}>
            <Select
              options={typeOptions}
              value={filters.type}
              onChange={(e) => setFilters({ type: e.target.value as "all" | TransactionType })}
              data-testid="type-filter-select"
              aria-label={t.filters.typeLabel}
              fullWidth
            />
          </div>

          <div className={styles.selectItem}>
            <Select
              options={categoryOptions}
              value={filters.category}
              onChange={(e) =>
                setFilters({ category: e.target.value as "all" | TransactionCategory })
              }
              data-testid="category-filter-select"
              aria-label={t.filters.categoryLabel}
              fullWidth
            />
          </div>

          {isFiltered && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={handleResetAll}
              data-testid="reset-filters-button"
              aria-label={t.filters.clearFilters}
            >
              <FilterX size={14} aria-hidden="true" />
              {t.filters.clearFilters}
            </button>
          )}
        </div>
      </section>

      {isUpdating && (
        <div
          className={styles.updatingStatus}
          role="status"
          aria-live="polite"
          data-testid="transactions-updating-status"
        >
          <span className={styles.updatingSpinner} aria-hidden="true" />
          {t.common.updating}
        </div>
      )}

      {/* Content Rendering */}
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
            isFiltered ? (
              <Button variant="secondary" size="sm" onClick={handleResetAll}>
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
        <TransactionsTable
          title={t.transactions?.allTransactions}
          id="all-transactions"
          transactions={filteredTransactions}
        />
      )}

      <TransactionFormModal isOpen={isTransactionModalOpen} onClose={closeTransactionModal} />
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
