import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, expect, vi } from "vitest";
import * as matchers from "vitest-axe/matchers";

expect.extend(matchers);

// Automatic DOM cleanup between tests
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock for ResizeObserver (required for components with layouts and charts)
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock for window.matchMedia (required for media queries and themes)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
