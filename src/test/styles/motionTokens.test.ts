import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";

describe("Global Motion Tokens and Timing System", () => {
  const globalsCssPath = path.resolve(__dirname, "../../app/globals.css");
  const globalsCssContent = fs.readFileSync(globalsCssPath, "utf-8");

  describe("Duration Tokens", () => {
    it("defines standard motion duration tokens in :root", () => {
      expect(globalsCssContent).toMatch(/--motion-duration-instant:\s*50ms;/);
      expect(globalsCssContent).toMatch(/--motion-duration-fast:\s*150ms;/);
      expect(globalsCssContent).toMatch(/--motion-duration-normal:\s*200ms;/);
      expect(globalsCssContent).toMatch(/--motion-duration-slow:\s*300ms;/);
      expect(globalsCssContent).toMatch(/--motion-duration-spin:\s*800ms;/);
      expect(globalsCssContent).toMatch(/--motion-duration-shimmer:\s*1500ms;/);
    });
  });

  describe("Easing Tokens", () => {
    it("defines standard easing curve tokens in :root", () => {
      expect(globalsCssContent).toMatch(/--motion-easing-linear:\s*linear;/);
      expect(globalsCssContent).toMatch(/--motion-easing-default:\s*ease;/);
      expect(globalsCssContent).toMatch(
        /--motion-easing-in:\s*cubic-bezier\(0\.4,\s*0,\s*1,\s*1\);/
      );
      expect(globalsCssContent).toMatch(
        /--motion-easing-out:\s*cubic-bezier\(0,\s*0,\s*0\.2,\s*1\);/
      );
      expect(globalsCssContent).toMatch(
        /--motion-easing-in-out:\s*cubic-bezier\(0\.4,\s*0,\s*0\.2,\s*1\);/
      );
    });
  });

  describe("prefers-reduced-motion Compatibility", () => {
    it("preserves global prefers-reduced-motion rule neutralizing transitions and animations", () => {
      expect(globalsCssContent).toContain("@media (prefers-reduced-motion: reduce)");
      expect(globalsCssContent).toMatch(/animation-duration:\s*0\.01ms\s*!important;/);
      expect(globalsCssContent).toMatch(/transition-duration:\s*0\.01ms\s*!important;/);
    });
  });
});
