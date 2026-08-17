import type { Transition } from "framer-motion";

/**
 * Shared Framer Motion duration presets (in seconds)
 * Aligned with Design System global motion tokens
 */
export const MOTION_DURATIONS = {
  instant: 0.05,
  fast: 0.15,
  normal: 0.2,
  slow: 0.3,
} as const;

export type MotionDurationKey = keyof typeof MOTION_DURATIONS;

/**
 * Shared Framer Motion easing curves
 */
export const MOTION_EASINGS = {
  default: [0.25, 0.1, 0.25, 1.0],
  in: [0.4, 0, 1, 1],
  out: [0, 0, 0.2, 1],
  inOut: [0.4, 0, 0.2, 1],
} as const;

export type MotionEasingKey = keyof typeof MOTION_EASINGS;

/**
 * Recharts standard animation configurations (in milliseconds)
 */
export const CHART_ANIMATION_DURATION = MOTION_DURATIONS.slow * 1000; // 300ms
export const CHART_ANIMATION_EASING = "ease-out" as const;

/**
 * Spring transition presets for layout reorder and interactive gestures
 */
export const SPRING_TRANSITIONS: Record<string, Transition> = {
  layout: {
    type: "spring",
    stiffness: 350,
    damping: 30,
    mass: 1,
  },
  stiff: {
    type: "spring",
    stiffness: 500,
    damping: 35,
  },
  bouncy: {
    type: "spring",
    stiffness: 400,
    damping: 20,
  },
  gentle: {
    type: "spring",
    stiffness: 200,
    damping: 25,
  },
};

/**
 * Default smooth standard transition
 */
export const DEFAULT_TRANSITION: Transition = {
  duration: MOTION_DURATIONS.normal,
  ease: MOTION_EASINGS.out,
};
