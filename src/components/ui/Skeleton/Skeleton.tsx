import type { CSSProperties } from "react";
import styles from "./Skeleton.module.css";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
  "data-testid"?: string;
}

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
