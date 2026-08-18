"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useScrollLock } from "@/hooks/useScrollLock";
import { motion } from "framer-motion";
import { ArrowLeftRight, LayoutDashboard, Settings, X } from "lucide-react";
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

  const navLinks = [
    {
      href: "/",
      label: t.sidebar.navigation.overview,
      icon: LayoutDashboard,
      isActive: pathname === "/",
    },
    {
      href: "/transactions",
      label: t.sidebar.navigation.transactions,
      icon: ArrowLeftRight,
      isActive: pathname.startsWith("/transactions"),
    },
    {
      href: "/settings",
      label: t.sidebar.navigation.settings,
      icon: Settings,
      isActive: pathname.startsWith("/settings"),
    },
  ];

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
        aria-label={t.sidebar.navigationLabel}
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
              {navLinks.map(({ href, label, icon: Icon, isActive }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`${styles.navItem} ${isActive ? styles.navLinkActive : ""}`}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => onClose?.()}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-sidebar-indicator"
                        className={styles.activeIndicator}
                        data-testid="active-sidebar-indicator"
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 30,
                        }}
                      />
                    )}

                    <Icon size={18} aria-hidden="true" />
                    {label}
                  </Link>
                </li>
              ))}
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
