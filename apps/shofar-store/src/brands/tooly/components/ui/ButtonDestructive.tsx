/**
 * ButtonDestructive Component
 * Red button for dangerous/destructive actions
 * Clear warning signal for irreversible operations
 */

'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonDestructiveProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Full width button */
  fullWidth?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Icon on left side */
  iconLeft?: React.ReactNode;
  /** Icon on right side */
  iconRight?: React.ReactNode;
}

/**
 * Destructive button for dangerous actions (delete, remove, cancel)
 * Uses semantic error color with WCAG AA compliance
 */
export const ButtonDestructive = forwardRef<HTMLButtonElement, ButtonDestructiveProps>(
  (
    {
      className,
      size = 'md',
      fullWidth = false,
      loading = false,
      disabled = false,
      iconLeft,
      iconRight,
      children,
      ...props
    },
    ref
  ) => {
    // Size classes following consistent system
    const sizeClasses = {
      sm: 'h-9 px-4 text-sm',
      md: 'h-11 px-5 text-base',
      lg: 'h-13 px-6 text-lg'
    };

    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center gap-2',
          'rounded-[10px] font-medium',

          // Error red background
          'bg-[var(--color-error,#ef4444)]',
          'text-white',

          // Shadow and border
          'shadow-[var(--elev-0)] border-0',

          // Transitions using motion tokens
          'transition-all duration-[var(--motion-fast,160ms)] ease-[cubic-bezier(0.22,1,0.36,1)]',

          // Hover state
          'hover:bg-red-600',
          'hover:shadow-[var(--elev-1)]',
          'hover:scale-[1.01]',

          // Active state
          'active:bg-red-700',
          'active:scale-[var(--scale-pressed,0.98)]',

          // Focus state
          'focus-visible:outline-none',
          'focus-visible:ring-2 focus-visible:ring-red-500/50',
          'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-bg,#0b0e14)]',

          // Size
          sizeClasses[size],

          // States
          fullWidth && 'w-full',
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          loading && 'cursor-wait',

          // Disable hover scale on touch
          'no-touch-zoom',

          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {/* Content */}
        {!loading && (
          <>
            {iconLeft}
            {children}
            {iconRight}
          </>
        )}
      </button>
    );
  }
);

ButtonDestructive.displayName = 'ButtonDestructive';

export default ButtonDestructive;