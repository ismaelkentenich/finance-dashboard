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

  it("triggers the reset callback and applies semantic animation class on icon", async () => {
    const user = userEvent.setup();
    const handleReset = vi.fn();
    const error = new Error("Render Failed");

    render(
      <LocaleProvider>
        <DashboardErrorBoundary error={error} reset={handleReset} />
      </LocaleProvider>
    );

    const button = screen.getByTestId("error-reset-button");
    const icon = screen.getByTestId("error-reset-icon");

    expect(icon.getAttribute("class") || "").not.toMatch(/spinIcon/);

    await user.click(button);

    expect(handleReset).toHaveBeenCalledTimes(1);
    expect(icon.getAttribute("class") || "").toMatch(/spinIcon/);
  });
});
