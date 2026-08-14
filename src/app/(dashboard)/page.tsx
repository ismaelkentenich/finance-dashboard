"use client";

import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { TransactionFormModal } from "@/components/dashboard/TransactionFormModal";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useModal } from "@/contexts/ModalContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useTransactionFilters } from "@/hooks/useTransactionFilters";
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

export default function DashboardPage() {
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
      ) : error || !data ? (
        <Card data-testid="dashboard-error-state">
          <p className={styles.errorMessage}>{error}</p>
        </Card>
      ) : (
        <>
          <SummaryCards summary={data.summary} />
          <div className={styles.contentGrid}>
            <RecentTransactions transactions={data.transactions} />
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
