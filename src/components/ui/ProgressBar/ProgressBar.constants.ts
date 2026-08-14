import styles from "./ProgressBar.module.css";
import type { ProgressBarVariant } from "./ProgressBar.types";

export const PROGRESS_BAR_VARIANT_MAP: Record<ProgressBarVariant, string> = {
  primary: styles.variantPrimary,
  secondary: styles.variantSecondary,
  success: styles.variantSuccess,
  danger: styles.variantDanger,
  info: styles.variantInfo,
};
