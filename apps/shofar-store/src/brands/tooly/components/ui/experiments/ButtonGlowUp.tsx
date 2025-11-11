/**
 * ButtonGlowUp Component
 * Button with bottom glow effect on hover
 */

'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonGlowUpProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Full width button */
  fullWidth?: boolean;
  /** Loading state */
  loading?: boolean;
}

/**
 * Button with white glow effect that rises from bottom on hover
 * Subtle and elegant hover animation
 */
export const ButtonGlowUp = forwardRef<HTMLButtonElement, ButtonGlowUpProps>(
  (
    {
      className,
      size = 'md',
      fullWidth = false,
      loading = false,
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'h-8 w-16 text-xs',
      md: 'h-9 w-20 text-sm',
      lg: 'h-10 w-24 text-base'
    };

    return (
      <div
        className={cn(
          'relative group overflow-hidden bg-white/20 p-0.5 rounded-md',
          'active:scale-100 hover:scale-105 transition-all duration-300',
          sizeClasses[size],
          fullWidth && 'w-full',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <button
          ref={ref}
          className={cn(
            'text-white bg-gradient-to-t from-black/50 to-black h-full w-full rounded',
            loading && 'cursor-wait'
          )}
          disabled={disabled || loading}
          {...props}
        >
          <span className={cn(
            'flex items-center justify-center gap-2',
            loading && 'opacity-0'
          )}>
            {children}
          </span>

          {loading && (
            <span className="absolute inset-0 flex items-center justify-center">
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
        </button>

        {/* Glow effect that rises on hover */}
        <div className="absolute -bottom-12 group-hover:-bottom-10 transition-all duration-200 left-1/2 -z-10 -translate-x-1/2 blur size-14 rounded-full bg-white" />
      </div>
    );
  }
);

ButtonGlowUp.displayName = 'ButtonGlowUp';

export default ButtonGlowUp;