/**
 * ButtonSecondary Component
 * Glass-style button for supporting actions
 * Complements ButtonPrimary without competing for attention
 */

'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonSecondaryProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Full width button */
  fullWidth?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Show arrow icon */
  showArrow?: boolean;
  /** Visual variant */
  variant?: 'default' | 'outline' | 'ghost';
}

/**
 * Secondary button with glass styling for supporting actions
 * Use for: View Details, Learn More, Add to Cart (non-primary)
 */
export const ButtonSecondary = forwardRef<HTMLButtonElement, ButtonSecondaryProps>(
  (
    {
      className,
      size = 'md',
      variant = 'default',
      fullWidth = false,
      loading = false,
      disabled = false,
      showArrow = false,
      children,
      ...props
    },
    ref
  ) => {
    // Size classes
    const sizeClasses = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base'
    };

    // Variant classes
    const variantClasses = {
      default: cn(
        'bg-white/[0.08] backdrop-blur-md',
        'border border-white/[0.14]',
        'text-white',
        'shadow-[0_1px_4px_rgba(0,0,0,0.2)]',
        'hover:bg-white/[0.12] hover:border-white/[0.20]',
        'active:bg-white/[0.10] active:scale-[0.98]'
      ),
      outline: cn(
        'bg-transparent',
        'border border-white/[0.20]',
        'text-white',
        'hover:bg-white/[0.08] hover:border-white/[0.30]',
        'active:bg-white/[0.05] active:scale-[0.98]'
      ),
      ghost: cn(
        'bg-transparent',
        'text-white/80',
        'hover:bg-white/[0.08] hover:text-white',
        'active:bg-white/[0.05] active:scale-[0.98]'
      )
    };

    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center',
          'rounded-lg font-medium',
          'transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50',

          // Size
          sizeClasses[size],

          // Variant
          variantClasses[variant],

          // States
          fullWidth && 'w-full',
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          loading && 'cursor-wait',

          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {/* Loading overlay */}
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/20">
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
          </span>
        )}

        {/* Button content */}
        <span className={cn(
          'inline-flex items-center justify-center gap-2',
          loading && 'opacity-0'
        )}>
          {children}
          {showArrow && (
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          )}
        </span>

        {/* Glass shine effect */}
        <span
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
          aria-hidden="true"
        />
      </button>
    );
  }
);

ButtonSecondary.displayName = 'ButtonSecondary';

export default ButtonSecondary;