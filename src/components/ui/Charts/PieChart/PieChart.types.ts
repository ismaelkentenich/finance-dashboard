export interface PieChartProps {
  data: { name: string; value: number; fill?: string }[];
  dataKey?: string;
  nameKey?: string;
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
  isAnimationActive?: boolean;
  valueFormatter?: (value: unknown) => string;
  className?: string;
  "data-testid"?: string;
}
