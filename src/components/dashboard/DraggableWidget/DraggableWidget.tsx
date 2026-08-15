"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical } from "lucide-react";
import styles from "./DraggableWidget.module.css";
import { DraggableWidgetProps } from "./DraggableWidget.types";

export function DraggableWidget({
  value,
  children,
  dragLabel,
  className = "",
}: DraggableWidgetProps) {
  const { t } = useLocale();
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={value}
      id={value}
      dragListener={false}
      dragControls={dragControls}
      className={`${styles.item} ${className}`.trim()}
      data-testid={`draggable-widget-${value}`}
      whileDrag={{
        scale: 1.02,
        boxShadow: "var(--shadow-xl)",
        zIndex: 50,
      }}
      transition={{ duration: 0.2 }}
    >
      <div className={styles.dragHandleBar}>
        <button
          type="button"
          className={styles.dragHandleButton}
          onPointerDown={(e) => dragControls.start(e)}
          title={t.common.dragLabel}
          aria-label={dragLabel}
        >
          <GripVertical size={14} aria-hidden="true" />
        </button>
      </div>
      {children}
    </Reorder.Item>
  );
}
