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
  describe("content rendering", () => {
    it("renders the received title correctly", () => {
      render(<SummaryCard {...defaultProps} title="Saldo Atual" />);
      expect(screen.getByText("Saldo Atual")).toBeInTheDocument();
    });

    it("renders the received numeric/currency value correctly", () => {
      render(<SummaryCard {...defaultProps} value="R$ 5.000,00" />);
      expect(screen.getByTestId("summary-card-value")).toHaveTextContent("R$ 5.000,00");
    });

    it("renders the received footer text description", () => {
      render(<SummaryCard {...defaultProps} footerText="vs mês anterior" />);
      expect(screen.getByTestId("summary-card-footer-text")).toHaveTextContent("vs mês anterior");
    });

    it("renders the received icon element inside the wrapper", () => {
      render(<SummaryCard {...defaultProps} icon={<Wallet data-testid="mock-icon" />} />);
      expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
    });

    it("renders the badge component when badge prop is provided", () => {
      render(<SummaryCard {...defaultProps} badge={{ text: "+10%", variant: "success" }} />);

      const badge = screen.getByTestId("summary-card-badge");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent("+10%");
    });

    it("does not render the badge element when badge prop is omitted", () => {
      render(<SummaryCard {...defaultProps} badge={undefined} />);
      expect(screen.queryByTestId("summary-card-badge")).not.toBeInTheDocument();
    });
  });

  describe("icon styling variant assignments", () => {
    it("applies the corresponding CSS variant class on the icon wrapper for savings variant", () => {
      render(<SummaryCard {...defaultProps} iconVariant="savings" />);
      const iconWrapper = screen.getByTestId("summary-card-icon-wrapper");
      expect(iconWrapper.className).toMatch(/iconSavings/i);
    });

    it("applies the corresponding CSS variant class on the icon wrapper for balance variant", () => {
      render(<SummaryCard {...defaultProps} iconVariant="balance" />);
      const iconWrapper = screen.getByTestId("summary-card-icon-wrapper");
      expect(iconWrapper.className).toMatch(/iconBalance/i);
    });

    it("applies the corresponding CSS variant class on the icon wrapper for income variant", () => {
      render(<SummaryCard {...defaultProps} iconVariant="income" />);
      const iconWrapper = screen.getByTestId("summary-card-icon-wrapper");
      expect(iconWrapper.className).toMatch(/iconIncome/i);
    });

    it("applies the corresponding CSS variant class on the icon wrapper for expense variant", () => {
      render(<SummaryCard {...defaultProps} iconVariant="expense" />);
      const iconWrapper = screen.getByTestId("summary-card-icon-wrapper");
      expect(iconWrapper.className).toMatch(/iconExpense/i);
    });
  });
});
