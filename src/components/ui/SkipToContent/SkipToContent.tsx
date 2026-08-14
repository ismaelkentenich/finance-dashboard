import styles from "./SkipToContent.module.css";
import type { SkipToContentProps } from "./SkipToContent.types";

export function SkipToContent({
  targetId = "main-content",
  label = "Pular para o conteúdo principal",
  className = "",
}: SkipToContentProps) {
  return (
    <a
      href={`#${targetId}`}
      className={`${styles.skipLink} ${className}`.trim()}
      data-testid="skip-to-content"
    >
      {label}
    </a>
  );
}
