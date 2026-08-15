import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BarChart } from "../../BarChart";

const sampleData = [
  { label: "Aug 05", income: 8500, expense: 2200 },
  { label: "Aug 06", income: 1800, expense: 642.5 },
];

describe("BarChart UI Component", () => {
  describe("DOM rendering and structure", () => {
    it("renders root container with default test identifier", () => {
      render(
        <BarChart data={sampleData} series={[{ dataKey: "income" }, { dataKey: "expense" }]} />
      );

      expect(screen.getByTestId("ui-bar-chart")).toBeInTheDocument();
    });

    it("propagates custom data-testid and custom className", () => {
      render(
        <BarChart
          data={sampleData}
          series={[{ dataKey: "income" }]}
          className="custom-bar-wrapper"
          data-testid="custom-bar-chart"
        />
      );

      const container = screen.getByTestId("custom-bar-chart");
      expect(container).toBeInTheDocument();
      expect(container.className).toContain("custom-bar-wrapper");
    });
  });

  describe("horizontal and vertical layouts", () => {
    it("renders horizontal bar layout by default", () => {
      const { container } = render(<BarChart data={sampleData} series={[{ dataKey: "income" }]} />);

      expect(container.querySelector(".recharts-responsive-container")).toBeInTheDocument();
    });

    it("renders vertical bar layout when layout is set to vertical", () => {
      const { container } = render(
        <BarChart
          data={sampleData}
          layout="vertical"
          xAxisKey="label"
          series={[{ dataKey: "income" }]}
        />
      );

      expect(container.querySelector(".recharts-responsive-container")).toBeInTheDocument();
    });
  });
});
