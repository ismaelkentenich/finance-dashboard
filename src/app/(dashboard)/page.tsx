"use client";

import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { DraggableWidget } from "@/components/dashboard/DraggableWidget";
import { FinancialChart } from "@/components/dashboard/FinancialChart";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { TransactionFormModal } from "@/components/dashboard/TransactionFormModal";
import { TransactionsTable } from "@/components/dashboard/TransactionsTable";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Skeleton } from "@/components/ui/Skeleton";
import { useLocale } from "@/contexts/LocaleContext";
import { useModal } from "@/contexts/ModalContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useTransactionFilters } from "@/hooks/useTransactionFilters";
import type { WidgetId } from "@/types";
import { Reorder } from "framer-motion";
import { FilterX } from "lucide-react";
import { Suspense, type ReactNode } from "react";
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

      <Skeleton height="320px" borderRadius="var(--border-radius-lg)" />

      <div className={styles.contentGrid} aria-hidden="true">
        <Skeleton height="380px" borderRadius="var(--border-radius-lg)" />
        <Skeleton height="380px" borderRadius="var(--border-radius-lg)" />
      </div>
    </div>
  );
}

function DashboardContent() {
  const { t } = useLocale();
  const { overviewSettings, reorderWidgets } = useSettings();
  const { isTransactionModalOpen, closeTransactionModal } = useModal();
  const { filters, setFilters, resetFilters, hasActiveFilters } = useTransactionFilters();
  const { data, isLoading, error, refetch } = useDashboardData(filters);

  const hasAnyWidgetVisible =
    overviewSettings.showSummaryCards ||
    overviewSettings.showFinancialChart ||
    overviewSettings.showCategoryBreakdown ||
    overviewSettings.showRecentTransactions;

  const renderWidget = (widgetId: WidgetId): ReactNode => {
    if (!data) return null;

    switch (widgetId) {
      case "summaryCards":
        return overviewSettings.showSummaryCards ? <SummaryCards summary={data.summary} /> : null;

      case "financialChart":
        return overviewSettings.showFinancialChart ? (
          <FinancialChart transactions={data.transactions} categories={data.categories} />
        ) : null;

      case "categoryBreakdown":
        return overviewSettings.showCategoryBreakdown ? (
          <CategoryBreakdown categories={data.categories} />
        ) : null;

      case "recentTransactions":
        return overviewSettings.showRecentTransactions ? (
          <TransactionsTable
            transactions={data.transactions}
            title={t.transactions?.recentTransactions}
            id="recent-transactions"
          />
        ) : null;

      default:
        return null;
    }
  };

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
          {overviewSettings.showSummaryCards && data?.summary && (
            <SummaryCards summary={data.summary} />
          )}
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
          <Reorder.Group
            axis="y"
            values={overviewSettings.widgetOrder}
            onReorder={reorderWidgets}
            className={styles.dashboardContainer}
            style={{ listStyle: "none", padding: 0, margin: 0 }}
          >
            {overviewSettings.widgetOrder.map((widgetId) => {
              const content = renderWidget(widgetId);
              if (!content) return null;

              return (
                <DraggableWidget key={widgetId} value={widgetId}>
                  {content}
                </DraggableWidget>
              );
            })}
          </Reorder.Group>

          {!hasAnyWidgetVisible && (
            <EmptyState
              title={t.emptyStates.noTransactionsTitle}
              description={t.settings.subtitle}
            />
          )}
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
