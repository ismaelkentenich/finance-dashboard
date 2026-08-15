"use client";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { SkipToContent } from "@/components/ui/SkipToContent";
import { useState } from "react";
import styles from "./layout.module.css";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className={styles.dashboardShell}>
      <SkipToContent targetId="main-content" />
      <Sidebar isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
      <div className={styles.mainWrapper}>
        <Header
          isMenuOpen={isMobileNavOpen}
          onToggleMenu={() => setIsMobileNavOpen((prev) => !prev)}
        />
        <main id="main-content" className={styles.pageContainer} tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
