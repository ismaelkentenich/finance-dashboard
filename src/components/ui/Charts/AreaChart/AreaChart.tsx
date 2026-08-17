"use client";

import { CHART_ANIMATION_DURATION, CHART_ANIMATION_EASING } from "@/motion";
import { useReducedMotion } from "framer-motion";
import { useId } from "react";
import {
  Area,
  CartesianGrid,
  Legend,
  AreaChart as RechartsAreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_HEIGHT } from "../Charts.constants";
import type { AreaChartProps } from "./AreaChart.types";

export function AreaChart<T extends Record<string, unknown>>({
  data,
  series,
  xAxisKey = "label",
  showGrid = true,
  isAnimationActive,
  valueFormatter,
  className = "",
  "data-testid": testId = "ui-area-chart",
}: AreaChartProps<T>) {
  const gradientPrefix = useId().replace(/:/g, "");
  const shouldReduceMotion = useReducedMotion();
  const enableAnimation = isAnimationActive !== undefined ? isAnimationActive : !shouldReduceMotion;

  return (
    <div data-testid={testId} className={className} style={{ width: "100%", height: CHART_HEIGHT }}>
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <RechartsAreaChart data={data}>
          <defs>
            {series.map((item, index) => {
              const gradId = `${gradientPrefix}-grad-${index}`;
              const color = item.color || "var(--color-primary-green-100)";
              return (
                <linearGradient key={gradId} id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.0} />
                </linearGradient>
              );
            })}
          </defs>

          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />}

          <XAxis dataKey={xAxisKey} stroke="var(--color-neutral-500)" fontSize={12} />
          <YAxis stroke="var(--color-neutral-500)" fontSize={12} tickFormatter={valueFormatter} />
          <Tooltip formatter={valueFormatter} />
          {series.length > 1 && <Legend />}

          {series.map((item, index) => {
            const gradId = `${gradientPrefix}-grad-${index}`;
            const color = item.color || "var(--color-primary-green-100)";
            return (
              <Area
                key={item.dataKey}
                type="monotone"
                dataKey={item.dataKey}
                name={item.name || item.dataKey}
                stroke={color}
                fill={`url(#${gradId})`}
                strokeWidth={2}
                isAnimationActive={enableAnimation}
                animationDuration={CHART_ANIMATION_DURATION}
                animationEasing={CHART_ANIMATION_EASING}
              />
            );
          })}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}
