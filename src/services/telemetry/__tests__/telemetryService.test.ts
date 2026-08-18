import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { telemetryService } from "../telemetryService";

describe("TelemetryService Unit Tests", () => {
  beforeEach(() => {
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs standard info messages with timestamp and context", () => {
    telemetryService.log("info", "User accessed dashboard", { userId: "user-123" });

    expect(console.info).toHaveBeenCalledWith(
      "[TELEMETRY:INFO]",
      expect.objectContaining({
        level: "info",
        message: "User accessed dashboard",
        context: { userId: "user-123" },
      })
    );
  });

  it("logs warning messages appropriately", () => {
    telemetryService.log("warn", "Cache nearing capacity");

    expect(console.warn).toHaveBeenCalledWith(
      "[TELEMETRY:WARN]",
      expect.objectContaining({
        level: "warn",
        message: "Cache nearing capacity",
      })
    );
  });

  it("logs error instances with structured stack and metadata", () => {
    const testError = new Error("Database timeout");
    telemetryService.logError(testError, { operation: "fetchTransactions" });

    expect(console.error).toHaveBeenCalledWith(
      "[TELEMETRY:ERROR]",
      expect.objectContaining({
        level: "error",
        message: "Database timeout",
        context: expect.objectContaining({
          name: "Error",
          operation: "fetchTransactions",
        }),
      })
    );
  });

  it("records Web Vitals metrics formatting values correctly", () => {
    telemetryService.recordMetric({
      name: "FCP",
      value: 1240.45,
      rating: "good",
      id: "v1-12345",
    });

    expect(console.info).toHaveBeenCalledWith(
      "[WEB-VITAL] FCP:",
      expect.objectContaining({
        value: 1240,
        rating: "good",
        id: "v1-12345",
      })
    );
  });
});
