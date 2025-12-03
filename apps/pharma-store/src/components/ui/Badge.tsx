/**
 * Badge Component
 *
 * Small status indicators and tags.
 *
 * Variants:
 * - default: Neutral/info
 * - primary: Brand primary color
 * - secondary: Brand secondary color
 * - success: Green/positive
 * - warning: Yellow/caution
 * - danger: Red/error
 *
 * Styles:
 * - solid: Filled background
 * - outline: Border only
 * - subtle: Light background
 */

import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
type BadgeStyle = 'solid' | 'outline' | 'subtle';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  badgeStyle?: BadgeStyle;
  size?: BadgeSize;
  /** Optional icon on the left */
  icon?: ReactNode;
  /** Make badge removable (shows X button) */
  onRemove?: () => void;
  className?: string;
}

const variantColors: Record<BadgeVariant, { solid: string; outline: string; subtle: string }> = {
  default: {
    solid: 'bg-[var(--peptide-fg-muted)] text-white',
    outline: 'border-[var(--peptide-border)] text-[var(--peptide-fg-muted)]',
    subtle: 'bg-[var(--peptide-bg-alt)] text-[var(--peptide-fg-muted)]',
  },
  primary: {
    solid: 'bg-[var(--peptide-primary)] text-white',
    outline: 'border-[var(--peptide-primary)] text-[var(--peptide-primary)]',
    subtle: 'bg-[var(--peptide-primary)]/10 text-[var(--peptide-primary)]',
  },
  secondary: {
    solid: 'bg-[var(--peptide-secondary)] text-white',
    outline: 'border-[var(--peptide-secondary)] text-[var(--peptide-secondary)]',
    subtle: 'bg-[var(--peptide-secondary)]/10 text-[var(--peptide-secondary)]',
  },
  success: {
    solid: 'bg-[var(--peptide-accent)] text-white',
    outline: 'border-[var(--peptide-accent)] text-[var(--peptide-accent)]',
    subtle: 'bg-[var(--peptide-accent)]/10 text-[var(--peptide-accent)]',
  },
  warning: {
    solid: 'bg-amber-500 text-white',
    outline: 'border-amber-500 text-amber-600',
    subtle: 'bg-amber-500/10 text-amber-600',
  },
  danger: {
    solid: 'bg-red-500 text-white',
    outline: 'border-red-500 text-red-500',
    subtle: 'bg-red-500/10 text-red-500',
  },
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
};

/**
 * Close icon for removable badges
 */
function CloseIcon({ className = '' }: { className?: string }): JSX.Element {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function Badge({
  children,
  variant = 'default',
  badgeStyle = 'subtle',
  size = 'md',
  icon,
  onRemove,
  className = '',
}: BadgeProps): JSX.Element {
  const colorStyles = variantColors[variant][badgeStyle];
  const borderStyle = badgeStyle === 'outline' ? 'border' : '';

  return (
    <span
      className={`
        inline-flex items-center gap-1
        font-medium rounded-full
        ${sizeStyles[size]}
        ${colorStyles}
        ${borderStyle}
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="
            ml-0.5 -mr-0.5 p-0.5 rounded-full
            hover:bg-black/10 transition-colors
            focus:outline-none focus:ring-1 focus:ring-current
          "
          aria-label="Remove"
        >
          <CloseIcon />
        </button>
      )}
    </span>
  );
}

/**
 * Pill variant - larger, more prominent
 */
interface PillProps extends Omit<BadgeProps, 'size'> {
  /** Make the pill interactive (hover states) */
  interactive?: boolean;
}

export function Pill({
  children,
  variant = 'default',
  badgeStyle = 'subtle',
  icon,
  onRemove,
  interactive = false,
  className = '',
}: PillProps): JSX.Element {
  const colorStyles = variantColors[variant][badgeStyle];
  const borderStyle = badgeStyle === 'outline' ? 'border' : '';

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        px-3 py-1.5 text-sm font-medium rounded-full
        ${colorStyles}
        ${borderStyle}
        ${interactive ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="
            ml-0.5 -mr-1 p-0.5 rounded-full
            hover:bg-black/10 transition-colors
            focus:outline-none focus:ring-1 focus:ring-current
          "
          aria-label="Remove"
        >
          <CloseIcon className="w-3.5 h-3.5" />
        </button>
      )}
    </span>
  );
}
