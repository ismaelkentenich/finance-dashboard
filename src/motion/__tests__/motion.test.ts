import { describe, expect, it } from "vitest";
import {
  chartFade,
  chartFadeVariants,
  DEFAULT_TRANSITION,
  fade,
  fadeUp,
  fadeVariants,
  MOTION_DURATIONS,
  MOTION_EASINGS,
  scaleFade,
  SPRING_TRANSITIONS,
  staggerContainer,
  staggerContainerVariants,
  summaryCardItem,
  summaryCardItemVariants,
  tableRow,
  tableRowVariants,
} from "..";

describe("Framer Motion Shared Configuration & Variants", () => {
  describe("Constants & Presets", () => {
    it("exports consistent numerical duration presets", () => {
      expect(MOTION_DURATIONS.instant).toBe(0.05);
      expect(MOTION_DURATIONS.fast).toBe(0.15);
      expect(MOTION_DURATIONS.normal).toBe(0.2);
      expect(MOTION_DURATIONS.slow).toBe(0.3);
    });

    it("exports valid easing curves and default transition", () => {
      expect(MOTION_EASINGS.default).toBeDefined();
      expect(MOTION_EASINGS.out).toBeDefined();
      expect(DEFAULT_TRANSITION).toHaveProperty("duration", MOTION_DURATIONS.normal);
      expect(DEFAULT_TRANSITION).toHaveProperty("ease", MOTION_EASINGS.out);
    });

    it("exports valid spring transition presets for layout reordering", () => {
      expect(SPRING_TRANSITIONS.layout).toEqual({
        type: "spring",
        stiffness: 350,
        damping: 30,
        mass: 1,
      });
      expect(SPRING_TRANSITIONS.stiff).toBeDefined();
      expect(SPRING_TRANSITIONS.bouncy).toBeDefined();
    });
  });

  describe("Generic Motion Variants", () => {
    it("provides valid fade variants with initial, animate and exit states", () => {
      expect(fade.initial).toEqual({ opacity: 0 });
      expect(fade.animate).toHaveProperty("opacity", 1);
      expect(fade.exit).toHaveProperty("opacity", 0);
      expect(fadeVariants).toBe(fade);
    });

    it("provides valid fadeUp variants translating along Y axis", () => {
      expect(fadeUp.initial).toEqual({ opacity: 0, y: 12 });
      expect(fadeUp.animate).toHaveProperty("opacity", 1);
      expect(fadeUp.animate).toHaveProperty("y", 0);
      expect(fadeUp.exit).toHaveProperty("opacity", 0);
      expect(fadeUp.exit).toHaveProperty("y", -8);
    });

    it("provides valid scaleFade variants animating scale and opacity", () => {
      expect(scaleFade.initial).toEqual({ opacity: 0, scale: 0.96 });
      expect(scaleFade.animate).toHaveProperty("opacity", 1);
      expect(scaleFade.animate).toHaveProperty("scale", 1);
      expect(scaleFade.exit).toHaveProperty("opacity", 0);
      expect(scaleFade.exit).toHaveProperty("scale", 0.96);
    });

    it("provides valid stagger container and summary card item variants", () => {
      expect(staggerContainer.animate).toEqual({
        transition: {
          staggerChildren: 0.06,
          delayChildren: 0.02,
        },
      });
      expect(staggerContainerVariants).toBe(staggerContainer);

      expect(summaryCardItem.initial).toEqual({ opacity: 0, y: 8 });
      expect(summaryCardItem.animate).toEqual({
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.25,
          ease: MOTION_EASINGS.out,
        },
      });
      expect(summaryCardItemVariants).toBe(summaryCardItem);
    });

    it("provides valid chartFade variants with short crossfade", () => {
      expect(chartFade.initial).toEqual({ opacity: 0 });
      expect(chartFade.animate).toEqual({
        opacity: 1,
        transition: {
          duration: MOTION_DURATIONS.fast,
          ease: MOTION_EASINGS.out,
        },
      });
      expect(chartFade.exit).toEqual({
        opacity: 0,
        transition: {
          duration: MOTION_DURATIONS.fast,
          ease: MOTION_EASINGS.in,
        },
      });
      expect(chartFadeVariants).toBe(chartFade);
    });

    it("provides valid tableRow variants with pure opacity fade and fast duration", () => {
      expect(tableRow.initial).toEqual({ opacity: 0 });
      expect(tableRow.animate).toEqual({
        opacity: 1,
        transition: {
          duration: MOTION_DURATIONS.fast,
          ease: MOTION_EASINGS.out,
        },
      });
      expect(tableRow.exit).toEqual({
        opacity: 0,
        transition: {
          duration: MOTION_DURATIONS.fast,
          ease: MOTION_EASINGS.in,
        },
      });
      expect(tableRowVariants).toBe(tableRow);
    });
  });
});
