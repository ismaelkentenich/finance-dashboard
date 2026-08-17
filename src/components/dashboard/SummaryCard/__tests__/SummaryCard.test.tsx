import { render, screen } from "@testing-library/react";
import { Wallet } from "lucide-react";
import { describe, expect, it } from "vitest";
import { SummaryCard } from "../SummaryCard";

const defaultProps = {
  title: "Saldo Atual",
  value: "R$ 5.000,00",
  icon: <Wallet data-testid="mock-icon" />,
  iconVariant: "balance" as const,
  footerText: "vs mês anterior",
};

describe("SummaryCard Component", () => {
  describe("content rendering & typography hierarchy", () => {
    it("renders the received title correctly with semantic title styles", () => {
      render(<SummaryCard {...defaultProps} title="Saldo Atual" />);
      const titleElement = screen.getByRole("heading", { level: 3, name: "Saldo Atual" });
      expect(titleElement).toBeInTheDocument();
      expect(titleElement.className).toMatch(/title/i);
    });

    it("renders the KPI value with prominent styling and truncation safeguards", () => {
      render(<SummaryCard {...defaultProps} value="R$ 1.250.000,00" />);
      const valueContainer = screen.getByTestId("summary-card-value");
      expect(valueContainer).toHaveTextContent("R$ 1.250.000,00");
      expect(valueContainer.className).toMatch(/value/i);
    });

    it("renders animated number with accessibility wrapper when numericValue and formatter are passed", () => {
      render(
        <SummaryCard
          {...defaultProps}
          numericValue={5000}
          formatter={(val) => `R$ ${val.toFixed(2)}`}
        />
      );

      const valueContainer = screen.getByTestId("summary-card-value");
      expect(valueContainer).toHaveAttribute("aria-label", "R$ 5000.00");
      expect(valueContainer).toHaveTextContent("R$ 5000.00");
    });

    it("renders footer text description alongside badge inside footer container", () => {
      render(
        <SummaryCard
          {...defaultProps}
          badge={{ text: "+12.5%", variant: "success" }}
          footerText="vs mês anterior"
        />
      );
      expect(screen.getByTestId("summary-card-badge")).toHaveTextContent("+12.5%");
      expect(screen.getByTestId("summary-card-footer-text")).toHaveTextContent("vs mês anterior");
    });
  });
});
