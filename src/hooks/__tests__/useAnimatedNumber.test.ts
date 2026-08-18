import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("useAnimatedNumber Hook", () => {
  it("initializes with formatted initial numeric value", () => {
    const { result } = renderHook(() =>
      useAnimatedNumber(5000, {
        formatter: (val) => `R$ ${val.toFixed(2)}`,
      })
    );

    expect(result.current.displayValue).toBe("R$ 5000.00");
    expect(result.current.rawValue).toBe(5000);
  });

  it("handles negative values correctly with custom formatter", () => {
    const { result } = renderHook(() =>
      useAnimatedNumber(-450.5, {
        formatter: (val) => `${val.toFixed(1)}%`,
      })
    );

    expect(result.current.displayValue).toBe("-450.5%");
    expect(result.current.rawValue).toBe(-450.5);
  });

  it("applies default fallback formatter when none is supplied", () => {
    const { result } = renderHook(() => useAnimatedNumber(125));

    expect(result.current.displayValue).toBe("125");
    expect(result.current.rawValue).toBe(125);
  });
});
