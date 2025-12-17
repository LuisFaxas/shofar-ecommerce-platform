/**
 * Dialog Component
 * Accessible modal dialog with focus trap
 * Essential for checkout flows and confirmations
 */

"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export interface DialogProps {
  /** Whether dialog is open */
  open: boolean;
  /** Close handler */
  onClose: () => void;
  /** Dialog title */
  title?: string;
  /** Dialog description */
  description?: string;
  /** Dialog size */
  size?: "sm" | "md" | "lg" | "xl";
  /** Close on overlay click */
  closeOnOverlayClick?: boolean;
  /** Show close button */
  showCloseButton?: boolean;
  /** Dialog content */
  children: React.ReactNode;
  /** Additional className */
  className?: string;
}

/**
 * Accessible modal dialog following WAI-ARIA guidelines
 * Features focus trap, ESC key handling, and proper ARIA attributes
 */
export const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  title,
  description,
  size = "md",
  closeOnOverlayClick = true,
  showCloseButton = true,
  children,
  className,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Size classes
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  // Focus trap implementation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      // Tab trap
      if (e.key === "Tab" && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    },
    [onClose],
  );

  // Handle focus management
  useEffect(() => {
    if (open) {
      // Store current focus
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Add event listeners
      document.addEventListener("keydown", handleKeyDown);

      // Focus first focusable element or dialog
      setTimeout(() => {
        if (dialogRef.current) {
          const firstFocusable = dialogRef.current.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          ) as HTMLElement;
          if (firstFocusable) {
            firstFocusable.focus();
          } else {
            dialogRef.current.focus();
          }
        }
      }, 50);

      // Prevent body scroll
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";

      // Restore focus
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  const dialogContent = (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50",
          "bg-black/60 backdrop-blur-sm",
          "animate-fade-in",
        )}
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "dialog-title" : undefined}
          aria-describedby={description ? "dialog-description" : undefined}
          className={cn(
            "relative w-full pointer-events-auto",
            "glass-heavy rounded-[var(--radius-lg,12px)]",
            "animate-scale-in",
            "shadow-[var(--elev-3)]",
            sizeClasses[size],
            className,
          )}
          onClick={(e) => e.stopPropagation()}
          tabIndex={-1}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-start justify-between p-6 border-b border-[var(--glass-border-default)]">
              <div>
                {title && (
                  <h2
                    id="dialog-title"
                    className="text-xl font-semibold text-[var(--text-primary)]"
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p
                    id="dialog-description"
                    className="mt-1 text-sm text-[var(--text-secondary)]"
                  >
                    {description}
                  </p>
                )}
              </div>

              {showCloseButton && (
                <button
                  onClick={onClose}
                  className={cn(
                    "p-1.5 rounded-lg",
                    "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]",
                    "hover:bg-[var(--glass-tint-light)]",
                    "transition-all duration-[var(--motion-fast)]",
                    "focus-visible:outline-none focus-visible:ring-2",
                    "focus-visible:ring-[var(--focus-ring-color)]",
                  )}
                  aria-label="Close dialog"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </>
  );

  // Portal to document.body
  if (typeof document !== "undefined") {
    return createPortal(dialogContent, document.body);
  }

  return null;
};

Dialog.displayName = "Dialog";

export default Dialog;
