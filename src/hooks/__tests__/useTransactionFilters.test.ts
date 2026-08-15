import { DEFAULT_TRANSACTION_FILTERS } from "@/constants/filter.constants";
import { useTransactionFilters } from "@/hooks/useTransactionFilters";
import { act, renderHook } from "@testing-library/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
  useSearchParams: vi.fn(),
}));

describe("useTransactionFilters Hook", () => {
  const mockPush = vi.fn();
  const defaultPathname = "/dashboard";

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
    } as unknown as ReturnType<typeof useRouter>);
    vi.mocked(usePathname).mockReturnValue(defaultPathname);
  });

  describe("URL Query Parsing & Runtime Validation", () => {
    it("returns default filters when URL search params are completely empty", () => {
      vi.mocked(useSearchParams).mockReturnValue(
        new URLSearchParams() as unknown as ReturnType<typeof useSearchParams>
      );

      const { result } = renderHook(() => useTransactionFilters());

      expect(result.current.filters).toEqual(DEFAULT_TRANSACTION_FILTERS);
      expect(result.current.hasActiveFilters).toBe(false);
    });

    it("successfully parses and applies valid query parameters from the URL", () => {
      const validParams = new URLSearchParams({
        period: "last-3-months",
        type: "expense",
        category: "housing",
      });
      vi.mocked(useSearchParams).mockReturnValue(
        validParams as unknown as ReturnType<typeof useSearchParams>
      );

      const { result } = renderHook(() => useTransactionFilters());

      expect(result.current.filters).toEqual({
        period: "last-3-months",
        type: "expense",
        category: "housing",
      });
      expect(result.current.hasActiveFilters).toBe(true);
    });

    it("falls back to default values when arbitrary or invalid query parameters are provided", () => {
      const forgedParams = new URLSearchParams({
        period: "next-year",
        type: "unauthorized_type",
        category: "unknown_category",
      });
      vi.mocked(useSearchParams).mockReturnValue(
        forgedParams as unknown as ReturnType<typeof useSearchParams>
      );

      const { result } = renderHook(() => useTransactionFilters());

      expect(result.current.filters).toEqual(DEFAULT_TRANSACTION_FILTERS);
      expect(result.current.hasActiveFilters).toBe(false);
    });

    it("handles partially valid parameters by applying defaults only to invalid ones", () => {
      const mixedParams = new URLSearchParams({
        period: "previous-month",
        type: "invalid_type",
        category: "food",
      });
      vi.mocked(useSearchParams).mockReturnValue(
        mixedParams as unknown as ReturnType<typeof useSearchParams>
      );

      const { result } = renderHook(() => useTransactionFilters());

      expect(result.current.filters).toEqual({
        period: "previous-month",
        type: "all",
        category: "food",
      });
      expect(result.current.hasActiveFilters).toBe(true);
    });
  });

  describe("Filter Mutations (setFilters)", () => {
    it("updates the URL when applying new non-default filters", () => {
      vi.mocked(useSearchParams).mockReturnValue(
        new URLSearchParams() as unknown as ReturnType<typeof useSearchParams>
      );

      const { result } = renderHook(() => useTransactionFilters());

      act(() => {
        result.current.setFilters({ type: "income", category: "salary" });
      });

      expect(mockPush).toHaveBeenCalledWith("/dashboard?type=income&category=salary", {
        scroll: false,
      });
    });

    it("removes parameters from the URL when reset back to default values", () => {
      const existingParams = new URLSearchParams({
        type: "income",
        category: "salary",
        period: "last-3-months",
      });
      vi.mocked(useSearchParams).mockReturnValue(
        existingParams as unknown as ReturnType<typeof useSearchParams>
      );

      const { result } = renderHook(() => useTransactionFilters());

      act(() => {
        result.current.setFilters({ type: "all" });
      });

      expect(mockPush).toHaveBeenCalledWith("/dashboard?category=salary&period=last-3-months", {
        scroll: false,
      });
    });

    it("navigates to base pathname without search query when all parameters match default values", () => {
      const existingParams = new URLSearchParams({
        type: "expense",
      });
      vi.mocked(useSearchParams).mockReturnValue(
        existingParams as unknown as ReturnType<typeof useSearchParams>
      );

      const { result } = renderHook(() => useTransactionFilters());

      act(() => {
        result.current.setFilters({ type: "all" });
      });

      expect(mockPush).toHaveBeenCalledWith("/dashboard", { scroll: false });
    });
  });

  describe("Filter Resetting (resetFilters)", () => {
    it("clears all search parameters and pushes the base pathname", () => {
      const existingParams = new URLSearchParams({
        period: "last-3-months",
        type: "expense",
        category: "food",
      });
      vi.mocked(useSearchParams).mockReturnValue(
        existingParams as unknown as ReturnType<typeof useSearchParams>
      );

      const { result } = renderHook(() => useTransactionFilters());

      act(() => {
        result.current.resetFilters();
      });

      expect(mockPush).toHaveBeenCalledWith("/dashboard", { scroll: false });
    });
  });
});
