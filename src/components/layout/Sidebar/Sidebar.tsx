"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { ArrowLeftRight, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import styles from "./Sidebar.module.css";

export function Sidebar() {
  const { t } = useLocale();

  return (
    <aside className={styles.sidebar} aria-label="Main Navigation">
      <div>
        <div className={styles.brandContainer}>
          <div className={styles.brandIcon} aria-hidden="true">
            $
          </div>
          <span className={styles.brandName}>{t.sidebar.brandName}</span>
        </div>

        <nav>
          <ul className={styles.navList}>
            <li>
              <Link
                href="/"
                className={`${styles.navLink} ${styles.navLinkActive}`}
                aria-current="page"
              >
                <LayoutDashboard size={18} aria-hidden="true" />
                {t.sidebar.navigation.overview}
              </Link>
            </li>
            <li>
              <Link href="#transactions" className={styles.navLink}>
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
  );
}
