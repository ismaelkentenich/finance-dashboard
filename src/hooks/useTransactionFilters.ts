"use client";

import {
  DEFAULT_TRANSACTION_FILTERS,
  VALID_PERIODS,
  VALID_TRANSACTION_TYPES,
} from "@/constants/filter.constants";
import type {
  PeriodFilter,
  TransactionCategory,
  TransactionFiltersState,
  TransactionType,
} from "@/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export function useTransactionFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters: TransactionFiltersState = useMemo(() => {
    const periodParam = searchParams.get("period") as PeriodFilter | null;
    const typeParam = searchParams.get("type") as ("all" | TransactionType) | null;
    const categoryParam = searchParams.get("category") as ("all" | TransactionCategory) | null;

    return {
      period:
        periodParam && VALID_PERIODS.includes(periodParam)
          ? periodParam
          : DEFAULT_TRANSACTION_FILTERS.period,
      type:
        typeParam && VALID_TRANSACTION_TYPES.includes(typeParam)
          ? typeParam
          : DEFAULT_TRANSACTION_FILTERS.type,
      category:
        categoryParam && categoryParam !== "all"
          ? categoryParam
          : DEFAULT_TRANSACTION_FILTERS.category,
    };
  }, [searchParams]);

  const setFilters = useCallback(
    (newFilters: Partial<TransactionFiltersState>) => {
      const params = new URLSearchParams(searchParams.toString());
      const nextFilters = { ...filters, ...newFilters };

      if (nextFilters.period === DEFAULT_TRANSACTION_FILTERS.period) {
        params.delete("period");
      } else {
        params.set("period", nextFilters.period);
      }

      if (nextFilters.type === DEFAULT_TRANSACTION_FILTERS.type) {
        params.delete("type");
      } else {
        params.set("type", nextFilters.type);
      }

      if (nextFilters.category === DEFAULT_TRANSACTION_FILTERS.category) {
        params.delete("category");
      } else {
        params.set("category", nextFilters.category);
      }

      const queryString = params.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;

      router.push(targetUrl, { scroll: false });
    },
    [filters, pathname, router, searchParams]
  );

  const resetFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  const hasActiveFilters =
    filters.period !== DEFAULT_TRANSACTION_FILTERS.period ||
    filters.type !== DEFAULT_TRANSACTION_FILTERS.type ||
    filters.category !== DEFAULT_TRANSACTION_FILTERS.category;

  return {
    filters,
    setFilters,
    resetFilters,
    hasActiveFilters,
  };
}
