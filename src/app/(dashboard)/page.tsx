"use client";

import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { TransactionFormModal } from "@/components/dashboard/TransactionFormModal";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Skeleton } from "@/components/ui/Skeleton";
import { useLocale } from "@/contexts/LocaleContext";
import { useModal } from "@/contexts/ModalContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useTransactionFilters } from "@/hooks/useTransactionFilters";
import { FilterX } from "lucide-react";
import { Suspense } from "react";
import styles from "./page.module.css";

function DashboardSkeleton() {
  return (
    <div className={styles.loadingContainer} data-testid="dashboard-loading">
      <div className={styles.skeletonCardsGrid} aria-hidden="true">
        <Skeleton height="140px" borderRadius="var(--border-radius-lg)" />
        <Skeleton height="140px" borderRadius="var(--border-radius-lg)" />
        <Skeleton height="140px" borderRadius="var(--border-radius-lg)" />
        <Skeleton height="140px" borderRadius="var(--border-radius-lg)" />
      </div>

      <div className={styles.contentGrid} aria-hidden="true">
        <Skeleton height="380px" borderRadius="var(--border-radius-lg)" />
        <Skeleton height="380px" borderRadius="var(--border-radius-lg)" />
      </div>
    </div>
  );
}

function DashboardContent() {
  const { t } = useLocale();
  const { isTransactionModalOpen, closeTransactionModal } = useModal();
  const { filters, setFilters, resetFilters, hasActiveFilters } = useTransactionFilters();
  const { data, isLoading, error, refetch } = useDashboardData(filters);

  return (
    <div className={styles.dashboardContainer} data-testid="dashboard-view">
      <DashboardFilters
        period={filters.period}
        type={filters.type}
        category={filters.category}
        onPeriodChange={(period) => setFilters({ period })}
        onTypeChange={(type) => setFilters({ type })}
        onCategoryChange={(category) => setFilters({ category })}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {isLoading ? (
        <DashboardSkeleton />
      ) : error ? (
        <ErrorBanner
          title={t.errors.loadFailureTitle}
          message={error}
          onRetry={refetch}
          retryLabel={t.errors.retry}
          data-testid="dashboard-error-banner"
        />
      ) : !data || data.transactions.length === 0 ? (
        <>
          {data?.summary && <SummaryCards summary={data.summary} />}
          <EmptyState
            title={t.emptyStates.noTransactionsTitle}
            description={t.emptyStates.noTransactionsDescription}
            action={
              hasActiveFilters ? (
                <Button variant="secondary" size="sm" onClick={resetFilters}>
                  <FilterX size={16} aria-hidden="true" />
                  {t.emptyStates.clearFilters}
                </Button>
              ) : undefined
            }
          />
        </>
      ) : (
        <>
          <SummaryCards summary={data.summary} />
          <div className={styles.contentGrid}>
            <RecentTransactions
              transactions={data.transactions}
              title={t.transactions?.title}
              id="recent-transactions"
            />
            <CategoryBreakdown categories={data.categories} />
          </div>
        </>
      )}

      <TransactionFormModal
        isOpen={isTransactionModalOpen}
        onClose={closeTransactionModal}
        onSuccess={() => refetch()}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
