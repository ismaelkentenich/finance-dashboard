import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import styles from "./layout.module.css";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className={styles.dashboardShell}>
      <Sidebar />

      <div className={styles.mainWrapper}>
        <Header />

        <main className={styles.pageContainer}>{children}</main>
      </div>
    </div>
  );
}
