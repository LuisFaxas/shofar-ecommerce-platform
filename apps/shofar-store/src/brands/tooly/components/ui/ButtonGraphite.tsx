/**
 * ButtonGraphite Component
 * Work Order 2.5.REBOOT
 *
 * Graphite-inspired button with rainbow ring on hover
 * Reactive glow that follows pointer position
 */

'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonGraphiteProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variant - primary shows rainbow ring on hover */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Full width button */
  fullWidth?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Icon to display before text */
  leftIcon?: React.ReactNode;
  /** Icon to display after text */
  rightIcon?: React.ReactNode;
}

/**
 * Graphite-inspired button with reactive rainbow ring
 * Uses CSS variables from usePointerVars for reactive animations
 */
export const ButtonGraphite = forwardRef<HTMLButtonElement, ButtonGraphiteProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };

    const baseClasses = cn(
      // Base structure
      'relative inline-flex items-center justify-center',
      'font-medium transition-all duration-200',
      'rounded-lg',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',

      // Size
      sizeClasses[size],

      // Full width
      fullWidth && 'w-full',

      // Loading state
      loading && 'cursor-wait'
    );

    const variantClasses = {
      primary: cn(
        // Glass effect with cool tint
        'bg-white/[0.08] backdrop-blur-md',
        'border border-white/[0.14]',
        'text-white',
        'shadow-[0_6px_18px_rgba(0,0,0,0.25)]',

        // Rainbow ring container
        'before:absolute before:inset-[-1px] before:rounded-lg',
        'before:opacity-0 before:transition-opacity before:duration-300',

        // Rainbow gradient border on hover
        'before:bg-[conic-gradient(from_var(--angle),#ff6231,#ffb931,#14c7ff,#1061ff,#ff6231)]',
        'before:animate-[spin_3s_linear_infinite]',

        // Mask to create border effect
        'after:absolute after:inset-0 after:rounded-lg',
        'after:bg-white/[0.08] after:backdrop-blur-md',

        // Hover state
        'hover:before:opacity-100',
        'hover:bg-white/[0.10]',
        'hover:border-transparent',
        'hover:shadow-[0_6px_24px_rgba(0,0,0,0.3)]',

        // Active state
        'active:bg-white/[0.06]',
        'active:scale-[0.98]',

        // Focus
        'focus-visible:ring-[var(--color-brand)]'
      ),

      secondary: cn(
        // Subtle glass effect
        'bg-white/[0.04] backdrop-blur-sm',
        'border border-white/[0.08]',
        'text-white/80',

        // Hover state
        'hover:bg-white/[0.06]',
        'hover:border-white/[0.12]',
        'hover:text-white',

        // Active state
        'active:bg-white/[0.03]',
        'active:scale-[0.98]',

        // Focus
        'focus-visible:ring-white/30'
      ),

      ghost: cn(
        // Minimal style
        'bg-transparent',
        'text-white/60',

        // Hover state
        'hover:bg-white/[0.04]',
        'hover:text-white',

        // Active state
        'active:bg-white/[0.02]',

        // Focus
        'focus-visible:ring-white/20'
      )
    };

    // Add reactive glow styles for primary variant
    const reactiveGlowStyles = variant === 'primary' ? {
      '--glow-opacity': 'calc(1 - var(--pointer-from-center, 0.5))',
      boxShadow: `
        0 6px 18px rgba(0, 0, 0, 0.25),
        0 0 40px rgba(255, 98, 49, calc(0.2 * var(--glow-opacity))),
        0 0 60px rgba(20, 199, 255, calc(0.15 * var(--glow-opacity)))
      `
    } as React.CSSProperties : {};

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          variant === 'primary' && 'button-graphite',
          className
        )}
        style={reactiveGlowStyles}
        disabled={disabled || loading}
        {...props}
      >
        {/* Content wrapper - above the rainbow border */}
        <span className={cn(
          'relative z-10 flex items-center justify-center gap-2',
          loading && 'opacity-0'
        )}>
          {leftIcon && <span className="inline-flex">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="inline-flex">{rightIcon}</span>}
        </span>

        {/* Loading spinner */}
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
    );
  }
);

ButtonGraphite.displayName = 'ButtonGraphite';

export default ButtonGraphite;