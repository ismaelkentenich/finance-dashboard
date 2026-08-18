import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ErrorBanner } from "../ErrorBanner";

describe("ErrorBanner UI Component", () => {
  describe("rendering and accessibility roles", () => {
    it("renders with alert role and assertive aria-live announcement", () => {
      render(<ErrorBanner message="Failed to reach server" />);

      const alert = screen.getByRole("alert");
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveAttribute("aria-live", "assertive");
      expect(screen.getByText("Failed to reach server")).toBeInTheDocument();
    });

    it("renders optional title element when provided", () => {
      render(<ErrorBanner title="Connection Error" message="Timeout occurred" />);

      expect(screen.getByTestId("error-banner-title")).toHaveTextContent("Connection Error");
      expect(screen.getByTestId("error-banner-message")).toHaveTextContent("Timeout occurred");
    });
  });

  describe("retry callback and user actions", () => {
    it("triggers onRetry callback when clicking retry button", () => {
      const handleRetry = vi.fn();
      render(<ErrorBanner message="Fetch failure" onRetry={handleRetry} retryLabel="Try Again" />);

      const retryButton = screen.getByRole("button", { name: /try again/i });
      fireEvent.click(retryButton);

      expect(handleRetry).toHaveBeenCalledTimes(1);
    });

    it("renders custom action children when supplied", () => {
      render(
        <ErrorBanner message="Custom action test">
          <button type="button">Custom Support Link</button>
        </ErrorBanner>
      );

      expect(screen.getByRole("button", { name: "Custom Support Link" })).toBeInTheDocument();
    });
  });
});
