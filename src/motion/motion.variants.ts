import type { Variants } from "framer-motion";
import { DEFAULT_TRANSITION, MOTION_DURATIONS, MOTION_EASINGS } from "./motion.constants";

/**
 * Standard opacity fade variant
 */
export const fade: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: DEFAULT_TRANSITION,
  },
  exit: {
    opacity: 0,
    transition: {
      duration: MOTION_DURATIONS.fast,
      ease: MOTION_EASINGS.in,
    },
  },
};

/**
 * Fade in while translating up on the Y axis
 */
export const fadeUp: Variants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: DEFAULT_TRANSITION,
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: MOTION_DURATIONS.fast,
      ease: MOTION_EASINGS.in,
    },
  },
};

/**
 * Fade in while subtly scaling up from 0.96
 */
export const scaleFade: Variants = {
  initial: {
    opacity: 0,
    scale: 0.96,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: DEFAULT_TRANSITION,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: {
      duration: MOTION_DURATIONS.fast,
      ease: MOTION_EASINGS.in,
    },
  },
};

/**
 * Stagger container orchestrating child card arrivals
 */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.02,
    },
  },
};

/**
 * Subtle entrance variant for individual cards (max 8px vertical displacement, 250ms duration)
 */
export const summaryCardItem: Variants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: MOTION_EASINGS.out,
    },
  },
};

/**
 * Short crossfade transition for switching between financial chart states.
 */
export const chartFade: Variants = {
  initial: {
    opacity: 0,
    y: 4,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATIONS.fast,
      ease: MOTION_EASINGS.out,
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: {
      duration: MOTION_DURATIONS.fast,
      ease: MOTION_EASINGS.in,
    },
  },
};

/**
 * Discrete opacity fade transition for table rows during filter and search updates.
 */
export const tableRow: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: MOTION_DURATIONS.fast,
      ease: MOTION_EASINGS.out,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: MOTION_DURATIONS.fast,
      ease: MOTION_EASINGS.in,
    },
  },
};

export const fadeVariants = fade;
export const fadeUpVariants = fadeUp;
export const scaleFadeVariants = scaleFade;
export const staggerContainerVariants = staggerContainer;
export const summaryCardItemVariants = summaryCardItem;
export const chartFadeVariants = chartFade;
export const tableRowVariants = tableRow;
