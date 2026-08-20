import { exchangeRateService } from "@/services/api/exchangeRateService";
import type { GetExchangeRateParams } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const EXCHANGE_RATE_QUERY_KEY = "exchange-rate";

const CURRENT_RATE_STALE_TIME = 1000 * 60 * 15;

interface UseExchangeRateParams extends GetExchangeRateParams {
  enabled?: boolean;
}

export function useExchangeRate({ from, to, date, enabled = true }: UseExchangeRateParams) {
  return useQuery({
    queryKey: [EXCHANGE_RATE_QUERY_KEY, from, to, date ?? "latest"],

    queryFn: () =>
      exchangeRateService.getRate({
        from,
        to,
        date,
      }),

    enabled: enabled && from !== to,

    staleTime: date ? Infinity : CURRENT_RATE_STALE_TIME,
  });
}
