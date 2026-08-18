import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ServiceWorkerRegistration } from "../ServiceWorkerRegistration";

describe("ServiceWorkerRegistration", () => {
  const register = vi.fn();

  beforeEach(() => {
    register.mockReset();

    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      value: {
        register,
      },
    });
  });

  it("registers the application service worker", async () => {
    register.mockResolvedValue({});

    render(<ServiceWorkerRegistration />);

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith("/sw.js", {
        scope: "/",
      });
    });
  });
});
