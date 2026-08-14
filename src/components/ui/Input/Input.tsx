import { forwardRef, useId } from "react";
import styles from "./Input.module.css";
import type { InputProps } from "./Input.types";

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    id,
    label,
    error,
    helperText,
    fullWidth = false,
    className = "",
    disabled,
    "data-testid": testId = "input",
    ...props
  },
  ref
) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const ariaDescribedBy = error ? errorId : helperText ? helperId : undefined;

  return (
    <div
      className={`${styles.container} ${fullWidth ? styles.fullWidth : ""} ${className}`.trim()}
      data-testid={`${testId}-container`}
    >
      {label && (
        <label htmlFor={inputId} className={styles.label} data-testid={`${testId}-label`}>
          {label}
        </label>
      )}

      <input
        ref={ref}
        id={inputId}
        data-testid={testId}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={ariaDescribedBy}
        className={`${styles.input} ${error ? styles.inputError : ""}`}
        {...props}
      />

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
});
