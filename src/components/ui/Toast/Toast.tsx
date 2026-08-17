"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, Check, Info, X } from "lucide-react";
import { useEffect } from "react";
import styles from "./Toast.module.css";
import type { ToastContainerProps, ToastProps, ToastType } from "./Toast.types";

const VARIANT_CLASS_MAP: Record<ToastType, string> = {
  success: styles.variantSuccess,
  error: styles.variantError,
  info: styles.variantInfo,
  warning: styles.variantWarning,
};

const VARIANT_ICON_MAP: Record<ToastType, typeof Check> = {
  success: Check,
  error: X,
  info: Info,
  warning: AlertTriangle,
};

export function Toast({ toast, onDismiss }: ToastProps) {
  const { t } = useLocale();
  const shouldReduceMotion = useReducedMotion();
  const Icon = VARIANT_ICON_MAP[toast.type];

  useEffect(() => {
    if (!toast.duration || toast.duration <= 0) return;

    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  const isAssertive = toast.type === "error" || toast.type === "warning";

  const motionVariants = {
    initial: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -16, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 24, scale: 0.95 },
  };

  return (
    <motion.div
      layout="position"
      variants={motionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: shouldReduceMotion ? 0.01 : 0.2 }}
      role={isAssertive ? "alert" : "status"}
      aria-live={isAssertive ? "assertive" : "polite"}
      aria-atomic="true"
      data-testid={`toast-${toast.type}`}
      className={`${styles.toast} ${VARIANT_CLASS_MAP[toast.type]}`}
    >
      <div
        className={styles.iconWrapper}
        aria-hidden="true"
        data-testid={`toast-icon-${toast.type}`}
      >
        <Icon size={18} strokeWidth={2.5} />
      </div>

      <div className={styles.content}>
        {toast.title && (
          <div className={styles.title} data-testid="toast-title">
            {toast.title}
          </div>
        )}
        <div className={styles.message} data-testid="toast-message">
          {toast.message}
        </div>
      </div>

      <button
        type="button"
        className={styles.closeButton}
        onClick={() => onDismiss(toast.id)}
        aria-label={t.common?.closeDialog || "Fechar"}
        data-testid="toast-close-button"
      >
        <X size={18} aria-hidden="true" />
      </button>
    </motion.div>
  );
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div
      role="region"
      aria-label="Notificações"
      className={styles.container}
      data-testid="toast-container"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}
