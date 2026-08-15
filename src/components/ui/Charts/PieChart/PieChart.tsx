"use client";

import { Legend, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { PieChartProps } from "./PieChart.types";

export function PieChart({
  data,
  dataKey = "value",
  nameKey = "name",
  innerRadius = 60,
  outerRadius = 100,
  showLegend = true,
  valueFormatter,
  className = "",
  "data-testid": testId = "ui-pie-chart",
}: PieChartProps) {
  return (
    <div data-testid={testId} className={className} style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Tooltip formatter={valueFormatter} />
          {showLegend && <Legend />}
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={4}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
