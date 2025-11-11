/**
 * ButtonLink Component
 * Text button styled as a link
 * For inline actions and navigation
 */

'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonLinkProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
 * Link-styled button for inline navigation and text actions
 * Minimal visual footprint with underline interaction
 */
export const ButtonLink = forwardRef<HTMLButtonElement, ButtonLinkProps>(
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
    // Size classes - minimal padding for link style
    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    };

    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center gap-1',
          'font-medium',

          // Link style
          'bg-transparent border-0 p-0',
          'text-[var(--brand-orange,#FF6B35)]',
          'underline decoration-1 underline-offset-2',

          // Transitions using motion tokens
          'transition-all duration-[var(--motion-fast,160ms)] ease-[cubic-bezier(0.22,1,0.36,1)]',

          // Hover state
          'hover:text-[var(--brand-orange-hover,#FF5722)]',
          'hover:decoration-2',

          // Active state
          'active:text-[var(--brand-orange-active,#F4511E)]',
          'active:scale-[var(--scale-pressed,0.98)]',

          // Focus state
          'focus-visible:outline-none',
          'focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color,rgba(255,255,255,0.5))]',
          'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-bg,#0b0e14)]',
          'focus-visible:rounded-sm',

          // Size
          sizeClasses[size],

          // States
          fullWidth && 'w-full',
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none no-underline',
          loading && 'cursor-wait',

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

ButtonLink.displayName = 'ButtonLink';

export default ButtonLink;