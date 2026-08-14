import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card, CardHeader, CardTitle } from "../Card";

describe("Card Component Family", () => {
  describe("Card (Root Container)", () => {
    it("renders children content inside the default container test ID", () => {
      render(
        <Card>
          <p>Card body content</p>
        </Card>
      );

      const container = screen.getByTestId("card-container");
      expect(container).toBeInTheDocument();
      expect(screen.getByText("Card body content")).toBeInTheDocument();
    });

    it("applies custom data-testid when provided via props", () => {
      render(<Card data-testid="custom-card">Custom ID Card</Card>);

      expect(screen.getByTestId("custom-card")).toBeInTheDocument();
      expect(screen.queryByTestId("card-container")).not.toBeInTheDocument();
    });

    it("combines scoped CSS module class with extra custom className", () => {
      render(<Card className="custom-elevation-class">Elevated Card</Card>);

      const container = screen.getByTestId("card-container");
      expect(container.className).toContain("custom-elevation-class");
      expect(container.className).toMatch(/card/i);
    });

    it("forwards native HTML div attributes such as aria-label and role", () => {
      render(
        <Card role="region" aria-label="Financial Summary">
          <span>Card Content</span>
        </Card>
      );

      const container = screen.getByTestId("card-container");
      expect(container).toHaveAttribute("role", "region");
      expect(container).toHaveAttribute("aria-label", "Financial Summary");
    });
  });

  describe("CardHeader", () => {
    it("renders child elements inside the default header test ID", () => {
      render(
        <CardHeader>
          <span>Header Label</span>
        </CardHeader>
      );

      const header = screen.getByTestId("card-header");
      expect(header).toBeInTheDocument();
      expect(screen.getByText("Header Label")).toBeInTheDocument();
    });

    it("overrides default test ID when data-testid is explicitly supplied", () => {
      render(
        <CardHeader data-testid="custom-header">
          <span>Custom Header</span>
        </CardHeader>
      );

      expect(screen.getByTestId("custom-header")).toBeInTheDocument();
      expect(screen.queryByTestId("card-header")).not.toBeInTheDocument();
    });

    it("appends extra CSS class names alongside the module class", () => {
      render(
        <CardHeader className="custom-header-class">
          <span>Styled Header</span>
        </CardHeader>
      );

      const header = screen.getByTestId("card-header");
      expect(header.className).toContain("custom-header-class");
      expect(header.className).toMatch(/cardHeader/i);
    });
  });

  describe("CardTitle", () => {
    it("renders text content inside a semantic level 3 heading element", () => {
      render(<CardTitle>Total Balance</CardTitle>);

      const heading = screen.getByRole("heading", { level: 3, name: "Total Balance" });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveAttribute("data-testid", "card-title");
    });

    it("renders custom data-testid on the heading element", () => {
      render(<CardTitle data-testid="summary-card-title">Income</CardTitle>);

      expect(screen.getByTestId("summary-card-title")).toBeInTheDocument();
      expect(screen.queryByTestId("card-title")).not.toBeInTheDocument();
    });

    it("appends custom class names while preserving scoped title styling", () => {
      render(<CardTitle className="custom-title-class">Expenses</CardTitle>);

      const title = screen.getByTestId("card-title");
      expect(title.className).toContain("custom-title-class");
      expect(title.className).toMatch(/cardTitle/i);
    });
  });

  describe("Integrated Card Composition", () => {
    it("renders complete card structure combining Header, Title and Body content", () => {
      render(
        <Card data-testid="overview-card">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <div>List of recent activity transactions</div>
        </Card>
      );

      const card = screen.getByTestId("overview-card");
      const title = screen.getByRole("heading", { level: 3, name: "Recent Activity" });

      expect(card).toContainElement(title);
      expect(screen.getByText("List of recent activity transactions")).toBeInTheDocument();
    });
  });
});
