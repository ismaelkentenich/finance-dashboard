"use client";

import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE_ELEMENTS_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface UseFocusTrapOptions {
  isOpen: boolean;
  onEscape?: () => void;
}

export function useFocusTrap<T extends HTMLElement = HTMLElement>({
  isOpen,
  onEscape,
}: UseFocusTrapOptions): RefObject<T | null> {
  const containerRef = useRef<T>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Store the currently focused element prior to opening
    previousActiveElementRef.current = document.activeElement as HTMLElement | null;

    // Move initial focus to the first interactive element inside the container
    const focusableElements = containerRef.current?.querySelectorAll<HTMLElement>(
      FOCUSABLE_ELEMENTS_SELECTOR
    );
    if (focusableElements && focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    // Handle Tab (trap loop) and Escape key events
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && onEscape) {
        onEscape();
        return;
      }

      if (event.key === "Tab") {
        if (!containerRef.current) return;

        const focusables = containerRef.current.querySelectorAll<HTMLElement>(
          FOCUSABLE_ELEMENTS_SELECTOR
        );
        if (focusables.length === 0) return;

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (event.shiftKey) {
          // Shift + Tab: wrap around from first element to last element
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: wrap around from last element to first element
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);

      // Restore focus back to the previously active element upon closing/unmount
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus();
      }
    };
  }, [isOpen, onEscape]);

  return containerRef;
}
