import { QueryClient } from "@tanstack/react-query";
import { vi } from "vitest";

export interface MockNextNavigationOverrides {
  pathname?: string;
  searchParams?: string | Record<string, string> | URLSearchParams;
  [key: string]: unknown;
}

/**
 * Creates an isolated QueryClient for tests with retries and caching disabled
 */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/**
 * Global mockup for next/navigation (App Router)
 */
export function mockNextNavigation(overrides: MockNextNavigationOverrides = {}) {
  const pushMock = vi.fn();
  const replaceMock = vi.fn();
  const backMock = vi.fn();

  vi.mock("next/navigation", () => ({
    useRouter: () => ({
      push: pushMock,
      replace: replaceMock,
      back: backMock,
      prefetch: vi.fn(),
      ...overrides,
    }),
    usePathname: () => overrides.pathname ?? "/",
    useSearchParams: () => new URLSearchParams(overrides.searchParams ?? ""),
  }));

  return { pushMock, replaceMock, backMock };
}
