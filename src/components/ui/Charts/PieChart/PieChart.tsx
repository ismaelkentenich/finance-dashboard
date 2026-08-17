"use client";

import { CHART_ANIMATION_DURATION, CHART_ANIMATION_EASING } from "@/motion";
import { useReducedMotion } from "framer-motion";
import { Legend, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { PieChartProps } from "./PieChart.types";

export function PieChart({
  data,
  dataKey = "value",
  nameKey = "name",
  innerRadius = 60,
  outerRadius = 100,
  showLegend = true,
  isAnimationActive,
  valueFormatter,
  className = "",
  "data-testid": testId = "ui-pie-chart",
}: PieChartProps) {
  const shouldReduceMotion = useReducedMotion();
  const enableAnimation = isAnimationActive !== undefined ? isAnimationActive : !shouldReduceMotion;

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
            isAnimationActive={enableAnimation}
            animationDuration={CHART_ANIMATION_DURATION}
            animationEasing={CHART_ANIMATION_EASING}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
