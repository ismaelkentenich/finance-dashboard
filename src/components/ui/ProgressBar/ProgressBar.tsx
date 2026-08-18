"use client";

import { MOTION_DURATIONS, MOTION_EASINGS } from "@/motion";
import { motion, useReducedMotion } from "framer-motion";
import { PROGRESS_BAR_VARIANT_MAP } from "./ProgressBar.constants";
import styles from "./ProgressBar.module.css";
import type { ProgressBarProps } from "./ProgressBar.types";

export function ProgressBar({
  value,
  min = 0,
  max = 100,
  label,
  variant = "primary",
  delay = 0,
  className = "",
  "data-testid": testId = "progress-bar",
}: ProgressBarProps) {
  const shouldReduceMotion = useReducedMotion();
  const normalizedValue = Math.min(Math.max(value, min), max);
  const percentage = max > min ? ((normalizedValue - min) / (max - min)) * 100 : 0;

  return (
    <div
      data-testid={testId}
      className={`${styles.container} ${className}`.trim()}
      role="progressbar"
      aria-valuenow={normalizedValue}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-label={label || `${percentage.toFixed(1)}%`}
    >
      <motion.div
        data-testid={`${testId}-fill`}
        className={`${styles.fill} ${PROGRESS_BAR_VARIANT_MAP[variant]}`}
        initial={shouldReduceMotion ? { width: `${percentage}%` } : { width: "0%" }}
        animate={{ width: `${percentage}%` }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : {
                duration: MOTION_DURATIONS.slow,
                ease: MOTION_EASINGS.out,
                delay,
              }
        }
      />
    </div>
  );
}
