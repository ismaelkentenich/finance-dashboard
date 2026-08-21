import type { WidgetId } from "@/types";
import type { ReactNode } from "react";

export interface DraggableWidgetProps {
  value: WidgetId;
  children: ReactNode;
  widgetLabel: string;
  position: number;
  totalItems: number;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  className?: string;
}
