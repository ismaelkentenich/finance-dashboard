"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

interface MotionProviderProps {
  children: ReactNode;
}

/**
 * Global Motion Configuration Provider
 * Enforces reducedMotion="user" across all Framer Motion components
 * while preserving essential layout drag & drop functionality.
 */
export function MotionProvider({ children }: MotionProviderProps) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
