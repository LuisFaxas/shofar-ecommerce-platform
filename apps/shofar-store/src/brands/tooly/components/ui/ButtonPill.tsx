/**
 * ButtonPill Component
 * Work Order 2.5.REBOOT
 *
 * Resend-inspired pill button for compact CTAs
 * Minimal footprint with subtle glass effect
 */

'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonPillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'error';
  /** Button size - pills are naturally compact */
  size?: 'xs' | 'sm' | 'md';
  /** Loading state */
  loading?: boolean;
  /** Icon to display (centered if no children) */
  icon?: React.ReactNode;
  /** Pulse animation for attention */
  pulse?: boolean;
}

/**
 * Resend-inspired pill button for minimal, efficient CTAs
 * Perfect for inline actions, tags, and compact interfaces
 */
export const ButtonPill = forwardRef<HTMLButtonElement, ButtonPillProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'sm',
      loading = false,
      disabled = false,
      icon,
      pulse = false,
      children,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      xs: 'px-2 py-0.5 text-xs gap-1',
      sm: 'px-3 py-1 text-sm gap-1.5',
      md: 'px-4 py-1.5 text-base gap-2'
    };

    const baseClasses = cn(
      // Base structure
      'inline-flex items-center justify-center',
      'font-medium transition-all duration-200',
      'rounded-full', // Pill shape
      'whitespace-nowrap',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',

      // Size
      sizeClasses[size],

      // Loading state
      loading && 'cursor-wait',

      // Pulse effect
      pulse && 'animate-pulse'
    );

    const variantClasses = {
      primary: cn(
        // Subtle glass with brand accent
        'bg-white/[0.12] backdrop-blur-sm',
        'border border-white/[0.18]',
        'text-white',
        'shadow-sm',

        // Hover state - slight glow
        'hover:bg-white/[0.16]',
        'hover:border-white/[0.24]',
        'hover:shadow-[0_2px_12px_rgba(255,255,255,0.08)]',

        // Active state
        'active:bg-white/[0.10]',
        'active:scale-[0.97]',

        // Focus
        'focus-visible:ring-white/40'
      ),

      secondary: cn(
        // Even more subtle
        'bg-white/[0.06] backdrop-blur-sm',
        'border border-white/[0.10]',
        'text-white/80',

        // Hover state
        'hover:bg-white/[0.08]',
        'hover:border-white/[0.14]',
        'hover:text-white',

        // Active state
        'active:bg-white/[0.04]',
        'active:scale-[0.97]',

        // Focus
        'focus-visible:ring-white/30'
      ),

      ghost: cn(
        // Minimal, text-like
        'bg-transparent',
        'text-white/60',
        'hover:text-white',
        'hover:bg-white/[0.04]',

        // Active state
        'active:bg-white/[0.02]',

        // Focus
        'focus-visible:ring-white/20'
      ),

      success: cn(
        // Green accent for success states
        'bg-emerald-500/[0.15] backdrop-blur-sm',
        'border border-emerald-500/[0.25]',
        'text-emerald-400',

        // Hover state
        'hover:bg-emerald-500/[0.20]',
        'hover:border-emerald-500/[0.35]',

        // Active state
        'active:bg-emerald-500/[0.12]',
        'active:scale-[0.97]',

        // Focus
        'focus-visible:ring-emerald-500/40'
      ),

      error: cn(
        // Red accent for error states
        'bg-red-500/[0.15] backdrop-blur-sm',
        'border border-red-500/[0.25]',
        'text-red-400',

        // Hover state
        'hover:bg-red-500/[0.20]',
        'hover:border-red-500/[0.35]',

        // Active state
        'active:bg-red-500/[0.12]',
        'active:scale-[0.97]',

        // Focus
        'focus-visible:ring-red-500/40'
      )
    };

    // If only icon and no children, make it circular
    const isIconOnly = icon && !children;
    const iconOnlyClasses = isIconOnly ? cn(
      'aspect-square',
      size === 'xs' && 'p-1',
      size === 'sm' && 'p-1.5',
      size === 'md' && 'p-2'
    ) : '';

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          iconOnlyClasses,
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {/* Content wrapper */}
        <span className={cn(
          'relative flex items-center justify-center',
          loading && 'opacity-0'
        )}>
          {icon && (
            <span className={cn(
              'inline-flex',
              children && 'mr-1'
            )}>
              {icon}
            </span>
          )}
          {children}
        </span>

        {/* Loading spinner - minimal and centered */}
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg
              className={cn(
                'animate-spin text-current',
                size === 'xs' && 'h-3 w-3',
                size === 'sm' && 'h-3.5 w-3.5',
                size === 'md' && 'h-4 w-4'
              )}
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

ButtonPill.displayName = 'ButtonPill';

// Compound component for pill groups
export const ButtonPillGroup: React.FC<{
  children: React.ReactNode;
  className?: string;
  gap?: 'xs' | 'sm' | 'md';
}> = ({ children, className, gap = 'sm' }) => {
  const gapClasses = {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-3'
  };

  return (
    <div className={cn(
      'inline-flex items-center flex-wrap',
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
};

ButtonPillGroup.displayName = 'ButtonPillGroup';

export default ButtonPill;