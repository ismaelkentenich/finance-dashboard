"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { transactionService } from "@/services/api/transactionService";
import type {
  GetDashboardDataResponse,
  PeriodFilter,
  TransactionCategory,
  TransactionType,
} from "@/types";
import { useCallback, useEffect, useState } from "react";

interface UseDashboardDataParams {
  period: PeriodFilter;
  type: "all" | TransactionType;
  category: "all" | TransactionCategory;
}

export function useDashboardData({ period, type, category }: UseDashboardDataParams) {
  const { t } = useLocale();
  const [data, setData] = useState<GetDashboardDataResponse["data"] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshIndex, setRefreshIndex] = useState<number>(0);

  const refetch = useCallback(() => {
    setRefreshIndex((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await transactionService.getDashboardData({
          period,
          type,
          category,
        });

        if (isMounted) {
          setData(response.data);
        }
      } catch {
        if (isMounted) {
          setError(t.common.noData);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [period, type, category, refreshIndex, t.common.noData]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}
