/**
 * TOOLY Design System - Card Component
 * Work Order 2.5.1 - Industrial Refinement
 *
 * Precision containers with subtle elevation and hairline borders
 * Optimized for dark gunmetal surfaces
 */

import { HTMLAttributes, forwardRef, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Enable glassmorphism effect */
  glass?: boolean;
  /** Visual prominence variant */
  variant?: "default" | "elevated" | "outlined" | "glass";
  /** Padding size */
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  /** Make card interactive (hover effects) */
  interactive?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Card component for content containers
 *
 * @example
 * <Card variant="elevated" padding="lg">
 *   <CardHeader>
 *     <h2>Card Title</h2>
 *   </CardHeader>
 *   <CardBody>
 *     Card content goes here
 *   </CardBody>
 * </Card>
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      glass = false,
      variant = "default",
      padding = "md",
      interactive = false,
      className = "",
      children,
      ...props
    },
    ref,
  ) => {
    // Base classes - industrial precision
    const baseClasses =
      "rounded-[10px] transition-all duration-[200ms] ease-out relative";

    // Variant styles - FLAT DESIGN with glassmorphism
    const variants = {
      default: `
        bg-gm-900/80 backdrop-blur-sm
        border border-gm-700
      `,
      elevated: `
        bg-gm-900/90 backdrop-blur-md
        border border-gm-600
      `,
      outlined: `
        bg-transparent backdrop-blur-sm
        border border-gm-600
      `,
      glass: "glass-card border border-white/20",
    };

    // Use glass variant if glass prop is true
    const variantClass = glass ? variants.glass : variants[variant];

    // Padding scales
    const paddings = {
      none: "",
      sm: "p-3",
      md: "p-6",
      lg: "p-8",
      xl: "p-10",
    };

    // Interactive states - FLAT with glassmorphism enhancement
    const interactiveClass = interactive
      ? `
        cursor-pointer
        hover:bg-gm-800/90 hover:border-gm-500
        focus-visible:outline-none focus-visible:ring-[3px]
        focus-visible:ring-gm-400/40 focus-visible:ring-offset-2
        focus-visible:ring-offset-gm-950
      `
      : "";

    return (
      <div
        ref={ref}
        className={`
          ${baseClasses}
          ${variantClass}
          ${paddings[padding]}
          ${interactiveClass}
          ${className}
        `
          .replace(/\s+/g, " ")
          .trim()}
        tabIndex={interactive ? 0 : undefined}
        role={interactive ? "button" : undefined}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

/**
 * Card Header component
 */
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Header title text */
  title?: string;
  /** Header description text */
  description?: string;
  /** Add a bottom border */
  bordered?: boolean;
  className?: string;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  (
    {
      title,
      description,
      bordered = false,
      className = "",
      children,
      ...props
    },
    ref,
  ) => {
    const borderClass = bordered ? "border-b border-gm-700 pb-4 mb-4" : "";

    return (
      <div
        ref={ref}
        className={`${borderClass} ${className}`.trim()}
        {...props}
      >
        {title || description ? (
          <div className="space-y-1">
            {title && (
              <h3 className="text-lg font-semibold text-white">{title}</h3>
            )}
            {description && (
              <p className="text-sm text-white/60">{description}</p>
            )}
          </div>
        ) : (
          children
        )}
      </div>
    );
  },
);

CardHeader.displayName = "CardHeader";

/**
 * Card Body component
 */
export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div ref={ref} className={`flex-1 ${className}`.trim()} {...props}>
        {children}
      </div>
    );
  },
);

CardBody.displayName = "CardBody";

/**
 * Card Footer component
 */
export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** Add a top border */
  bordered?: boolean;
  /** Alignment of footer content */
  align?: "left" | "center" | "right" | "between";
  className?: string;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  (
    { bordered = false, align = "right", className = "", children, ...props },
    ref,
  ) => {
    const borderClass = bordered ? "border-t border-gm-700 pt-4 mt-4" : "";

    const alignments = {
      left: "justify-start",
      center: "justify-center",
      right: "justify-end",
      between: "justify-between",
    };

    return (
      <div
        ref={ref}
        className={`
          flex items-center gap-3
          ${alignments[align]}
          ${borderClass}
          ${className}
        `
          .replace(/\s+/g, " ")
          .trim()}
        {...props}
      >
        {children}
      </div>
    );
  },
);

CardFooter.displayName = "CardFooter";

/**
 * Card Grid component for laying out multiple cards
 */
export interface CardGridProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of columns at different breakpoints */
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  /** Gap between cards */
  gap?: "sm" | "md" | "lg" | "xl";
  className?: string;
  children: ReactNode;
}

export const CardGrid: React.FC<CardGridProps> = ({
  cols = { default: 1, md: 2, lg: 3 },
  gap = "md",
  className = "",
  children,
  ...props
}) => {
  // Build responsive grid classes
  const colClasses = [
    cols.default && `grid-cols-${cols.default}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
  ]
    .filter(Boolean)
    .join(" ");

  const gaps = {
    sm: "gap-3",
    md: "gap-6",
    lg: "gap-8",
    xl: "gap-10",
  };

  return (
    <div
      className={`grid ${colClasses} ${gaps[gap]} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
};

CardGrid.displayName = "CardGrid";

/**
 * Feature Card - specialized card for highlighting features
 */
export interface FeatureCardProps extends Omit<CardProps, "variant"> {
  /** Icon or image to display */
  icon?: ReactNode;
  /** Title of the feature */
  title: string;
  /** Description text */
  description?: string;
  /** Call-to-action link or button */
  action?: ReactNode;
}

export const FeatureCard = forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ icon, title, description, action, className = "", ...cardProps }, ref) => {
    return (
      <Card
        ref={ref}
        className={`group ${className}`}
        interactive
        {...cardProps}
      >
        {icon && (
          <div className="mb-4 text-brand-primary group-hover:scale-110 transition-transform">
            {icon}
          </div>
        )}
        <h3 className="text-xl font-semibold text-gunmetal-900 dark:text-gunmetal-100 mb-2">
          {title}
        </h3>
        {description && (
          <p className="text-gunmetal-600 dark:text-gunmetal-400 mb-4">
            {description}
          </p>
        )}
        {action && <div className="mt-auto pt-4">{action}</div>}
      </Card>
    );
  },
);

FeatureCard.displayName = "FeatureCard";
