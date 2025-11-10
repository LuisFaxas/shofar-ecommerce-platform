/**
 * ToolyWordmark Component
 * Work Order 2.5.REBOOT
 *
 * TOOLY wordmark with chromatic aberration effect
 * Subtle split-channel glitch for industrial tech aesthetic
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ToolyWordmarkProps {
  /** Size variant of the wordmark */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Enable chromatic aberration effect */
  aberration?: boolean;
  /** Monochrome mode (no color channels) */
  mono?: boolean;
  /** Custom className */
  className?: string;
  /** Animation on hover */
  animate?: boolean;
}

/**
 * TOOLY wordmark with optional chromatic aberration
 * Creates a subtle RGB channel split for tech aesthetic
 */
export const ToolyWordmark: React.FC<ToolyWordmarkProps> = ({
  size = 'md',
  aberration = true,
  mono = false,
  className,
  animate = true
}) => {
  const sizeClasses = {
    xs: 'text-xl',
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
    xl: 'text-8xl',
    '2xl': 'text-9xl'
  };

  const letterSpacing = {
    xs: 'tracking-tight',
    sm: 'tracking-tight',
    md: 'tracking-tighter',
    lg: 'tracking-tighter',
    xl: 'tracking-[-0.05em]',
    '2xl': 'tracking-[-0.06em]'
  };

  if (!aberration) {
    // Simple wordmark without effects
    return (
      <div className={cn(
        'relative inline-block',
        sizeClasses[size],
        className
      )}>
        <span className={cn(
          'font-black uppercase',
          letterSpacing[size],
          'text-white',
          'transition-all duration-300',
          animate && 'hover:tracking-normal'
        )}>
          TOOLY
        </span>
      </div>
    );
  }

  // Chromatic aberration with layered channels
  return (
    <div className={cn(
      'relative inline-block',
      'wordmark-aberration',
      sizeClasses[size],
      animate && 'group',
      className
    )}>
      {/* Base layer - main text */}
      <span className={cn(
        'font-black uppercase',
        letterSpacing[size],
        'text-white',
        'relative z-20'
      )}>
        TOOLY
      </span>

      {/* Red channel offset */}
      {!mono && (
        <span
          className={cn(
            'absolute inset-0',
            'font-black uppercase',
            letterSpacing[size],
            'text-[#ff6231]',
            'mix-blend-screen opacity-60',
            'transform translate-x-[0.5px] -translate-y-[0.5px]',
            'z-10',
            'pointer-events-none',
            animate && 'transition-transform duration-300',
            animate && 'group-hover:translate-x-[1px] group-hover:-translate-y-[1px]'
          )}
          aria-hidden="true"
        >
          TOOLY
        </span>
      )}

      {/* Blue channel offset */}
      {!mono && (
        <span
          className={cn(
            'absolute inset-0',
            'font-black uppercase',
            letterSpacing[size],
            'text-[#14c7ff]',
            'mix-blend-screen opacity-60',
            'transform -translate-x-[0.5px] translate-y-[0.5px]',
            'z-10',
            'pointer-events-none',
            animate && 'transition-transform duration-300',
            animate && 'group-hover:-translate-x-[1px] group-hover:translate-y-[1px]'
          )}
          aria-hidden="true"
        >
          TOOLY
        </span>
      )}

      {/* Subtle glow layer */}
      <span
        className={cn(
          'absolute inset-0',
          'font-black uppercase',
          letterSpacing[size],
          'text-white',
          'blur-[2px] opacity-30',
          'z-0',
          'pointer-events-none',
          animate && 'transition-all duration-300',
          animate && 'group-hover:blur-[4px] group-hover:opacity-40'
        )}
        aria-hidden="true"
      >
        TOOLY
      </span>
    </div>
  );
};

// Alternative stacked version for vertical layouts
export const ToolyWordmarkStacked: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  aberration?: boolean;
  tagline?: string;
}> = ({
  size = 'md',
  className,
  aberration = true,
  tagline = 'INDUSTRIAL GRADE TOOLS'
}) => {
  const sizes = {
    sm: {
      wordmark: 'text-3xl',
      tagline: 'text-[10px]',
      gap: 'gap-1'
    },
    md: {
      wordmark: 'text-5xl',
      tagline: 'text-xs',
      gap: 'gap-2'
    },
    lg: {
      wordmark: 'text-7xl',
      tagline: 'text-sm',
      gap: 'gap-3'
    }
  };

  return (
    <div className={cn(
      'flex flex-col items-center',
      sizes[size].gap,
      className
    )}>
      <ToolyWordmark
        size={size === 'sm' ? 'sm' : size === 'md' ? 'md' : 'lg'}
        aberration={aberration}
      />
      {tagline && (
        <span className={cn(
          sizes[size].tagline,
          'font-medium tracking-[0.2em] uppercase',
          'text-white/50',
          'transition-colors duration-300',
          'hover:text-white/70'
        )}>
          {tagline}
        </span>
      )}
    </div>
  );
};

ToolyWordmark.displayName = 'ToolyWordmark';
ToolyWordmarkStacked.displayName = 'ToolyWordmarkStacked';

export default ToolyWordmark;