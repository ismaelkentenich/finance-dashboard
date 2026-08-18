"use client";

import { animate, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export interface UseAnimatedNumberOptions {
  duration?: number;
  formatter?: (value: number) => string;
}

/**
 * Custom hook that smoothly interpolates numbers between state transitions.
 * Respects OS reduced motion preferences and supports custom formatters (Currency/Percentage).
 */
export function useAnimatedNumber(
  value: number,
  options: UseAnimatedNumberOptions = {}
): {
  displayValue: string;
  rawValue: number;
} {
  const { duration = 0.5, formatter = (v: number) => v.toFixed(0) } = options;
  const shouldReduceMotion = useReducedMotion();
  const [currentValue, setCurrentValue] = useState<number>(value);
  const prevValueRef = useRef<number>(value);

  useEffect(() => {
    // If reducedMotion is active, the external animation does not start.
    if (shouldReduceMotion) {
      prevValueRef.current = value;
      return;
    }

    const startValue = prevValueRef.current;
    if (startValue === value) {
      return;
    }

    const controls = animate(startValue, value, {
      duration,
      ease: [0.25, 0.1, 0.25, 1.0],
      onUpdate: (latest) => {
        setCurrentValue(latest);
      },
      onComplete: () => {
        prevValueRef.current = value;
        setCurrentValue(value);
      },
    });

    return () => {
      controls.stop();
      prevValueRef.current = value;
    };
  }, [value, duration, shouldReduceMotion]);

  const effectiveValue = shouldReduceMotion ? value : currentValue;

  return {
    displayValue: formatter(effectiveValue),
    rawValue: effectiveValue,
  };
}
