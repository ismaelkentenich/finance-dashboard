export interface BarSeriesConfig {
  dataKey: string;
  name?: string;
  color?: string;
  radius?: [number, number, number, number];
}

export interface BarChartProps<T extends Record<string, unknown> = Record<string, unknown>> {
  data: T[];
  series: BarSeriesConfig[];
  xAxisKey?: string;
  layout?: "horizontal" | "vertical";
  showGrid?: boolean;
  isAnimationActive?: boolean;
  valueFormatter?: (value: unknown) => string;
  className?: string;
  "data-testid"?: string;
}
