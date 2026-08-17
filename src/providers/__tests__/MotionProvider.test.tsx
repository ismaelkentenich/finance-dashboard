import { render, screen } from "@testing-library/react";
import { motion, useReducedMotion } from "framer-motion";
import { describe, expect, it } from "vitest";
import { MotionProvider } from "../MotionProvider";

function MotionConsumerTest() {
  const shouldReduce = useReducedMotion();
  return (
    <div>
      <span data-testid="reduced-motion-indicator">{shouldReduce ? "reduced" : "normal"}</span>
      <motion.div data-testid="motion-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        Content
      </motion.div>
    </div>
  );
}

describe("MotionProvider Component", () => {
  it("renders children successfully within the MotionConfig provider", () => {
    render(
      <MotionProvider>
        <div data-testid="child-element">Test Child Content</div>
      </MotionProvider>
    );

    expect(screen.getByTestId("child-element")).toBeInTheDocument();
    expect(screen.getByText("Test Child Content")).toBeInTheDocument();
  });

  it("supplies motion configuration down to animated consumer elements", () => {
    render(
      <MotionProvider>
        <MotionConsumerTest />
      </MotionProvider>
    );

    expect(screen.getByTestId("motion-box")).toBeInTheDocument();
    expect(screen.getByTestId("reduced-motion-indicator")).toBeInTheDocument();
  });
});
