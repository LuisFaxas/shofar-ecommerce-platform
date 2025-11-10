/**
 * Watermark Component
 * Work Order 2.5.REBOOT
 *
 * Large background watermark with optional spotlight tracking
 * Provides subtle branding in the background
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface WatermarkProps {
  /** Text to display as watermark */
  text?: string;
  /** Enable spotlight tracking */
  spotlight?: boolean;
  /** Rotation angle in degrees */
  rotate?: number;
  /** Opacity level */
  opacity?: number;
  /** Position variant */
  position?: 'center' | 'top-right' | 'bottom-left' | 'custom';
  /** Custom position (when position="custom") */
  customPosition?: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
  };
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fill';
  /** Custom className */
  className?: string;
}

/**
 * Large background watermark for subtle branding
 * Can include spotlight tracking for interactive effect
 */
export const Watermark: React.FC<WatermarkProps> = ({
  text = 'TOOLY',
  spotlight = true,
  rotate = -15,
  opacity = 0.03,
  position = 'center',
  customPosition,
  size = 'lg',
  className
}) => {
  const sizeClasses = {
    sm: 'text-[6rem]',
    md: 'text-[10rem]',
    lg: 'text-[clamp(10rem,30vw,20rem)]',
    xl: 'text-[clamp(15rem,40vw,30rem)]',
    fill: 'text-[clamp(20rem,50vw,40rem)]'
  };

  const positionStyles = {
    center: {
      top: '50%',
      left: '50%',
      transform: `translate(-50%, -50%) rotate(${rotate}deg)`
    },
    'top-right': {
      top: '10%',
      right: '-10%',
      transform: `rotate(${rotate}deg)`
    },
    'bottom-left': {
      bottom: '10%',
      left: '-10%',
      transform: `rotate(${rotate}deg)`
    },
    custom: {
      ...customPosition,
      transform: `rotate(${rotate}deg)`
    }
  };

  return (
    <div
      className={cn(
        'watermark-backdrop',
        'fixed inset-0 pointer-events-none z-0 overflow-hidden',
        spotlight && 'spotlight',
        className
      )}
      style={{
        '--watermark-opacity': opacity
      } as React.CSSProperties}
    >
      {/* Main watermark text */}
      <div
        className={cn(
          'absolute whitespace-nowrap',
          sizeClasses[size],
          'font-black uppercase',
          'text-[var(--color-gm-900)]',
          'select-none',
          'transition-opacity duration-1000'
        )}
        style={{
          ...positionStyles[position],
          opacity: `var(--watermark-opacity, ${opacity})`,
          letterSpacing: '-0.05em'
        }}
        aria-hidden="true"
      >
        {text}
      </div>

      {/* Spotlight effect layer */}
      {spotlight && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(
              circle 400px at var(--pointer-x, 50%) var(--pointer-y, 50%),
              rgba(255, 255, 255, 0.03) 0%,
              transparent 70%
            )`,
            mixBlendMode: 'soft-light',
            transition: 'background 0.3s ease-out'
          }}
        />
      )}

      {/* Optional scanning line effect */}
      {spotlight && (
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            background: `linear-gradient(
              180deg,
              transparent 0%,
              transparent 48%,
              rgba(20, 199, 255, 0.1) 50%,
              transparent 52%,
              transparent 100%
            )`,
            backgroundSize: '100% 200%',
            animation: 'scan 8s linear infinite'
          }}
        />
      )}
    </div>
  );
};

// Grid pattern watermark variant
export const WatermarkGrid: React.FC<{
  text?: string;
  spacing?: 'sm' | 'md' | 'lg';
  opacity?: number;
  className?: string;
}> = ({
  text = 'TOOLY',
  spacing = 'md',
  opacity = 0.02,
  className
}) => {
  const spacingClasses = {
    sm: 'gap-8',
    md: 'gap-16',
    lg: 'gap-24'
  };

  return (
    <div
      className={cn(
        'fixed inset-0 pointer-events-none z-0 overflow-hidden',
        className
      )}
      style={{
        opacity
      }}
    >
      <div
        className={cn(
          'absolute inset-[-50%]',
          'grid grid-cols-4',
          spacingClasses[spacing],
          'rotate-[-15deg]'
        )}
      >
        {Array.from({ length: 16 }).map((_, i) => (
          <span
            key={i}
            className="text-[3rem] font-black uppercase text-[var(--color-gm-900)] select-none"
            style={{ letterSpacing: '-0.05em' }}
            aria-hidden="true"
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};

// Dynamic watermark with animated text
export const WatermarkAnimated: React.FC<{
  words?: string[];
  duration?: number;
  opacity?: number;
  className?: string;
}> = ({
  words = ['TOOLY', 'INDUSTRIAL', 'GRADE', 'TOOLS'],
  duration = 4000,
  opacity = 0.03,
  className
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, [words, duration]);

  return (
    <Watermark
      text={words[currentIndex]}
      opacity={opacity}
      className={cn('transition-all duration-500', className)}
    />
  );
};

// Add scanning animation to global CSS
const scanKeyframes = `
  @keyframes scan {
    from {
      background-position: 0% 0%;
    }
    to {
      background-position: 0% 100%;
    }
  }
`;

// Inject keyframes on component mount
if (typeof window !== 'undefined' && !document.querySelector('#watermark-keyframes')) {
  const style = document.createElement('style');
  style.id = 'watermark-keyframes';
  style.textContent = scanKeyframes;
  document.head.appendChild(style);
}

Watermark.displayName = 'Watermark';
WatermarkGrid.displayName = 'WatermarkGrid';
WatermarkAnimated.displayName = 'WatermarkAnimated';

export default Watermark;