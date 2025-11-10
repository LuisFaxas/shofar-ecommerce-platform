/**
 * ButtonConicShine Component
 * Conic gradient with shine animation
 */

'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonConicShineProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Full width button */
  fullWidth?: boolean;
  /** Loading state */
  loading?: boolean;
}

/**
 * Button with conic gradient and shine animation
 * Cyan and black gradient with animated shine effect
 */
export const ButtonConicShine = forwardRef<HTMLButtonElement, ButtonConicShineProps>(
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
      md: 'px-8 py-2.5 text-sm',
      lg: 'px-10 py-3 text-base'
    };

    return (
      <div
        className={cn(
          'conic-shine-gradient rounded-full p-0.5',
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

        {/* Conic gradient with shine animation */}
        <style jsx>{`
          @keyframes shine {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }

          .conic-shine-gradient {
            background: conic-gradient(
              from 0deg,
              #00F5FF,
              #000,
              #000,
              #00F5FF,
              #000,
              #000,
              #000,
              #00F5FF
            );
            background-size: 300% 300%;
            animation: shine 6s ease-out infinite;
          }
        `}</style>
      </div>
    );
  }
);

ButtonConicShine.displayName = 'ButtonConicShine';

export default ButtonConicShine;