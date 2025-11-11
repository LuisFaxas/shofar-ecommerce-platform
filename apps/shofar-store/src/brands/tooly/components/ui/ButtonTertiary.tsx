/**
 * ButtonTertiary Component
 * Ghost button for tertiary actions
 * Minimal visual weight for less important actions
 */

'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonTertiaryProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
 * Tertiary/ghost button with minimal styling
 * For low-priority actions that shouldn't compete for attention
 */
export const ButtonTertiary = forwardRef<HTMLButtonElement, ButtonTertiaryProps>(
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
      sm: 'h-9 px-3 text-sm',
      md: 'h-11 px-4 text-base',
      lg: 'h-13 px-5 text-lg'
    };

    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center gap-2',
          'rounded-[10px] font-medium',

          // Ghost style - transparent background
          'bg-transparent',
          'text-[var(--text-secondary,rgba(255,255,255,0.70))]',

          // No border or shadow by default
          'border-0 shadow-none',

          // Transitions using motion tokens
          'transition-all duration-[var(--motion-fast,160ms)] ease-[cubic-bezier(0.22,1,0.36,1)]',

          // Hover state
          'hover:bg-[var(--glass-tint-light,rgba(255,255,255,0.08))]',
          'hover:text-[var(--text-primary,rgba(255,255,255,0.95))]',

          // Active state
          'active:bg-[var(--glass-tint-medium,rgba(255,255,255,0.12))]',
          'active:scale-[var(--scale-pressed,0.98)]',

          // Focus state
          'focus-visible:outline-none',
          'focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color,rgba(255,255,255,0.5))]',
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

ButtonTertiary.displayName = 'ButtonTertiary';

export default ButtonTertiary;