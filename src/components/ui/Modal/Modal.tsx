"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useScrollLock } from "@/hooks/useScrollLock";
import { modalBackdropVariants, modalDialogVariants } from "@/motion";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useId } from "react";
import styles from "./Modal.module.css";
import type { ModalProps } from "./Modal.types";

type ModalSurfaceProps = Omit<ModalProps, "isOpen"> & {
  shouldReduceMotion: boolean;
};

function ModalSurface({
  onClose,
  title,
  description,
  children,
  className = "",
  initialFocusRef,
  shouldReduceMotion,
  "data-testid": testId = "modal",
}: ModalSurfaceProps) {
  const { t } = useLocale();
  const titleId = useId();
  const descriptionId = useId();

  // This component remains mounted while AnimatePresence runs the exit animation.
  // Keeping both hooks active here preserves focus trapping and scroll lock until
  // the visual modal is actually removed from the DOM.
  useScrollLock(true);

  const modalRef = useFocusTrap<HTMLDivElement>({
    isOpen: true,
    onEscape: onClose,
    initialFocusRef,
  });

  const motionState = shouldReduceMotion ? undefined : "animate";
  const exitState = shouldReduceMotion ? undefined : "exit";

  return (
    <motion.div
      className={styles.backdrop}
      data-testid={`${testId}-backdrop`}
      variants={modalBackdropVariants}
      initial={shouldReduceMotion ? false : "initial"}
      animate={motionState}
      exit={exitState}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        data-testid={testId}
        className={`${styles.modalContent} ${className}`.trim()}
        variants={modalDialogVariants}
        initial={shouldReduceMotion ? false : "initial"}
        animate={motionState}
        exit={exitState}
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
      </motion.div>
    </motion.div>
  );
}

export function Modal({ isOpen, ...props }: ModalProps) {
  const shouldReduceMotion = Boolean(useReducedMotion());

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalSurface key="modal-surface" {...props} shouldReduceMotion={shouldReduceMotion} />
      )}
    </AnimatePresence>
  );
}
