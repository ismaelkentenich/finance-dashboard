import { LocaleProvider } from "@/contexts/LocaleContext";
import { telemetryService } from "@/services/telemetry";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import DashboardErrorBoundary from "../error";

describe("DashboardErrorBoundary Component", () => {
  beforeEach(() => {
    vi.spyOn(telemetryService, "logError").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs the error to telemetry upon mounting", () => {
    const error = new Error("ChunkLoadError") as Error & { digest?: string };
    error.digest = "digest-123";

    render(
      <LocaleProvider>
        <DashboardErrorBoundary error={error} reset={vi.fn()} />
      </LocaleProvider>
    );

    expect(telemetryService.logError).toHaveBeenCalledWith(error, {
      boundary: "DashboardErrorBoundary",
      digest: "digest-123",
    });
  });

  it("triggers the reset callback when clicking the reload button", async () => {
    const user = userEvent.setup();
    const handleReset = vi.fn();
    const error = new Error("Render Failed");

    render(
      <LocaleProvider>
        <DashboardErrorBoundary error={error} reset={handleReset} />
      </LocaleProvider>
    );

    await user.click(screen.getByTestId("error-reset-button"));
    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});
