import { WebVitalsReporter } from "@/components/analytics/WebVitalsReporter";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { ModalProvider } from "@/contexts/ModalContext";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fintech Dashboard — Financial Management",
  description: "Track your personal finances with clarity and precision.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <LocaleProvider>
          <ModalProvider>
            <WebVitalsReporter />
            {children}
          </ModalProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
