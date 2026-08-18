"use client";

import { useEffect, useRef, type RefObject } from "react";

export const FOCUSABLE_ELEMENTS_SELECTOR = [
  'a[href]:not([tabindex="-1"]):not([disabled])',
  'area[href]:not([tabindex="-1"]):not([disabled])',
  'input:not([disabled]):not([type="hidden"]):not([tabindex="-1"])',
  'select:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  'button:not([disabled]):not([tabindex="-1"])',
  'iframe:not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])',
  '[contentEditable=true]:not([tabindex="-1"])',
].join(", ");

export interface UseFocusTrapOptions {
  isOpen: boolean;
  onEscape?: () => void;
  initialFocusRef?: RefObject<HTMLElement | null>;
  fallbackFocusRef?: RefObject<HTMLElement | null>;
  returnFocus?: boolean;
  autoFocus?: boolean;
  enableInert?: boolean;
}

// Global trap stack to coordinate nested or multiple dialogs
const activeTraps: HTMLElement[] = [];

/**
 * Filters and returns interactive elements inside container that are currently visible and enabled.
 */
export function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];

  const rawElements = Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS_SELECTOR)
  );

  return rawElements.filter((element) => {
    if (element.hasAttribute("disabled") || element.getAttribute("aria-hidden") === "true") {
      return false;
    }
    if (typeof window !== "undefined" && window.getComputedStyle) {
      const style = window.getComputedStyle(element);
      if (style.display === "none" || style.visibility === "hidden") {
        return false;
      }
    }
    return true;
  });
}

export function useFocusTrap<T extends HTMLElement = HTMLElement>({
  isOpen,
  onEscape,
  initialFocusRef,
  fallbackFocusRef,
  returnFocus = true,
  autoFocus = true,
  enableInert = false,
}: UseFocusTrapOptions): RefObject<T | null> {
  const containerRef = useRef<T>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  // Focus management & MutationObserver for async children
  useEffect(() => {
    if (!isOpen) return;

    if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
      previousActiveElementRef.current = document.activeElement;
    }

    const container = containerRef.current;
    if (!container) return;

    if (!container.hasAttribute("tabindex")) {
      container.setAttribute("tabindex", "-1");
    }

    activeTraps.push(container);

    const applyFocus = () => {
      if (!containerRef.current) return false;

      if (initialFocusRef?.current && containerRef.current.contains(initialFocusRef.current)) {
        initialFocusRef.current.focus();
        return true;
      }

      const focusables = getFocusableElements(containerRef.current);
      const autofocusElement = focusables.find((el) => el.hasAttribute("autofocus"));

      if (autofocusElement) {
        autofocusElement.focus();
        return true;
      } else if (focusables.length > 0) {
        focusables[0].focus();
        return true;
      } else {
        containerRef.current.focus();
        return false;
      }
    };

    if (autoFocus) {
      const hasFocusedInteractive = applyFocus();

      // Observe DOM changes in case content loads asynchronously
      if (!hasFocusedInteractive && typeof MutationObserver !== "undefined") {
        const observer = new MutationObserver(() => {
          const focusables = getFocusableElements(containerRef.current);
          if (focusables.length > 0) {
            applyFocus();
            observer.disconnect();
          }
        });

        observer.observe(container, { childList: true, subtree: true });

        return () => {
          observer.disconnect();
          const index = activeTraps.indexOf(container);
          if (index !== -1) activeTraps.splice(index, 1);
        };
      }
    }

    return () => {
      const index = activeTraps.indexOf(container);
      if (index !== -1) activeTraps.splice(index, 1);
    };
  }, [isOpen, autoFocus, initialFocusRef]);

  // Inert support for outside elements (Screen Reader Isolation)
  useEffect(() => {
    if (!isOpen || !enableInert || typeof document === "undefined") return;

    const container = containerRef.current;
    if (!container) return;

    const appRoots = Array.from(document.body.children).filter(
      (node) => node !== container && !container.contains(node) && node.tagName !== "SCRIPT"
    ) as HTMLElement[];

    const previousInertStates = appRoots.map((el) => ({
      element: el,
      wasInert: el.hasAttribute("inert"),
    }));

    appRoots.forEach((el) => el.setAttribute("inert", ""));

    return () => {
      previousInertStates.forEach(({ element, wasInert }) => {
        if (!wasInert) {
          element.removeAttribute("inert");
        }
      });
    };
  }, [isOpen, enableInert]);

  // Keyboard navigation & Event containment
  useEffect(() => {
    if (!isOpen) return;

    const fallbackElement = fallbackFocusRef?.current;

    function isTopTrap(): boolean {
      if (!containerRef.current) return false;
      return activeTraps[activeTraps.length - 1] === containerRef.current;
    }

    function handleKeyDown(event: KeyboardEvent) {
      // Only the topmost active trap handles Escape and Tab
      if (!isTopTrap()) return;

      if (event.key === "Escape" && onEscape) {
        event.stopPropagation();
        onEscape();
        return;
      }

      if (event.key === "Tab") {
        const container = containerRef.current;
        if (!container) return;

        const focusables = getFocusableElements(container);

        if (focusables.length === 0) {
          event.preventDefault();
          container.focus();
          return;
        }

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];
        const activeElement = document.activeElement;

        if (event.shiftKey) {
          if (activeElement === firstElement || !container.contains(activeElement)) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (activeElement === lastElement || !container.contains(activeElement)) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    }

    function handleFocusIn(event: FocusEvent) {
      if (!isTopTrap() || !containerRef.current) return;

      const target = event.target as HTMLElement | null;
      if (target && !containerRef.current.contains(target)) {
        event.preventDefault();
        const focusables = getFocusableElements(containerRef.current);
        if (focusables.length > 0) {
          focusables[0].focus();
        } else {
          containerRef.current.focus();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusin", handleFocusIn);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", handleFocusIn);

      if (returnFocus) {
        const previousElement = previousActiveElementRef.current;
        if (
          previousElement &&
          document.contains(previousElement) &&
          typeof previousElement.focus === "function"
        ) {
          previousElement.focus();
        } else if (fallbackElement && document.contains(fallbackElement)) {
          fallbackElement.focus();
        } else if (typeof document !== "undefined" && document.body) {
          document.body.focus?.();
        }
      }
    };
  }, [isOpen, onEscape, returnFocus, fallbackFocusRef]);

  return containerRef;
}
