"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface ModalContextData {
  isTransactionModalOpen: boolean;
  openTransactionModal: () => void;
  closeTransactionModal: () => void;
}

const ModalContext = createContext<ModalContextData | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  return (
    <ModalContext.Provider
      value={{
        isTransactionModalOpen,
        openTransactionModal: () => setIsTransactionModalOpen(true),
        closeTransactionModal: () => setIsTransactionModalOpen(false),
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
