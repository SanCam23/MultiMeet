import { useEffect, useRef } from "react";

/**
 * Hook to trap focus inside a given container element.
 * @param {boolean} isActive Whether the trap is active (e.g., when modal is open)
 * @param {function} onClose Optional callback to fire when Escape key is pressed
 * @returns {React.RefObject} A ref to attach to the container element
 */
export function useFocusTrap(isActive, onClose) {
  const containerRef = useRef(null);
  const previousFocusRef = useRef(null);
  const onCloseRef = useRef(onClose);

  // Keep onCloseRef current with the latest callback
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;
    if (!container) return;

    // Store previous focused element to restore later
    previousFocusRef.current = document.activeElement;

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input[type="text"]:not([disabled])',
      'input[type="radio"]:not([disabled])',
      'input[type="checkbox"]:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ];

    const getFocusableElements = () => {
      return Array.from(container.querySelectorAll(focusableSelectors.join(', ')))
        .filter(el => {
          // Check if element is visible
          return el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0;
        });
    };

    // Auto focus the first element, or the container itself if none found
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    } else {
      container.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && onCloseRef.current) {
        onCloseRef.current();
        return;
      }

      if (e.key !== 'Tab') return;

      const elements = getFocusableElements();
      if (elements.length === 0) return;

      const firstElement = elements[0];
      const lastElement = elements[elements.length - 1];

      // If shift + tab
      if (e.shiftKey) {
        if (document.activeElement === firstElement || document.activeElement === container) {
          lastElement.focus();
          e.preventDefault();
        }
      } else { // If tab
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      // Restore focus when deactivated
      if (previousFocusRef.current && previousFocusRef.current.focus) {
        previousFocusRef.current.focus();
      }
    };
  }, [isActive]);

  return containerRef;
}
