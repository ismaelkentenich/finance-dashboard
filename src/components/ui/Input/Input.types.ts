import type { InputHTMLAttributes, ReactNode } from "react";

export type InputVariant = "filled" | "outline" | "ghost";
export type InputSize = "sm" | "md" | "lg";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  variant?: InputVariant;
  size?: InputSize;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onClear?: () => void;
  clearButtonAriaLabel?: string;
  "data-testid"?: string;
}
