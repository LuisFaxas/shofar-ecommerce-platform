/**
 * TOOLY Design System - Button Component
 * Work Order 2.5.1 - Industrial Refinement
 *
 * Crisp buttons with micro-bevel highlight and precision styling
 * Optimized for dark gunmetal surfaces
 */

import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Full width button */
  fullWidth?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Icon to display before children */
  leftIcon?: ReactNode;
  /** Icon to display after children */
  rightIcon?: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Button component with TOOLY brand styling
 *
 * @example
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      leftIcon,
      rightIcon,
      className = '',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Base classes that apply to all buttons - industrial precision
    const baseClasses = `
      inline-flex items-center justify-center
      font-semibold tracking-tight
      transition-all duration-[160ms] ease-out
      rounded-[10px] cursor-pointer
      disabled:opacity-40 disabled:cursor-not-allowed
      relative overflow-hidden
      focus:outline-none focus:ring-[3px] focus:ring-offset-2
      focus:ring-offset-gm-950
    `;

    // Variant-specific styles - FLAT DESIGN with glassmorphism
    const variants = {
      primary: `
        bg-brand-primary/90 text-white
        backdrop-blur-md border border-brand-primary/50
        hover:bg-brand-primary hover:border-brand-primary
        active:bg-brand-primary-dark
        focus:ring-brand-primary/40
      `,
      secondary: `
        bg-brand-secondary/90 text-white
        backdrop-blur-md border border-brand-secondary/50
        hover:bg-brand-secondary hover:border-brand-secondary
        active:bg-brand-secondary-dark
        focus:ring-brand-secondary/40
      `,
      outline: `
        bg-transparent backdrop-blur-sm
        border border-gm-400 text-gm-100
        hover:bg-gm-900/50 hover:border-gm-300
        active:bg-gm-800/50
        focus:ring-gm-400/40
      `,
      ghost: `
        bg-transparent text-gm-200
        hover:bg-gm-900/30 hover:text-gm-100
        active:bg-gm-800/30
        focus:ring-gm-400/40
      `,
      glass: `
        glass text-gm-100
        hover:text-white hover:bg-white/10
        focus:ring-white/20
        border border-white/20
      `
    };

    // Size-specific styles - consistent industrial feel
    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-base gap-2',
      lg: 'px-6 py-3 text-lg gap-2.5'
    };

    // Width modifier
    const widthClass = fullWidth ? 'w-full' : '';

    // Loading spinner (using CSS animation)
    const loadingSpinner = loading ? (
      <span
        className="absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinner" />
      </span>
    ) : null;

    // Content visibility when loading
    const contentClass = loading ? 'opacity-0' : '';

    return (
      <button
        ref={ref}
        className={`
          ${baseClasses}
          ${variants[variant]}
          ${sizes[size]}
          ${widthClass}
          ${className}
        `.replace(/\s+/g, ' ').trim()}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loadingSpinner}
        <span className={`inline-flex items-center gap-2 ${contentClass}`}>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

/**
 * Button Group component for grouping related buttons
 */
export interface ButtonGroupProps {
  children: ReactNode;
  /** Orientation of the button group */
  orientation?: 'horizontal' | 'vertical';
  /** Whether buttons should be attached */
  attached?: boolean;
  className?: string;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = 'horizontal',
  attached = false,
  className = ''
}) => {
  const orientationClass = orientation === 'vertical' ? 'flex-col' : 'flex-row';
  const attachedClass = attached
    ? orientation === 'vertical'
      ? '[&>button]:rounded-none [&>button:first-child]:rounded-t-lg [&>button:last-child]:rounded-b-lg [&>button:not(:first-child)]:-mt-[1px]'
      : '[&>button]:rounded-none [&>button:first-child]:rounded-l-lg [&>button:last-child]:rounded-r-lg [&>button:not(:first-child)]:-ml-[1px]'
    : orientation === 'vertical'
      ? 'gap-2'
      : 'gap-2';

  return (
    <div
      className={`inline-flex ${orientationClass} ${attachedClass} ${className}`}
      role="group"
    >
      {children}
    </div>
  );
};

ButtonGroup.displayName = 'ButtonGroup';