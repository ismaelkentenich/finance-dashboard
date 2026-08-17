"use client";

import { CHART_ANIMATION_DURATION, CHART_ANIMATION_EASING } from "@/motion";
import { useReducedMotion } from "framer-motion";
import {
  Bar,
  CartesianGrid,
  Legend,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { BarChartProps } from "./BarChart.types";

export function BarChart<T extends Record<string, unknown>>({
  data,
  series,
  xAxisKey = "label",
  layout = "horizontal",
  showGrid = true,
  isAnimationActive,
  valueFormatter,
  className = "",
  "data-testid": testId = "ui-bar-chart",
}: BarChartProps<T>) {
  const isVertical = layout === "vertical";
  const shouldReduceMotion = useReducedMotion();
  const enableAnimation = isAnimationActive !== undefined ? isAnimationActive : !shouldReduceMotion;

  return (
    <div data-testid={testId} className={className} style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} layout={layout}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />}

          {isVertical ? (
            <>
              <XAxis
                type="number"
                tickFormatter={valueFormatter}
                stroke="var(--color-neutral-500)"
                fontSize={12}
              />
              <YAxis
                type="category"
                dataKey={xAxisKey}
                width={100}
                stroke="var(--color-neutral-500)"
                fontSize={12}
              />
            </>
          ) : (
            <>
              <XAxis dataKey={xAxisKey} stroke="var(--color-neutral-500)" fontSize={12} />
              <YAxis
                stroke="var(--color-neutral-500)"
                fontSize={12}
                tickFormatter={valueFormatter}
              />
            </>
          )}

          <Tooltip formatter={valueFormatter} />
          {series.length > 1 && <Legend />}

          {series.map((item) => (
            <Bar
              key={item.dataKey}
              dataKey={item.dataKey}
              name={item.name || item.dataKey}
              fill={item.color || "var(--color-primary-green-100)"}
              radius={item.radius || (isVertical ? [0, 4, 4, 0] : [4, 4, 0, 0])}
              isAnimationActive={enableAnimation}
              animationDuration={CHART_ANIMATION_DURATION}
              animationEasing={CHART_ANIMATION_EASING}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
