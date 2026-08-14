"use client";

import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useLocale } from "@/contexts/LocaleContext";
import { transactionService } from "@/services/api/transactionService";
import type { GetDashboardDataResponse } from "@/types";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function DashboardPage() {
  const { t } = useLocale();
  const [data, setData] = useState<GetDashboardDataResponse["data"] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await transactionService.getDashboardData({
          period: "current-month",
        });
        setData(response.data);
      } catch {
        setError(t.common.noData);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, [t.common.noData]);

  if (isLoading) {
    return (
      <div className={styles.dashboardContainer} data-testid="dashboard-loading">
        {/* Summary Cards Skeletons */}
        <div className={styles.skeletonCardsGrid} aria-hidden="true">
          <Skeleton height="140px" borderRadius="var(--border-radius-lg)" />
          <Skeleton height="140px" borderRadius="var(--border-radius-lg)" />
          <Skeleton height="140px" borderRadius="var(--border-radius-lg)" />
          <Skeleton height="140px" borderRadius="var(--border-radius-lg)" />
        </div>

        {/* Main Grid Skeletons */}
        <div className={styles.contentGrid} aria-hidden="true">
          <Skeleton height="380px" borderRadius="var(--border-radius-lg)" />
          <Skeleton height="380px" borderRadius="var(--border-radius-lg)" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card data-testid="dashboard-error-state">
        <p className={styles.errorMessage}>{error || t.common.noData}</p>
      </Card>
    );
  }

  return (
    <div className={styles.dashboardContainer} data-testid="dashboard-view">
      <SummaryCards summary={data.summary} />

      <div className={styles.contentGrid}>
        <RecentTransactions transactions={data.transactions} />
        <CategoryBreakdown categories={data.categories} />
      </div>
    </div>
  );
}
