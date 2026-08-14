import { LocaleProvider } from "@/contexts/LocaleContext";
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
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
