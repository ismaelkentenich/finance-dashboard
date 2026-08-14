import type { CSSProperties } from "react";
import styles from "./Skeleton.module.css";
import { SkeletonProps } from "./Skeleton.types";

export function Skeleton({
  width = "100%",
  height = "1rem",
  borderRadius,
  className = "",
  "data-testid": testId = "skeleton",
}: SkeletonProps) {
  const customStyles: CSSProperties = {
    width,
    height,
    ...(borderRadius ? { borderRadius } : {}),
  };

  return (
    <div
      data-testid={testId}
      className={`${styles.skeleton} ${className}`}
      style={customStyles}
      aria-hidden="true"
    />
  );
}
