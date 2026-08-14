import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className={styles.mainContainer}>
      <div className={styles.contentWrapper}>
        <span className={styles.badge}>Environment Ready (Pure CSS Modules)</span>
        <h1 className={styles.title}>Fintech Financial Dashboard</h1>
        <p className={styles.description}>Next.js + TypeScript + CSS Modules</p>
      </div>
    </main>
  );
}
