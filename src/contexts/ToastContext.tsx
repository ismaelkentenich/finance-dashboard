"use client";

import { ToastContainer } from "@/components/ui/Toast";
import type { ShowToastOptions, ToastItem } from "@/components/ui/Toast/Toast.types";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

const MAX_TOASTS = 3;
const DEFAULT_DURATION = 5000;

interface ToastContextValue {
  showToast: (options: ShowToastOptions) => string;
  dismissToast: (id: string) => void;
  toasts: ToastItem[];
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type = "info", message, title, duration = DEFAULT_DURATION }: ShowToastOptions) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newToast: ToastItem = {
        id,
        type,
        message,
        title,
        duration,
      };

      setToasts((prev) => {
        const next = [newToast, ...prev];
        return next.slice(0, MAX_TOASTS);
      });

      return id;
    },
    []
  );

  const contextValue = useMemo(
    () => ({
      showToast,
      dismissToast,
      toasts,
    }),
    [showToast, dismissToast, toasts]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
