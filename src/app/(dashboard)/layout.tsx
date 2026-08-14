import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { SkipToContent } from "@/components/ui/SkipToContent";
import styles from "./layout.module.css";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className={styles.dashboardShell}>
      <SkipToContent targetId="main-content" />
      <Sidebar />
      <div className={styles.mainWrapper}>
        <Header />
        <main id="main-content" className={styles.pageContainer} tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
