/**
 * GlassPanel Component
 *
 * Glassmorphism panel with customizable blur and opacity.
 * Uses CSS custom properties defined in globals.css.
 *
 * Variants:
 * - default: Standard glass effect
 * - subtle: Less prominent glass effect
 * - solid: No glass effect, solid background
 */

import type { ReactNode, HTMLAttributes } from 'react';

type GlassPanelVariant = 'default' | 'subtle' | 'solid';

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: GlassPanelVariant;
  /** Padding preset */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Add hover effect */
  hoverable?: boolean;
  /** As a link/clickable card */
  as?: 'div' | 'article' | 'section';
}

const variantClasses: Record<GlassPanelVariant, string> = {
  default: 'glass-panel',
  subtle: 'glass-panel-subtle',
  solid: 'bg-[var(--peptide-bg)] border border-[var(--peptide-border)] rounded-[var(--radius-lg)]',
};

const paddingClasses: Record<string, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4 md:p-6',
  lg: 'p-6 md:p-8',
};

export function GlassPanel({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  as: Component = 'div',
  className = '',
  ...props
}: GlassPanelProps): JSX.Element {
  return (
    <Component
      className={`
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${hoverable ? 'transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * GlassCard - A hoverable card variant
 */
interface GlassCardProps extends Omit<GlassPanelProps, 'hoverable'> {
  /** Title text */
  title?: string;
  /** Description text */
  description?: string;
  /** Footer content */
  footer?: ReactNode;
  /** Header content (replaces title) */
  header?: ReactNode;
}

export function GlassCard({
  children,
  title,
  description,
  footer,
  header,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}: GlassCardProps): JSX.Element {
  return (
    <GlassPanel
      variant={variant}
      padding="none"
      hoverable
      className={className}
      {...props}
    >
      {/* Header */}
      {(header || title) && (
        <div className={`${paddingClasses[padding]} pb-0`}>
          {header || (
            <div>
              {title && (
                <h3 className="text-h4 text-[var(--peptide-fg)]">{title}</h3>
              )}
              {description && (
                <p className="mt-1 text-body-sm text-[var(--peptide-fg-muted)]">
                  {description}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Body */}
      <div className={paddingClasses[padding]}>{children}</div>

      {/* Footer */}
      {footer && (
        <div
          className={`
            ${paddingClasses[padding]} pt-0
            border-t border-[var(--peptide-border)]/50 mt-auto
          `}
        >
          {footer}
        </div>
      )}
    </GlassPanel>
  );
}

/**
 * GlassOverlay - Full-screen glass overlay for modals
 */
interface GlassOverlayProps {
  children: ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  className?: string;
}

export function GlassOverlay({
  children,
  isOpen,
  onClose,
  className = '',
}: GlassOverlayProps): JSX.Element | null {
  if (!isOpen) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50
        flex items-center justify-center
        ${className}
      `}
    >
      {/* Backdrop */}
      <div
        className="
          absolute inset-0
          bg-black/20 backdrop-blur-sm
        "
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/**
 * ColorSwatch - Display a color sample with glass effect
 */
interface ColorSwatchProps {
  color: string;
  name: string;
  value?: string;
  className?: string;
}

export function ColorSwatch({
  color,
  name,
  value,
  className = '',
}: ColorSwatchProps): JSX.Element {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div
        className="
          w-full aspect-square rounded-lg
          shadow-sm border border-[var(--peptide-border)]
        "
        style={{ backgroundColor: color }}
      />
      <div>
        <p className="text-sm font-medium text-[var(--peptide-fg)]">{name}</p>
        {value && (
          <p className="text-xs text-[var(--peptide-fg-muted)] font-mono">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}
