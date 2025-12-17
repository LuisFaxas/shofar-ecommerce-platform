/**
 * GlassPanel Component
 *
 * Premium frosted glass panels optimized for light backgrounds.
 * Ultra-clean, Apple-like aesthetic for PEPTIDES research brand.
 *
 * Uses CSS custom properties defined in globals.css.
 *
 * Variants:
 * - default: Frosted glass with subtle indigo tint
 * - subtle: Less prominent glass effect
 * - solid: Clean white card with subtle shadow
 */

import type { ReactNode, HTMLAttributes } from "react";

type GlassPanelVariant = "default" | "subtle" | "solid";

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: GlassPanelVariant;
  /** Padding preset */
  padding?: "none" | "sm" | "md" | "lg";
  /** Add hover effect */
  hoverable?: boolean;
  /** Semantic element type */
  as?: "div" | "article" | "section";
}

const variantClasses: Record<GlassPanelVariant, string> = {
  default: "glass-panel",
  subtle: "glass-panel-subtle",
  solid: "solid-card",
};

const paddingClasses: Record<string, string> = {
  none: "",
  sm: "p-4",
  md: "p-5 md:p-6",
  lg: "p-6 md:p-8",
};

export function GlassPanel({
  children,
  variant = "default",
  padding = "md",
  hoverable = false,
  as: Component = "div",
  className = "",
  ...props
}: GlassPanelProps): JSX.Element {
  const hoverStyles = hoverable
    ? "cursor-pointer transition-all duration-300 hover:shadow-glass-hover hover:-translate-y-0.5 hover:border-[var(--glass-border-hover)]"
    : "";

  return (
    <Component
      className={`
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${hoverStyles}
        ${className}
      `
        .trim()
        .replace(/\s+/g, " ")}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * GlassCard - A structured card with header, body, and footer
 */
interface GlassCardProps extends Omit<GlassPanelProps, "hoverable"> {
  /** Title text */
  title?: string;
  /** Description text */
  description?: string;
  /** Footer content */
  footer?: ReactNode;
  /** Header content (replaces title) */
  header?: ReactNode;
  /** Disable hover effect */
  disableHover?: boolean;
}

export function GlassCard({
  children,
  title,
  description,
  footer,
  header,
  variant = "default",
  padding = "md",
  disableHover = false,
  className = "",
  ...props
}: GlassCardProps): JSX.Element {
  return (
    <GlassPanel
      variant={variant}
      padding="none"
      hoverable={!disableHover}
      className={`flex flex-col ${className}`}
      {...props}
    >
      {/* Header */}
      {(header || title) && (
        <div className={`${paddingClasses[padding]} pb-0`}>
          {header || (
            <div>
              {title && (
                <h3 className="text-h4 text-[var(--peptide-fg-strong)]">
                  {title}
                </h3>
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
      <div className={`${paddingClasses[padding]} flex-1`}>{children}</div>

      {/* Footer */}
      {footer && (
        <div
          className={`
            ${paddingClasses[padding]} pt-4
            border-t border-[var(--peptide-border-light)]
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
  className = "",
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
          bg-[var(--peptide-fg)]/10 backdrop-blur-sm
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
 * ColorSwatch - Display a color sample
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
  className = "",
}: ColorSwatchProps): JSX.Element {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div
        className="
          w-full aspect-square rounded-xl
          shadow-card border border-[var(--peptide-border)]
          transition-shadow duration-200 hover:shadow-card-hover
        "
        style={{ backgroundColor: color }}
      />
      <div>
        <p className="text-sm font-medium text-[var(--peptide-fg-strong)]">
          {name}
        </p>
        {value && (
          <p className="text-xs text-[var(--peptide-fg)] font-mono">{value}</p>
        )}
      </div>
    </div>
  );
}

/**
 * SpecCard - A minimal card for displaying specifications
 */
interface SpecCardProps {
  label: string;
  value: string | ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function SpecCard({
  label,
  value,
  icon,
  className = "",
}: SpecCardProps): JSX.Element {
  return (
    <div
      className={`
        flex items-center gap-3 p-3
        bg-[var(--peptide-bg-alt)] rounded-lg
        border border-[var(--peptide-border-light)]
        ${className}
      `}
    >
      {icon && (
        <div className="flex-shrink-0 text-[var(--peptide-primary)]">
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-overline">{label}</p>
        <p className="text-body-sm font-medium text-[var(--peptide-fg-strong)] truncate">
          {value}
        </p>
      </div>
    </div>
  );
}
