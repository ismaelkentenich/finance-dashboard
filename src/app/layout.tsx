import { WebVitalsReporter } from "@/components/analytics/WebVitalsReporter";
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME } from "@/constants/locale.constants";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { ModalProvider } from "@/contexts/ModalContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { ToastProvider } from "@/contexts/ToastContext";
import type { SupportedLocale } from "@/locales/types";
import { MotionProvider } from "@/providers/MotionProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { isValidLocale } from "@/utils/locale";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fintech Dashboard — Financial Management",
  description: "Track your personal finances with clarity and precision.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  const initialLocale: SupportedLocale = isValidLocale(cookieLocale)
    ? cookieLocale
    : DEFAULT_LOCALE;

  return (
    <html lang={initialLocale}>
      <body>
        <QueryProvider>
          <MotionProvider>
            <LocaleProvider initialLocale={initialLocale}>
              <ToastProvider>
                <SettingsProvider>
                  <ModalProvider>
                    <WebVitalsReporter />
                    {children}
                  </ModalProvider>
                </SettingsProvider>
              </ToastProvider>
            </LocaleProvider>
          </MotionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
