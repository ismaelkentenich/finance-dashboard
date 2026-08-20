"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { SPRING_TRANSITIONS } from "@/motion";
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical } from "lucide-react";
import { useRef, useState, type KeyboardEvent } from "react";
import styles from "./DraggableWidget.module.css";
import type { DraggableWidgetProps } from "./DraggableWidget.types";

export function DraggableWidget({
  value,
  children,
  widgetLabel,
  position,
  totalItems,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  className = "",
}: DraggableWidgetProps) {
  const { t } = useLocale();

  const dragControls = useDragControls();

  const [isDragging, setIsDragging] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const handleRef = useRef<HTMLButtonElement>(null);

  const announcePosition = (nextPosition: number) => {
    setAnnouncement(
      t.common.widgetMoved
        .replace("{widget}", widgetLabel)
        .replace("{position}", String(nextPosition))
        .replace("{total}", String(totalItems))
    );
  };

  const maintainHandleFocus = () => {
    requestAnimationFrame(() => {
      handleRef.current?.focus();
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowUp" && canMoveUp) {
      event.preventDefault();

      onMoveUp();
      announcePosition(position - 1);
      maintainHandleFocus();

      return;
    }

    if (event.key === "ArrowDown" && canMoveDown) {
      event.preventDefault();

      onMoveDown();
      announcePosition(position + 1);
      maintainHandleFocus();
    }
  };

  const accessibleLabel = `${widgetLabel}: ${t.common.dragLabel}`;

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
          ref={handleRef}
          type="button"
          className={styles.dragHandleButton}
          onPointerDown={(event) => dragControls.start(event)}
          onKeyDown={handleKeyDown}
          title={t.common.dragInstructions}
          aria-label={accessibleLabel}
          aria-keyshortcuts="ArrowUp ArrowDown"
          data-testid={`widget-drag-handle-${value}`}
          data-dragging={isDragging}
        >
          <GripVertical size={14} aria-hidden="true" />
        </button>
      </div>

      {children}

      <span
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        data-testid={`widget-reorder-status-${value}`}
      >
        {announcement}
      </span>
    </Reorder.Item>
  );
}
