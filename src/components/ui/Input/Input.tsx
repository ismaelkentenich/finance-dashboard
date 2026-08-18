import { X } from "lucide-react";
import { forwardRef, useId } from "react";
import styles from "./Input.module.css";
import type { InputProps, InputSize, InputVariant } from "./Input.types";

const VARIANT_MAP: Record<InputVariant, string> = {
  filled: styles.variantFilled,
  outline: styles.variantOutline,
  ghost: styles.variantGhost,
};

const SIZE_MAP: Record<InputSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    id,
    label,
    variant = "filled",
    size = "md",
    error,
    helperText,
    fullWidth = false,
    startIcon,
    endIcon,
    onClear,
    clearButtonAriaLabel = "Limpar campo",
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
  const hasEndElement = Boolean(endIcon || onClear);

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

      <div className={styles.inputWrapper}>
        {startIcon && (
          <div
            className={styles.startIconWrapper}
            aria-hidden="true"
            data-testid={`${testId}-start-icon`}
          >
            {startIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          data-testid={testId}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={ariaDescribedBy}
          className={`${styles.input} ${VARIANT_MAP[variant]} ${SIZE_MAP[size]} ${
            startIcon ? styles.hasStartIcon : ""
          } ${hasEndElement ? styles.hasEndElement : ""} ${error ? styles.inputError : ""}`.trim()}
          {...props}
        />

        {hasEndElement && (
          <div className={styles.endIconWrapper}>
            {onClear ? (
              <button
                type="button"
                className={styles.clearButton}
                onClick={onClear}
                aria-label={clearButtonAriaLabel}
                data-testid={`${testId}-clear-button`}
              >
                <X size={16} aria-hidden="true" />
              </button>
            ) : (
              endIcon
            )}
          </div>
        )}
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
});
