export interface AreaSeriesConfig {
  dataKey: string;
  name?: string;
  color?: string;
}

export interface AreaChartProps<T extends Record<string, unknown> = Record<string, unknown>> {
  data: T[];
  series: AreaSeriesConfig[];
  xAxisKey?: string;
  showGrid?: boolean;
  valueFormatter?: (value: unknown) => string;
  className?: string;
  "data-testid"?: string;
}
