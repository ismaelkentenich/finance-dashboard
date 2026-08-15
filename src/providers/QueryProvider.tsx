"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

const STALE_TIME_ONE_MINUTE = 1000 * 60 * 1;
const DEFAULT_QUERY_RETRY_COUNT = 1;

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: STALE_TIME_ONE_MINUTE,
            refetchOnWindowFocus: false,
            retry: DEFAULT_QUERY_RETRY_COUNT,
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
