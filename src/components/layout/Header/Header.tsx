"use client";

import { useLocale } from "@/contexts/LocaleContext";
import styles from "./Header.module.css";

export function Header() {
  const { locale, setLocale, t } = useLocale();

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{t.header.title}</h1>

      <div className={styles.actions}>
        <span
          className={styles.periodBadge}
          aria-label={`Selected period: ${t.header.periodBadge}`}
        >
          {t.header.periodBadge}
        </span>

        {/* Locale Switcher */}
        <div className={styles.localeSwitcher} role="group" aria-label="Language selection">
          <button
            type="button"
            className={`${styles.localeButton} ${locale === "pt-BR" ? styles.localeButtonActive : ""}`}
            onClick={() => setLocale("pt-BR")}
            aria-pressed={locale === "pt-BR"}
          >
            PT
          </button>
          <button
            type="button"
            className={`${styles.localeButton} ${locale === "en-US" ? styles.localeButtonActive : ""}`}
            onClick={() => setLocale("en-US")}
            aria-pressed={locale === "en-US"}
          >
            EN
          </button>
        </div>
      </div>
    </header>
  );
}
