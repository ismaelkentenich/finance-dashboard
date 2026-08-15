import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PieChart } from "../PieChart";

const sampleCategoryData = [
  { name: "Housing", value: 2200, fill: "var(--color-primary-green-100)" },
  { name: "Food", value: 642.5, fill: "var(--color-blue-200)" },
];

describe("PieChart UI Component", () => {
  it("renders container with default data-testid", () => {
    render(<PieChart data={sampleCategoryData} />);

    expect(screen.getByTestId("ui-pie-chart")).toBeInTheDocument();
  });

  it("applies custom data-testid and custom className", () => {
    render(
      <PieChart
        data={sampleCategoryData}
        className="custom-pie-container"
        data-testid="custom-pie-chart"
      />
    );

    const chart = screen.getByTestId("custom-pie-chart");
    expect(chart).toBeInTheDocument();
    expect(chart.className).toContain("custom-pie-container");
  });
});
