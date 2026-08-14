import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProgressBar } from "../ProgressBar";

describe("ProgressBar UI Component", () => {
  describe("accessibility attributes and semantic role", () => {
    it("renders with semantic progressbar role and default aria values", () => {
      render(<ProgressBar value={45} label="Expense Share" />);

      const progressBar = screen.getByRole("progressbar");
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveAttribute("aria-valuenow", "45");
      expect(progressBar).toHaveAttribute("aria-valuemin", "0");
      expect(progressBar).toHaveAttribute("aria-valuemax", "100");
      expect(progressBar).toHaveAttribute("aria-label", "Expense Share");
    });

    it("generates percentage aria-label when explicit label is omitted", () => {
      render(<ProgressBar value={75} />);

      const progressBar = screen.getByRole("progressbar");
      expect(progressBar).toHaveAttribute("aria-label", "75.0%");
    });
  });

  describe("progress calculations and value clamping", () => {
    it("applies matching inline width percentage on the inner fill element", () => {
      render(<ProgressBar value={60} />);

      const fill = screen.getByTestId("progress-bar-fill");
      expect(fill).toHaveStyle({ width: "60%" });
    });

    it("clamps values greater than maximum to 100%", () => {
      render(<ProgressBar value={120} max={100} />);

      const fill = screen.getByTestId("progress-bar-fill");
      expect(fill).toHaveStyle({ width: "100%" });
    });

    it("clamps values lower than minimum to 0%", () => {
      render(<ProgressBar value={-15} min={0} />);

      const fill = screen.getByTestId("progress-bar-fill");
      expect(fill).toHaveStyle({ width: "0%" });
    });
  });

  describe("styling and variants", () => {
    it("applies the requested color variant CSS class", () => {
      render(<ProgressBar value={50} variant="danger" />);

      const fill = screen.getByTestId("progress-bar-fill");
      expect(fill.className).toMatch(/variantDanger/i);
    });

    it("supports custom data-testid attributes", () => {
      render(<ProgressBar value={30} data-testid="custom-progress" />);

      expect(screen.getByTestId("custom-progress")).toBeInTheDocument();
      expect(screen.getByTestId("custom-progress-fill")).toBeInTheDocument();
    });
  });
});
