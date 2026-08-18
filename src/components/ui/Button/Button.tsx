import { BUTTON_SIZE_MAP, BUTTON_VARIANT_MAP } from "./Button.constants";
import styles from "./Button.module.css";
import type { ButtonProps } from "./Button.types";

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  disabled,
  className = "",
  "data-testid": testId = "button",
  ...props
}: ButtonProps) {
  const isButtonDisabled = disabled || isLoading;

  return (
    <button
      data-testid={testId}
      disabled={isButtonDisabled}
      className={`${styles.button} ${BUTTON_VARIANT_MAP[variant]} ${BUTTON_SIZE_MAP[size]} ${
        fullWidth ? styles.fullWidth : ""
      } ${className}`.trim()}
      {...props}
    >
      {isLoading && <span className={styles.spinner} aria-hidden="true" />}
      {children}
    </button>
  );
}
