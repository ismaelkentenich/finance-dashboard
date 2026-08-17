"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { SPRING_TRANSITIONS } from "@/motion";
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical } from "lucide-react";
import { useState } from "react";
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
  const [isDragging, setIsDragging] = useState(false);

  return (
    <Reorder.Item
      value={value}
      id={value}
      dragListener={false}
      dragControls={dragControls}
      className={`${styles.item} ${isDragging ? styles.dragging : ""} ${className}`.trim()}
      data-testid={`draggable-widget-${value}`}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      whileDrag={{
        scale: 1.01,
        boxShadow: "var(--shadow-xl)",
        zIndex: 50,
      }}
      transition={SPRING_TRANSITIONS.dragDrop}
    >
      <div className={styles.dragHandleBar}>
        <button
          type="button"
          className={styles.dragHandleButton}
          onPointerDown={(e) => dragControls.start(e)}
          title={t.common.dragLabel}
          aria-label={dragLabel}
          data-dragging={isDragging}
        >
          <GripVertical size={14} aria-hidden="true" />
        </button>
      </div>
      {children}
    </Reorder.Item>
  );
}
