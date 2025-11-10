/**
 * ButtonRotatingPurple Component
 * Rotating purple-pink gradient effect button
 */

'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonRotatingPurpleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Full width button */
  fullWidth?: boolean;
  /** Loading state */
  loading?: boolean;
}

/**
 * Button with rotating purple-pink gradient effect
 * Bold gradient animation for primary CTAs
 */
export const ButtonRotatingPurple = forwardRef<HTMLButtonElement, ButtonRotatingPurpleProps>(
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
      sm: 'px-6 py-2 text-sm',
      md: 'px-8 py-3 text-sm',
      lg: 'px-10 py-4 text-base'
    };

    return (
      <div
        className={cn(
          'rotating-purple-gradient relative z-0 overflow-hidden p-0.5 flex items-center justify-center rounded-full',
          'hover:scale-105 transition duration-300 active:scale-100',
          fullWidth && 'w-full',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <button
          ref={ref}
          className={cn(
            sizeClasses[size],
            'text-white rounded-full font-medium bg-gray-800',
            fullWidth && 'w-full',
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
                className="animate-spin h-5 w-5 text-current"
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

        {/* Rotating gradient effect */}
        <style jsx>{`
          @keyframes rotate {
            100% {
              transform: rotate(1turn);
            }
          }

          .rotating-purple-gradient::before {
            content: '';
            position: absolute;
            z-index: -2;
            left: -50%;
            top: -50%;
            width: 200%;
            height: 200%;
            background-position: 100% 50%;
            background-repeat: no-repeat;
            background-size: 50% 30%;
            filter: blur(6px);
            background-image: linear-gradient(#FF0A7F, #780EFF);
            animation: rotate 4s linear infinite;
          }
        `}</style>
      </div>
    );
  }
);

ButtonRotatingPurple.displayName = 'ButtonRotatingPurple';

export default ButtonRotatingPurple;