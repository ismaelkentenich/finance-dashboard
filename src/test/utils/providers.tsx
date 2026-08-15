import { DEFAULT_LOCALE } from "@/constants/locale.constants";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { ModalProvider } from "@/contexts/ModalContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { QueryClientProvider } from "@tanstack/react-query";
import type { AllTheProvidersProps } from "../types";
import { createTestQueryClient } from "./mocks";

export const AllTheProviders = ({
  children,
  locale = DEFAULT_LOCALE,
  queryClient = createTestQueryClient(),
}: AllTheProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider initialLocale={locale}>
        <SettingsProvider>
          <ModalProvider>{children}</ModalProvider>
        </SettingsProvider>
      </LocaleProvider>
    </QueryClientProvider>
  );
};
