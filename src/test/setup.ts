import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, expect, vi } from "vitest";
import * as matchers from "vitest-axe/matchers";

expect.extend(matchers);

// Mock environment variables for Supabase and Firebase initialization in tests
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://mock-project.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "mock-anon-key";
process.env.NEXT_PUBLIC_FIREBASE_API_KEY = "mock-api-key-test-12345";
process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = "mock-app.firebaseapp.com";
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "mock-app";
process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = "mock-app.appspot.com";
process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = "123456789";
process.env.NEXT_PUBLIC_FIREBASE_APP_ID = "1:123456789:web:mock";

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
