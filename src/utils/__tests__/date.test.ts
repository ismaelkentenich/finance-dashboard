import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getLocalDateISOString } from "../date";

describe("getLocalDateISOString Helper", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the date in YYYY-MM-DD format with proper padding", () => {
    const mockDate = new Date(2026, 0, 5); // January 5, 2026 - local
    expect(getLocalDateISOString(mockDate)).toBe("2026-01-05");
  });

  it("ensures the correct local date when UTC has already rolled over to the next day", () => {
    // August 17, 2026, 22:30 in UTC-3 timezone (01:30 UTC on August 18, 2026)
    const localLateNight = new Date("2026-08-18T01:30:00.000Z");
    vi.setSystemTime(localLateNight);

    const result = getLocalDateISOString();

    const expectedLocal = `${localLateNight.getFullYear()}-${String(
      localLateNight.getMonth() + 1
    ).padStart(2, "0")}-${String(localLateNight.getDate()).padStart(2, "0")}`;

    expect(result).toBe(expectedLocal);
  });
});
