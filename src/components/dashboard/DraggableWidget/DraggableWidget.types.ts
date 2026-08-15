import { WidgetId } from "@/types";
import { ReactNode } from "react";

export interface DraggableWidgetProps {
  value: WidgetId;
  children: ReactNode;
  dragLabel?: string;
  className?: string;
}
