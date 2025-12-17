/**
 * Button Component
 *
 * Variants:
 * - primary: Main CTA (gradient background)
 * - secondary: Secondary action (outline)
 * - ghost: Minimal styling
 * - danger: Destructive action
 *
 * Sizes: sm, md, lg
 *
 * Supports `asChild` pattern for rendering as a different element (e.g., Link)
 */

import {
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
  Children,
  cloneElement,
  isValidElement,
} from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  /** Show loading spinner */
  isLoading?: boolean;
  /** Full width button */
  fullWidth?: boolean;
  /** Left icon */
  leftIcon?: ReactNode;
  /** Right icon */
  rightIcon?: ReactNode;
  /**
   * Render as child element instead of button.
   * Useful for wrapping Link components.
   */
  asChild?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-gradient-to-r from-[var(--peptide-primary)] to-[var(--peptide-secondary)]
    text-white font-medium
    hover:from-[var(--peptide-primary-dark)] hover:to-[var(--peptide-secondary-dark)]
    shadow-md hover:shadow-lg
    hover:shadow-[var(--peptide-primary)]/25
  `,
  secondary: `
    bg-transparent border-2 border-[var(--peptide-primary)]
    text-[var(--peptide-primary)] font-medium
    hover:bg-[var(--peptide-primary)] hover:text-white
    transition-colors
  `,
  ghost: `
    bg-transparent
    text-[var(--peptide-fg-muted)]
    hover:text-[var(--peptide-fg)] hover:bg-[var(--peptide-bg-alt)]
  `,
  danger: `
    bg-red-500 text-white font-medium
    hover:bg-red-600
    shadow-md hover:shadow-lg hover:shadow-red-500/25
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm rounded-md gap-1.5",
  md: "px-4 py-2 text-sm rounded-lg gap-2",
  lg: "px-6 py-3 text-base rounded-lg gap-2",
};

/**
 * Loading spinner
 */
function LoadingSpinner(): JSX.Element {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
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
  );
}

/**
 * Get combined className for button styling
 */
function getButtonClassName(
  variant: ButtonVariant,
  size: ButtonSize,
  fullWidth: boolean,
  isDisabled: boolean,
  className: string,
): string {
  return `
    inline-flex items-center justify-center
    transition-all duration-200
    focus-ring
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${fullWidth ? "w-full" : ""}
    ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  className = "",
  asChild = false,
  ...props
}: ButtonProps): JSX.Element {
  const isDisabled = disabled || isLoading;
  const buttonClassName = getButtonClassName(
    variant,
    size,
    fullWidth,
    isDisabled,
    className,
  );

  // Build the inner content
  const innerContent = (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : leftIcon ? (
        <span className="flex-shrink-0">{leftIcon}</span>
      ) : null}
      <span>{asChild ? null : children}</span>
      {rightIcon && !isLoading && (
        <span className="flex-shrink-0">{rightIcon}</span>
      )}
    </>
  );

  // If asChild, clone the child element with button styles
  if (asChild) {
    const child = Children.only(children);
    if (isValidElement(child)) {
      // Get the child's existing className
      const childProps = child.props as {
        className?: string;
        children?: ReactNode;
      };
      const existingClassName = childProps.className || "";
      const mergedClassName = `${buttonClassName} ${existingClassName}`.trim();

      return cloneElement(
        child as ReactElement<{ className?: string; children?: ReactNode }>,
        {
          className: mergedClassName,
          children: (
            <>
              {leftIcon && !isLoading && (
                <span className="flex-shrink-0">{leftIcon}</span>
              )}
              {isLoading && <LoadingSpinner />}
              {childProps.children}
              {rightIcon && !isLoading && (
                <span className="flex-shrink-0">{rightIcon}</span>
              )}
            </>
          ),
        },
      );
    }
  }

  return (
    <button disabled={isDisabled} className={buttonClassName} {...props}>
      {innerContent}
    </button>
  );
}
