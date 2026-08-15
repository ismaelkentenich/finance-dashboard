"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useScrollLock } from "@/hooks/useScrollLock";
import { ArrowLeftRight, LayoutDashboard, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";
import type { SidebarProps } from "./Sidebar.types";

export function Sidebar({
  isOpen = false,
  onClose,
  "data-testid": testId = "sidebar",
}: SidebarProps) {
  const { t } = useLocale();
  const pathname = usePathname();

  useScrollLock(isOpen);
  const sidebarRef = useFocusTrap<HTMLElement>({
    isOpen,
    onEscape: onClose,
  });

  const sidebarClasses = `${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`.trim();

  return (
    <>
      {isOpen && (
        <div
          data-testid="sidebar-backdrop"
          className={styles.backdropOpen}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        id="main-sidebar"
        ref={sidebarRef}
        className={sidebarClasses}
        aria-label="Main Navigation"
        data-testid={testId}
      >
        <div>
          <div className={styles.brandContainer}>
            <div className={styles.brandWrapper}>
              <div className={styles.brandIcon} aria-hidden="true">
                $
              </div>
              <span className={styles.brandName}>{t.sidebar.brandName}</span>
            </div>

            {onClose && (
              <button
                type="button"
                className={styles.closeButton}
                onClick={onClose}
                aria-label={t.sidebar.closeNav}
                data-testid="sidebar-close-button"
              >
                <X size={20} aria-hidden="true" />
              </button>
            )}
          </div>

          <nav>
            <ul className={styles.navList}>
              <li>
                <Link
                  href="/"
                  className={`${styles.navLink} ${pathname === "/" ? styles.navLinkActive : ""}`}
                  aria-current={pathname === "/" ? "page" : undefined}
                  onClick={() => onClose?.()}
                >
                  <LayoutDashboard size={18} aria-hidden="true" />
                  {t.sidebar.navigation.overview}
                </Link>
              </li>
              <li>
                <Link
                  href="/transactions"
                  className={`${styles.navLink} ${pathname.startsWith("/transactions") ? styles.navLinkActive : ""}`}
                  aria-current={pathname.startsWith("/transactions") ? "page" : undefined}
                  onClick={() => onClose?.()}
                >
                  <ArrowLeftRight size={18} aria-hidden="true" />
                  {t.sidebar.navigation.transactions}
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className={styles.sidebarFooter}>
          <div className={styles.userBadge}>
            <div className={styles.avatar} aria-hidden="true">
              JD
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>John Doe</span>
              <span className={styles.userRole}>{t.sidebar.userRole}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
