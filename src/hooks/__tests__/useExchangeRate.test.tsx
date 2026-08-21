import { exchangeRateService } from "@/services/api/exchangeRateService";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EXCHANGE_RATE_QUERY_KEY, useExchangeRate } from "../useExchangeRate";

vi.mock("@/services/api/exchangeRateService", () => ({
  exchangeRateService: {
    getRate: vi.fn(),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe("useExchangeRate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches current exchange rate", async () => {
    vi.mocked(exchangeRateService.getRate).mockResolvedValueOnce({
      from: "USD",
      to: "BRL",
      rate: 5.42,
      date: "2026-08-20",
    });

    const { result } = renderHook(
      () =>
        useExchangeRate({
          from: "USD",
          to: "BRL",
        }),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(exchangeRateService.getRate).toHaveBeenCalledTimes(1);

    expect(exchangeRateService.getRate).toHaveBeenCalledWith({
      from: "USD",
      to: "BRL",
      date: undefined,
    });

    expect(result.current.data).toEqual({
      from: "USD",
      to: "BRL",
      rate: 5.42,
      date: "2026-08-20",
    });
  });

  it("fetches historical exchange rate", async () => {
    vi.mocked(exchangeRateService.getRate).mockResolvedValueOnce({
      from: "USD",
      to: "BRL",
      rate: 5.1,
      date: "2026-01-10",
    });

    const { result } = renderHook(
      () =>
        useExchangeRate({
          from: "USD",
          to: "BRL",
          date: "2026-01-10",
        }),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(exchangeRateService.getRate).toHaveBeenCalledWith({
      from: "USD",
      to: "BRL",
      date: "2026-01-10",
    });

    expect(result.current.data).toEqual({
      from: "USD",
      to: "BRL",
      rate: 5.1,
      date: "2026-01-10",
    });
  });

  it("does not fetch when enabled is false", () => {
    const { result } = renderHook(
      () =>
        useExchangeRate({
          from: "USD",
          to: "BRL",
          enabled: false,
        }),
      {
        wrapper: createWrapper(),
      }
    );

    expect(exchangeRateService.getRate).not.toHaveBeenCalled();

    expect(result.current.fetchStatus).toBe("idle");
  });

  it("does not fetch when currencies are equal", () => {
    const { result } = renderHook(
      () =>
        useExchangeRate({
          from: "BRL",
          to: "BRL",
        }),
      {
        wrapper: createWrapper(),
      }
    );

    expect(exchangeRateService.getRate).not.toHaveBeenCalled();

    expect(result.current.fetchStatus).toBe("idle");
  });

  it("exposes service errors through the query", async () => {
    const error = new Error("Failed to fetch exchange rate.");

    vi.mocked(exchangeRateService.getRate).mockRejectedValueOnce(error);

    const { result } = renderHook(
      () =>
        useExchangeRate({
          from: "USD",
          to: "BRL",
        }),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBe(error);
  });

  it("uses the expected current-rate query key", async () => {
    vi.mocked(exchangeRateService.getRate).mockResolvedValueOnce({
      from: "USD",
      to: "BRL",
      rate: 5.42,
      date: "2026-08-20",
    });

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    function Wrapper({ children }: { children: ReactNode }) {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    }

    const { result } = renderHook(
      () =>
        useExchangeRate({
          from: "USD",
          to: "BRL",
        }),
      {
        wrapper: Wrapper,
      }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(queryClient.getQueryData([EXCHANGE_RATE_QUERY_KEY, "USD", "BRL", "latest"])).toEqual({
      from: "USD",
      to: "BRL",
      rate: 5.42,
      date: "2026-08-20",
    });
  });

  it("uses the date in historical query key", async () => {
    vi.mocked(exchangeRateService.getRate).mockResolvedValueOnce({
      from: "USD",
      to: "BRL",
      rate: 5.1,
      date: "2026-01-10",
    });

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    function Wrapper({ children }: { children: ReactNode }) {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    }

    const { result } = renderHook(
      () =>
        useExchangeRate({
          from: "USD",
          to: "BRL",
          date: "2026-01-10",
        }),
      {
        wrapper: Wrapper,
      }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(queryClient.getQueryData([EXCHANGE_RATE_QUERY_KEY, "USD", "BRL", "2026-01-10"])).toEqual(
      {
        from: "USD",
        to: "BRL",
        rate: 5.1,
        date: "2026-01-10",
      }
    );
  });

  it("reuses cached historical rate for identical query", async () => {
    vi.mocked(exchangeRateService.getRate).mockResolvedValue({
      from: "USD",
      to: "BRL",
      rate: 5.1,
      date: "2026-01-10",
    });

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    function Wrapper({ children }: { children: ReactNode }) {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    }

    const first = renderHook(
      () =>
        useExchangeRate({
          from: "USD",
          to: "BRL",
          date: "2026-01-10",
        }),
      {
        wrapper: Wrapper,
      }
    );

    await waitFor(() => {
      expect(first.result.current.isSuccess).toBe(true);
    });

    const second = renderHook(
      () =>
        useExchangeRate({
          from: "USD",
          to: "BRL",
          date: "2026-01-10",
        }),
      {
        wrapper: Wrapper,
      }
    );

    await waitFor(() => {
      expect(second.result.current.isSuccess).toBe(true);
    });

    expect(exchangeRateService.getRate).toHaveBeenCalledTimes(1);
  });
});
