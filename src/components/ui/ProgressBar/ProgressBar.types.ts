export type ProgressBarVariant = "primary" | "secondary" | "success" | "danger" | "info";

export interface ProgressBarProps {
  value: number;
  max?: number;
  min?: number;
  label?: string;
  variant?: ProgressBarVariant;
  delay?: number;
  className?: string;
  "data-testid"?: string;
}
