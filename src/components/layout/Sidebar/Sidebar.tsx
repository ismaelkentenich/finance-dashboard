import { ArrowLeftRight, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import type { ComponentType } from "react";
import styles from "./Sidebar.module.css";

interface NavigationItem {
  label: string;
  href: string;
  isActive?: boolean;
  icon: ComponentType<{
    size?: number | string;
    className?: string;
    "aria-hidden"?: boolean | "true" | "false";
  }>;
}

const NAVIGATION_ITEMS: NavigationItem[] = [
  { label: "Overview", href: "/", isActive: true, icon: LayoutDashboard },
  { label: "Transactions", href: "#transactions", isActive: false, icon: ArrowLeftRight },
];

export function Sidebar() {
  return (
    <aside className={styles.sidebar} aria-label="Main Navigation">
      <div>
        <div className={styles.brandContainer}>
          <div className={styles.brandIcon} aria-hidden="true">
            $
          </div>
          <span className={styles.brandName}>FinFlow</span>
        </div>

        <nav>
          <ul className={styles.navList}>
            {NAVIGATION_ITEMS.map((item) => {
              const IconComponent = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`${styles.navLink} ${item.isActive ? styles.navLinkActive : ""}`}
                    aria-current={item.isActive ? "page" : undefined}
                  >
                    <IconComponent size={18} aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
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
            <span className={styles.userRole}>Premium Account</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
