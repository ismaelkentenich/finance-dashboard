import type { ReactNode, RefObject } from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  description?: string;
  className?: string;
  initialFocusRef?: RefObject<HTMLElement | null>;
  "data-testid"?: string;
}
