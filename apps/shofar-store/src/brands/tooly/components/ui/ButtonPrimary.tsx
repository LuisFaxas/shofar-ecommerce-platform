/**
 * ButtonPrimary Component
 * Uiverse-inspired gradient border button with hover blur effect
 * Adapted for TOOLY's rainbow brand identity
 */

'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonPrimaryProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Full width button */
  fullWidth?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Show arrow icon */
  showArrow?: boolean;
}

/**
 * Primary button with static rainbow gradient border and blur glow on hover
 * Clean design without spinning animations
 */
export const ButtonPrimary = forwardRef<HTMLButtonElement, ButtonPrimaryProps>(
  (
    {
      className,
      size = 'md',
      fullWidth = false,
      loading = false,
      disabled = false,
      showArrow = false,
      children,
      ...props
    },
    ref
  ) => {
    // Container size classes (font-size drives em-based sizing)
    const containerSizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    };

    // Button padding classes
    const buttonSizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-5 py-2.5 text-base',
      lg: 'px-6 py-3 text-lg'
    };

    return (
      <>
        <div
          className={cn(
            'button-container',
            'relative inline-flex',
            'p-[2px] rounded-[0.9em]',
            'transition-all duration-[400ms] ease-out',
            'shadow-[2px_2px_3px_#000000b4]',
            containerSizeClasses[size],
            fullWidth && 'w-full',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
        >
          <button
            ref={ref}
            className={cn(
              buttonSizeClasses[size],
              'relative w-full rounded-[0.7em]',
              'bg-[#0b0e14] text-white font-medium',
              'border-none cursor-pointer',
              'inline-flex items-center justify-center gap-2',
              disabled && 'cursor-not-allowed',
              loading && 'cursor-wait'
            )}
            disabled={disabled || loading}
            {...props}
          >
            {loading ? (
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
            ) : (
              <>
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
              </>
            )}
          </button>
        </div>

        <style jsx>{`
          .button-container {
            background: linear-gradient(90deg, #02fcef 0%, #ffb52b 50%, #a02bfe 100%);
          }

          .button-container::before {
            content: "";
            position: absolute;
            inset: 0;
            margin: auto;
            border-radius: 0.9em;
            background: linear-gradient(90deg, #02fcef 0%, #ffb52b 50%, #a02bfe 100%);
            z-index: -10;
            filter: blur(0);
            transition: filter 0.4s ease;
            pointer-events: none;
          }

          .button-container:hover::before {
            filter: blur(1.2em);
          }

          .button-container:active::before {
            filter: blur(0.2em);
          }

          /* Respect reduced motion preference */
          @media (prefers-reduced-motion: reduce) {
            .button-container::before {
              transition: none;
            }

            .button-container:hover::before,
            .button-container:active::before {
              filter: blur(0) !important;
            }
          }

          /* Disabled state - no hover effects */
          .button-container.opacity-50::before {
            display: none;
          }
        `}</style>
      </>
    );
  }
);

ButtonPrimary.displayName = 'ButtonPrimary';

export default ButtonPrimary;