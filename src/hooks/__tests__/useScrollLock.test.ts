import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useScrollLock } from "../useScrollLock";

describe("useScrollLock custom hook", () => {
  beforeEach(() => {
    document.body.style.overflow = "unset";
  });

  afterEach(() => {
    document.body.style.overflow = "unset";
  });

  it("does not modify body overflow style when isLocked is false", () => {
    renderHook(() => useScrollLock(false));
    expect(document.body.style.overflow).toBe("unset");
  });

  it("sets body overflow to hidden when isLocked is true", () => {
    renderHook(() => useScrollLock(true));
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores initial overflow style when isLocked toggles back to false", () => {
    document.body.style.overflow = "auto";

    const { rerender } = renderHook(({ isLocked }) => useScrollLock(isLocked), {
      initialProps: { isLocked: true },
    });

    expect(document.body.style.overflow).toBe("hidden");

    rerender({ isLocked: false });
    expect(document.body.style.overflow).toBe("auto");
  });

  it("restores original body overflow style when unmounted", () => {
    const { unmount } = renderHook(() => useScrollLock(true));
    expect(document.body.style.overflow).toBe("hidden");

    unmount();
    expect(document.body.style.overflow).toBe("unset");
  });
});
