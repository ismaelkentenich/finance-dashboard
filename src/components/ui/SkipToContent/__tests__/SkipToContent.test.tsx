import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { SkipToContent } from "../SkipToContent";

describe("SkipToContent UI Component", () => {
  describe("DOM rendering and default properties", () => {
    it("renders into DOM with default target ID anchor and default label", () => {
      render(<SkipToContent />);

      const link = screen.getByRole("link", {
        name: "Pular para o conteúdo principal",
      });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "#main-content");
      expect(link).toHaveAttribute("data-testid", "skip-to-content");
    });

    it("has zero automated accessibility violations according to axe-core", async () => {
      const { container } = render(
        <div>
          <SkipToContent targetId="main-area" />
          <main id="main-area">Conteúdo Principal</main>
        </div>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("custom properties and styling", () => {
    it("applies custom targetId and custom label text", () => {
      render(<SkipToContent targetId="dashboard-grid" label="Skip to dashboard content" />);

      const link = screen.getByRole("link", {
        name: "Skip to dashboard content",
      });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "#dashboard-grid");
    });

    it("combines scoped CSS module class with custom utility className", () => {
      render(<SkipToContent className="custom-focus-override" />);

      const link = screen.getByTestId("skip-to-content");
      expect(link.className).toContain("custom-focus-override");
      expect(link.className).toMatch(/skipLink/i);
    });
  });
});
