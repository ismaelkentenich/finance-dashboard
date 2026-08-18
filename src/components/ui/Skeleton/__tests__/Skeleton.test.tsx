import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton } from "../Skeleton";

describe("Skeleton Component", () => {
  describe("DOM rendering and default properties", () => {
    it("renders into DOM with default data-testid and aria-hidden attribute", () => {
      render(<Skeleton />);

      const element = screen.getByTestId("skeleton");
      expect(element).toBeInTheDocument();
      expect(element).toHaveAttribute("aria-hidden", "true");
    });

    it("applies default width of 100% and default height of 1rem", () => {
      render(<Skeleton />);

      const element = screen.getByTestId("skeleton");
      expect(element).toHaveStyle({ width: "100%", height: "1rem" });
    });
  });

  describe("custom dimensions and test identifiers", () => {
    it("applies custom inline styles for width, height and borderRadius", () => {
      render(
        <Skeleton width="250px" height="40px" borderRadius="8px" data-testid="custom-skeleton" />
      );

      const element = screen.getByTestId("custom-skeleton");
      expect(element).toHaveStyle({
        width: "250px",
        height: "40px",
        borderRadius: "8px",
      });
    });

    it("appends extra CSS class names without overriding module class", () => {
      render(<Skeleton className="custom-utility-class" />);

      const element = screen.getByTestId("skeleton");
      expect(element.className).toContain("custom-utility-class");
    });
  });
});
