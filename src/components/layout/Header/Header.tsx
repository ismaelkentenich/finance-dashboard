import styles from "./Header.module.css";

interface HeaderProps {
  title?: string;
}

export function Header({ title = "Financial Overview" }: HeaderProps) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>

      <div className={styles.actions}>
        <span className={styles.periodBadge} aria-label="Selected period: August 2026">
          August 2026
        </span>
      </div>
    </header>
  );
}
