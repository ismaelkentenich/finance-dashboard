"use client";

import { Button } from "@/components/ui/Button";
import { useLocale } from "@/contexts/LocaleContext";
import { useModal } from "@/contexts/ModalContext";
import { useTransactionFilters } from "@/hooks/useTransactionFilters";
import { Menu, Plus } from "lucide-react";
import styles from "./Header.module.css";
import type { HeaderProps } from "./Header.types";

export function Header({ onToggleMenu, isMenuOpen = false }: HeaderProps) {
  const { locale, setLocale, t } = useLocale();
  const { openTransactionModal } = useModal();
  const { filters } = useTransactionFilters();

  const currentPeriodLabel =
    t.filters.periods[filters.period] || t.filters.periods["current-month"];

  return (
    <header className={styles.header}>
      <div className={styles.brandGroup}>
        {onToggleMenu && (
          <button
            type="button"
            className={styles.menuButton}
            onClick={onToggleMenu}
            aria-label={isMenuOpen ? t.header.closeMenu : t.header.openMenu}
            aria-expanded={isMenuOpen}
            aria-controls="main-sidebar"
            data-testid="mobile-menu-toggle"
          >
            <Menu size={20} aria-hidden="true" />
          </button>
        )}
        <h1 className={styles.title}>{t.header.title}</h1>
      </div>

      <div className={styles.actions}>
        <Button
          size="sm"
          variant="primary"
          onClick={openTransactionModal}
          data-testid="new-transaction-header-button"
        >
          <Plus size={16} aria-hidden="true" />
          {t.transactionModal.triggerButton}
        </Button>

        <span
          className={styles.periodBadge}
          data-testid="header-period-badge"
          aria-label={`Selected period: ${currentPeriodLabel}`}
        >
          {currentPeriodLabel}
        </span>

        <div className={styles.localeSwitcher} role="group" aria-label="Language selection">
          <button
            type="button"
            className={`${styles.localeButton} ${locale === "pt-BR" ? styles.localeButtonActive : ""}`}
            onClick={() => setLocale("pt-BR")}
            aria-pressed={locale === "pt-BR"}
            aria-label={t.header.switchToPortuguese}
          >
            PT
          </button>
          <button
            type="button"
            className={`${styles.localeButton} ${locale === "en-US" ? styles.localeButtonActive : ""}`}
            onClick={() => setLocale("en-US")}
            aria-pressed={locale === "en-US"}
            aria-label={t.header.switchToEnglish}
          >
            EN
          </button>
        </div>
      </div>
    </header>
  );
}
