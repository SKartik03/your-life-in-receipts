import React, { useEffect, useRef } from 'react';

/**
 * Returns accessibility props to spread onto non-<button> elements (e.g. <div>)
 * that have an onClick handler, making them fully keyboard-operable.
 */
export function clickableA11yProps(
  onActivate: () => void,
  ariaLabel?: string,
  stopPropagation: boolean = false
): {
  role: 'button';
  tabIndex: 0;
  'aria-label'?: string;
  onKeyDown: (e: React.KeyboardEvent) => void;
} {
  return {
    role: 'button',
    tabIndex: 0,
    ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        if (stopPropagation) {
          e.stopPropagation();
        }
        onActivate();
      }
    },
  };
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * React hook that traps focus within a modal/dialog container while active,
 * and restores focus to the previously focused element when deactivated.
 */
export function useFocusTrap(active: boolean): React.RefObject<HTMLDivElement | null> {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;

    // Save previous active element to restore upon closing
    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const container = containerRef.current;
    if (!container) return;

    // Focus the first focusable element or the container itself
    const focusFirstElement = () => {
      const focusables = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((el) => el.offsetParent !== null || el.offsetWidth > 0 || el.offsetHeight > 0);

      if (focusables.length > 0) {
        focusables[0].focus();
      } else {
        container.focus();
      }
    };

    // Use requestAnimationFrame so DOM nodes are mounted and rendered
    const animId = requestAnimationFrame(focusFirstElement);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusables = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((el) => el.offsetParent !== null || el.offsetWidth > 0 || el.offsetHeight > 0);

      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = focusables[0];
      const lastElement = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement || !container.contains(document.activeElement)) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement || !container.contains(document.activeElement)) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus();
      }
    };
  }, [active]);

  return containerRef;
}
