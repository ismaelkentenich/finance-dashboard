"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { transactionService } from "@/services/api/transactionService";
import type { PeriodFilter, TransactionCategory, TransactionType } from "@/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

interface UseDashboardDataParams {
  period: PeriodFilter;
  type: "all" | TransactionType;
  category: "all" | TransactionCategory;
}

export const DASHBOARD_QUERY_KEY = "dashboard";

export function useDashboardData({ period, type, category }: UseDashboardDataParams) {
  const { t } = useLocale();

  const query = useQuery({
    queryKey: [DASHBOARD_QUERY_KEY, { period, type, category }],
    queryFn: async () => {
      const response = await transactionService.getDashboardData({
        period,
        type,
        category,
      });

      return response.data;
    },
    placeholderData: keepPreviousData,
  });

  return {
    data: query.data ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.isError ? t.errors.loadFailureMessage : null,
    refetch: query.refetch,
  };
}
