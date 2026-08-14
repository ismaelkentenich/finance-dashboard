import styles from "./page.module.css";

export default function DashboardPage() {
  return (
    <section aria-labelledby="dashboard-heading">
      <h2 id="dashboard-heading" className={styles.title}>
        Welcome to your Financial Dashboard
      </h2>
      <p className={styles.description}>Financial Dashboard</p>
    </section>
  );
}
