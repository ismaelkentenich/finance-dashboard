"use client";

import { X } from "lucide-react";
import { useEffect, useId } from "react";
import styles from "./Modal.module.css";
import type { ModalProps } from "./Modal.types";

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className = "",
  "data-testid": testId = "modal",
}: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();

  // Closes on ESC and blocks background page scrolling
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.backdrop}
      data-testid={`${testId}-backdrop`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        data-testid={testId}
        className={`${styles.modalContent} ${className}`.trim()}
      >
        <div className={styles.header}>
          <div className={styles.titleContainer}>
            <h2 id={titleId} className={styles.title} data-testid={`${testId}-title`}>
              {title}
            </h2>
            {description && (
              <p
                id={descriptionId}
                className={styles.description}
                data-testid={`${testId}-description`}
              >
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close dialog"
            data-testid={`${testId}-close-button`}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}
