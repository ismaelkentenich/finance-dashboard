import { DEFAULT_LOCALE } from "@/constants/locale.constants";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { ModalProvider } from "@/contexts/ModalContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { MotionProvider } from "@/providers/MotionProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import type { AllTheProvidersProps } from "../types";
import { createTestQueryClient } from "./mocks";

export function AllTheProviders({
  children,
  locale = DEFAULT_LOCALE,
  queryClient = createTestQueryClient(),
}: AllTheProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <MotionProvider>
        <LocaleProvider initialLocale={locale}>
          <ToastProvider>
            <SettingsProvider>
              <ModalProvider>{children}</ModalProvider>
            </SettingsProvider>
          </ToastProvider>
        </LocaleProvider>
      </MotionProvider>
    </QueryClientProvider>
  );
}
