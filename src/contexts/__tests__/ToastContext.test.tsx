import { LocaleProvider } from "@/contexts/LocaleContext";
import { act, render, renderHook, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ToastProvider, useToast } from "../ToastContext";

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual<typeof import("framer-motion")>("framer-motion");
  return {
    ...actual,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

function TestConsumer() {
  const { showToast, dismissToast, toasts } = useToast();
  const [lastToastId, setLastToastId] = useState<string | null>(null);

  return (
    <div>
      <button
        onClick={() => {
          const id = showToast({
            type: "success",
            message: "Operação realizada",
            title: "Sucesso",
          });
          setLastToastId(id);
        }}
        data-testid="btn-success"
      >
        Disparar Sucesso
      </button>

      <button
        onClick={() => showToast({ type: "error", message: "Falha crítica", title: "Erro" })}
        data-testid="btn-error"
      >
        Disparar Erro
      </button>

      <button
        onClick={() => showToast({ type: "info", message: "Notificação simples" })}
        data-testid="btn-info"
      >
        Disparar Info
      </button>

      <button
        onClick={() => {
          showToast({ message: "Toast 1" });
          showToast({ message: "Toast 2" });
          showToast({ message: "Toast 3" });
          showToast({ message: "Toast 4" });
        }}
        data-testid="btn-overflow"
      >
        Disparar 4 Toasts
      </button>

      <button
        onClick={() => {
          if (lastToastId) {
            dismissToast(lastToastId);
          }
        }}
        data-testid="btn-dismiss-programmatic"
      >
        Dismiss Programático
      </button>

      <span data-testid="toast-count">{toasts.length}</span>
    </div>
  );
}

function renderToastContext() {
  return render(
    <LocaleProvider>
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    </LocaleProvider>
  );
}

describe("ToastContext and ToastProvider", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("throws error when useToast is used outside ToastProvider", () => {
    expect(() => renderHook(() => useToast())).toThrow(
      "useToast must be used within a ToastProvider"
    );
  });

  it("renders toasts when showToast is invoked for success, error and info", () => {
    renderToastContext();

    act(() => {
      screen.getByTestId("btn-success").click();
      screen.getByTestId("btn-error").click();
    });

    expect(screen.getByTestId("toast-success")).toBeInTheDocument();
    expect(screen.getByText("Operação realizada")).toBeInTheDocument();
    expect(screen.getByTestId("toast-error")).toBeInTheDocument();
    expect(screen.getByText("Falha crítica")).toBeInTheDocument();
  });

  it("limits maximum simultaneous toasts to 3 (MAX_TOASTS)", () => {
    renderToastContext();

    act(() => {
      screen.getByTestId("btn-overflow").click();
    });

    expect(screen.getByTestId("toast-count")).toHaveTextContent("3");
    expect(screen.queryByText("Toast 1")).not.toBeInTheDocument();
    expect(screen.getByText("Toast 4")).toBeInTheDocument();
  });

  it("auto dismisses toast after configurable duration", () => {
    renderToastContext();

    act(() => {
      screen.getByTestId("btn-info").click();
    });

    expect(screen.getByText("Notificação simples")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.queryByText("Notificação simples")).not.toBeInTheDocument();
  });

  it("dismisses toast programmatically using dismissToast(id)", () => {
    renderToastContext();

    act(() => {
      screen.getByTestId("btn-success").click();
    });

    expect(screen.getByText("Operação realizada")).toBeInTheDocument();

    act(() => {
      screen.getByTestId("btn-dismiss-programmatic").click();
    });

    expect(screen.queryByText("Operação realizada")).not.toBeInTheDocument();
  });

  it("manually dismisses toast when close button is clicked in UI", () => {
    renderToastContext();

    act(() => {
      screen.getByTestId("btn-info").click();
    });

    expect(screen.getByText("Notificação simples")).toBeInTheDocument();

    const closeBtn = screen.getByTestId("toast-close-button");
    act(() => {
      closeBtn.click();
    });

    expect(screen.queryByText("Notificação simples")).not.toBeInTheDocument();
  });
});
