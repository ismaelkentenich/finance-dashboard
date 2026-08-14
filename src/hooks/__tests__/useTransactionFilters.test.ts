import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTransactionFilters } from "../useTransactionFilters";

const mockPush = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => "/dashboard",
  useSearchParams: () => mockSearchParams,
}));

describe("useTransactionFilters Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
  });

  describe("Initial state parsing and fallbacks", () => {
    it("returns default filters and hasActiveFilters as false when URL is empty", () => {
      const { result } = renderHook(() => useTransactionFilters());

      expect(result.current.filters).toEqual({
        period: "current-month",
        type: "all",
        category: "all",
      });
      expect(result.current.hasActiveFilters).toBe(false);
    });

    it("parses valid parameters from URLSearchParams correctly", () => {
      mockSearchParams = new URLSearchParams("period=previous-month&type=expense&category=food");

      const { result } = renderHook(() => useTransactionFilters());

      expect(result.current.filters).toEqual({
        period: "previous-month",
        type: "expense",
        category: "food",
      });
      expect(result.current.hasActiveFilters).toBe(true);
    });

    it("falls back to default values when query params contain invalid inputs", () => {
      mockSearchParams = new URLSearchParams("period=invalid-period&type=invalid-type");

      const { result } = renderHook(() => useTransactionFilters());

      expect(result.current.filters.period).toBe("current-month");
      expect(result.current.filters.type).toBe("all");
    });
  });

  describe("setFilters operations and URL formatting", () => {
    it("pushes updated query string when changing period filter", () => {
      const { result } = renderHook(() => useTransactionFilters());

      act(() => {
        result.current.setFilters({ period: "last-3-months" });
      });

      expect(mockPush).toHaveBeenCalledWith("/dashboard?period=last-3-months", {
        scroll: false,
      });
    });

    it("combines multiple parameters into the URL and deletes defaults", () => {
      mockSearchParams = new URLSearchParams("period=previous-month");
      const { result } = renderHook(() => useTransactionFilters());

      act(() => {
        result.current.setFilters({
          type: "income",
          category: "salary",
        });
      });

      expect(mockPush).toHaveBeenCalledWith(
        "/dashboard?period=previous-month&type=income&category=salary",
        { scroll: false }
      );
    });

    it("removes parameter from URL when resetting a specific filter to default value", () => {
      mockSearchParams = new URLSearchParams("period=previous-month&type=expense");
      const { result } = renderHook(() => useTransactionFilters());

      act(() => {
        result.current.setFilters({ period: "current-month" });
      });

      expect(mockPush).toHaveBeenCalledWith("/dashboard?type=expense", {
        scroll: false,
      });
    });
  });

  describe("resetFilters operation", () => {
    it("navigates directly to the base pathname without query string", () => {
      mockSearchParams = new URLSearchParams("period=previous-month&type=expense");
      const { result } = renderHook(() => useTransactionFilters());

      act(() => {
        result.current.resetFilters();
      });

      expect(mockPush).toHaveBeenCalledWith("/dashboard", { scroll: false });
    });
  });
});
