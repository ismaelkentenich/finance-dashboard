import { render, screen } from "@testing-library/react";
import { Wallet } from "lucide-react";
import { describe, expect, it } from "vitest";
import { SummaryCard } from "../SummaryCard";

describe("SummaryCard Component", () => {
  describe("content rendering", () => {
    it("renders the received title, value, and footer text", () => {
      render(
        <SummaryCard
          title="Current Balance"
          value="R$ 5.000,00"
          icon={Wallet}
          iconVariant="balance"
          footerText="vs previous month"
        />
      );

      expect(screen.getByText("Current Balance")).toBeInTheDocument();
      expect(screen.getByTestId("summary-card-value")).toHaveTextContent("R$ 5.000,00");
      expect(screen.getByTestId("summary-card-footer-text")).toHaveTextContent("vs previous month");
    });

    it("renders the badge component when badge prop is provided", () => {
      render(
        <SummaryCard
          title="Total Income"
          value="R$ 8.000,00"
          icon={Wallet}
          iconVariant="income"
          badge={{ text: "+12.5%", variant: "success" }}
          footerText="vs previous month"
        />
      );

      const badge = screen.getByTestId("summary-card-badge");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent("+12.5%");
    });

    it("does not render the badge element when badge prop is omitted", () => {
      render(
        <SummaryCard
          title="Savings Rate"
          value="68%"
          icon={Wallet}
          iconVariant="savings"
          footerText="Of total monthly income"
        />
      );

      expect(screen.queryByTestId("summary-card-badge")).not.toBeInTheDocument();
    });
  });

  describe("icon styling variant assignments", () => {
    it("applies the corresponding CSS variant class on the icon wrapper", () => {
      render(
        <SummaryCard
          title="Total Expenses"
          value="R$ 2.500,00"
          icon={Wallet}
          iconVariant="expense"
          footerText="vs previous month"
        />
      );

      const iconWrapper = screen.getByTestId("summary-card-icon-wrapper");
      expect(iconWrapper.className).toMatch(/iconExpense/i);
    });
  });
});
