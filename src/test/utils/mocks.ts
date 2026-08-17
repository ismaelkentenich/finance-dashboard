import { QueryClient } from "@tanstack/react-query";
import { vi } from "vitest";

export interface NextNavigationMockState {
  pathname: string;
  searchParams: URLSearchParams;
}

export interface NextRouterMocks {
  push: ReturnType<typeof vi.fn>;
  replace: ReturnType<typeof vi.fn>;
  back: ReturnType<typeof vi.fn>;
  forward: ReturnType<typeof vi.fn>;
  refresh: ReturnType<typeof vi.fn>;
  prefetch: ReturnType<typeof vi.fn>;
}

export interface CreateNextNavigationMocksOptions {
  pathname?: string;
  searchParams?: string | Record<string, string> | URLSearchParams;
}

/**
 * Creates an isolated QueryClient for each test.
 *
 * Retries are disabled so failures are deterministic and tests
 * do not wait for React Query retry timers.
 */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/**
 * Creates reusable mocks for the Next.js App Router.
 *
 * This function intentionally does not call `vi.mock`.
 * Module mocking should remain at module scope because Vitest
 * hoists `vi.mock()` calls.
 */
export function createNextNavigationMocks(options: CreateNextNavigationMocksOptions = {}) {
  const router: NextRouterMocks = {
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  };

  const state: NextNavigationMockState = {
    pathname: options.pathname ?? "/",
    searchParams: createSearchParams(options.searchParams),
  };

  return {
    router,
    state,

    setPathname(pathname: string) {
      state.pathname = pathname;
    },

    setSearchParams(searchParams: string | Record<string, string> | URLSearchParams) {
      state.searchParams = createSearchParams(searchParams);
    },

    reset() {
      state.pathname = options.pathname ?? "/";
      state.searchParams = createSearchParams(options.searchParams);

      Object.values(router).forEach((mock) => {
        mock.mockReset();
      });
    },
  };
}

export function createSearchParams(
  value?: string | Record<string, string> | URLSearchParams
): URLSearchParams {
  if (!value) {
    return new URLSearchParams();
  }

  if (value instanceof URLSearchParams) {
    return new URLSearchParams(value);
  }

  if (typeof value === "string") {
    return new URLSearchParams(value);
  }

  const params = new URLSearchParams();

  Object.entries(value).forEach(([key, paramValue]) => {
    params.set(key, paramValue);
  });

  return params;
}
