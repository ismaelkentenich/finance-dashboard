import styles from "./Button.module.css";
import type { ButtonSize, ButtonVariant } from "./Button.types";

export const BUTTON_VARIANT_MAP: Record<ButtonVariant, string> = {
  primary: styles.primary,
  secondary: styles.secondary,
  danger: styles.danger,
  ghost: styles.ghost,
};

export const BUTTON_SIZE_MAP: Record<ButtonSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
};
