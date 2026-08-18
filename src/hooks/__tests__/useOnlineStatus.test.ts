import { customRenderHook } from "@/test/utils";
import { act } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useOnlineStatus } from "../useOnlineStatus";

function setNavigatorOnlineStatus(value: boolean) {
  Object.defineProperty(navigator, "onLine", {
    configurable: true,
    value,
  });
}

describe("useOnlineStatus", () => {
  it("returns true when navigator reports an online connection", () => {
    setNavigatorOnlineStatus(true);

    const { result } = customRenderHook(() => useOnlineStatus());

    expect(result.current).toBe(true);
  });

  it("returns false when navigator reports an offline connection", () => {
    setNavigatorOnlineStatus(false);

    const { result } = customRenderHook(() => useOnlineStatus());

    expect(result.current).toBe(false);
  });

  it("updates when browser emits offline event", () => {
    setNavigatorOnlineStatus(true);

    const { result } = customRenderHook(() => useOnlineStatus());

    expect(result.current).toBe(true);

    act(() => {
      setNavigatorOnlineStatus(false);
      window.dispatchEvent(new Event("offline"));
    });

    expect(result.current).toBe(false);
  });

  it("updates when browser emits online event", () => {
    setNavigatorOnlineStatus(false);

    const { result } = customRenderHook(() => useOnlineStatus());

    expect(result.current).toBe(false);

    act(() => {
      setNavigatorOnlineStatus(true);
      window.dispatchEvent(new Event("online"));
    });

    expect(result.current).toBe(true);
  });
});
