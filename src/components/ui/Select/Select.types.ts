import type { SelectHTMLAttributes } from "react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  options?: SelectOption[];
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  "data-testid"?: string;
}
