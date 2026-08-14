import { ChevronDown } from "lucide-react";
import { useId } from "react";
import styles from "./Select.module.css";
import type { SelectProps } from "./Select.types";

export function Select({
  id,
  label,
  options,
  children,
  error,
  helperText,
  fullWidth = false,
  className = "",
  disabled,
  "data-testid": testId = "select",
  ...props
}: SelectProps) {
  const generatedId = useId();
  const selectId = id || generatedId;
  const errorId = `${selectId}-error`;
  const helperId = `${selectId}-helper`;

  const ariaDescribedBy = error ? errorId : helperText ? helperId : undefined;

  return (
    <div
      className={`${styles.container} ${fullWidth ? styles.fullWidth : ""} ${className}`.trim()}
      data-testid={`${testId}-container`}
    >
      {label && (
        <label htmlFor={selectId} className={styles.label} data-testid={`${testId}-label`}>
          {label}
        </label>
      )}

      <div className={styles.selectWrapper}>
        <select
          id={selectId}
          data-testid={testId}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={ariaDescribedBy}
          className={`${styles.select} ${error ? styles.selectError : ""}`}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>

        <ChevronDown size={16} className={styles.chevronIcon} aria-hidden="true" />
      </div>

      {error && (
        <span
          id={errorId}
          className={styles.errorMessage}
          role="alert"
          data-testid={`${testId}-error`}
        >
          {error}
        </span>
      )}

      {!error && helperText && (
        <span id={helperId} className={styles.helperText} data-testid={`${testId}-helper`}>
          {helperText}
        </span>
      )}
    </div>
  );
}
