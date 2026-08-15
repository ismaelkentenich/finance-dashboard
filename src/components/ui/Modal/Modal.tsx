"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useScrollLock } from "@/hooks/useScrollLock";
import { X } from "lucide-react";
import { useId } from "react";
import styles from "./Modal.module.css";
import type { ModalProps } from "./Modal.types";

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className = "",
  initialFocusRef,
  "data-testid": testId = "modal",
}: ModalProps) {
  const { t } = useLocale();
  const titleId = useId();
  const descriptionId = useId();

  useScrollLock(isOpen);
  const modalRef = useFocusTrap<HTMLDivElement>({
    isOpen,
    onEscape: onClose,
    initialFocusRef,
  });

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
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
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
            aria-label={t.common.closeDialog}
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
