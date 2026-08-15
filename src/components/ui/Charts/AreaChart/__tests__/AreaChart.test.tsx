import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AreaChart } from "../AreaChart";

const sampleData = [
  { label: "Day 1", balance: 5000 },
  { label: "Day 2", balance: 7200 },
];

describe("AreaChart UI Component", () => {
  it("renders container with default data-testid", () => {
    render(<AreaChart data={sampleData} series={[{ dataKey: "balance", name: "Saldo" }]} />);

    expect(screen.getByTestId("ui-area-chart")).toBeInTheDocument();
  });

  it("applies custom data-testid and custom className", () => {
    render(
      <AreaChart
        data={sampleData}
        series={[{ dataKey: "balance" }]}
        className="custom-area-class"
        data-testid="custom-area-chart"
      />
    );

    const chart = screen.getByTestId("custom-area-chart");
    expect(chart).toBeInTheDocument();
    expect(chart.className).toContain("custom-area-class");
  });
});
