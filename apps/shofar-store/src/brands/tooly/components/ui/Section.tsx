/**
 * TOOLY Design System - Section Component
 * Work Order 2.5 Implementation
 *
 * Layout component for consistent page sections
 * Provides responsive containers and spacing
 */

import { HTMLAttributes, forwardRef, ReactNode } from "react";

export interface SectionProps
  extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Section heading */
  title?: string | ReactNode;
  /** Section subtitle or description */
  subtitle?: string | ReactNode;
  /** Container width constraint */
  containerSize?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  /** Vertical padding size */
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
  /** Background variant */
  background?: "transparent" | "subtle" | "muted" | "gradient" | "glass";
  /** Text alignment */
  align?: "left" | "center" | "right";
  /** Whether to add a decorative divider after the section */
  divider?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Section component for page layout
 *
 * @example
 * <Section title="Our Features" subtitle="Everything you need" containerSize="lg">
 *   <FeatureGrid />
 * </Section>
 */
export const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      title,
      subtitle,
      containerSize = "xl",
      spacing = "lg",
      background = "transparent",
      align = "center",
      divider = false,
      className = "",
      children,
      ...props
    },
    ref,
  ) => {
    // Container size classes
    const containerSizes = {
      sm: "max-w-2xl", // 672px
      md: "max-w-4xl", // 896px
      lg: "max-w-6xl", // 1152px
      xl: "max-w-7xl", // 1280px
      "2xl": "max-w-8xl", // 1536px
      full: "max-w-full",
    };

    // Vertical spacing classes
    const spacings = {
      none: "",
      sm: "py-8 md:py-12",
      md: "py-12 md:py-16",
      lg: "py-16 md:py-20 lg:py-24",
      xl: "py-20 md:py-28 lg:py-32",
    };

    // Background variants
    const backgrounds = {
      transparent: "",
      subtle: "bg-gunmetal-50 dark:bg-gunmetal-900",
      muted: "bg-gunmetal-100 dark:bg-gunmetal-800",
      gradient: `
        bg-gradient-to-br from-gunmetal-50 via-white to-gunmetal-50
        dark:from-gunmetal-900 dark:via-gunmetal-800 dark:to-gunmetal-900
      `,
      glass: "glass backdrop-blur-md",
    };

    // Text alignment
    const alignments = {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    };

    // Title alignment for header
    const headerAlignments = {
      left: "items-start",
      center: "items-center",
      right: "items-end",
    };

    return (
      <>
        <section
          ref={ref}
          className={`
            ${spacings[spacing]}
            ${backgrounds[background]}
            ${className}
            relative overflow-hidden
          `
            .replace(/\s+/g, " ")
            .trim()}
          {...props}
        >
          <div
            className={`
              mx-auto px-4 sm:px-6 lg:px-8
              ${containerSizes[containerSize]}
            `
              .replace(/\s+/g, " ")
              .trim()}
          >
            {/* Section Header */}
            {(title || subtitle) && (
              <div
                className={`
                  flex flex-col
                  ${headerAlignments[align]}
                  ${alignments[align]}
                  mb-8 md:mb-12
                `
                  .replace(/\s+/g, " ")
                  .trim()}
              >
                {title && (
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gunmetal-900 dark:text-gunmetal-100 mb-4">
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p className="text-lg md:text-xl text-gunmetal-600 dark:text-gunmetal-400 max-w-3xl">
                    {subtitle}
                  </p>
                )}
              </div>
            )}

            {/* Section Content */}
            {children}
          </div>
        </section>

        {/* Optional Divider */}
        {divider && <SectionDivider />}
      </>
    );
  },
);

Section.displayName = "Section";

/**
 * Section Divider component
 */
export const SectionDivider: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div
      className={`
        relative h-px bg-gradient-to-r
        from-transparent via-gunmetal-300 to-transparent
        dark:via-gunmetal-700
        ${className}
      `
        .replace(/\s+/g, " ")
        .trim()}
      role="separator"
      aria-hidden="true"
    />
  );
};

SectionDivider.displayName = "SectionDivider";

/**
 * Hero Section component - specialized for landing pages
 */
export interface HeroSectionProps extends Omit<SectionProps, "spacing"> {
  /** Hero heading - typically larger than section title */
  headline?: string | ReactNode;
  /** Supporting description */
  description?: string | ReactNode;
  /** Call-to-action buttons or elements */
  actions?: ReactNode;
  /** Hero image or illustration */
  image?: ReactNode;
  /** Layout variant */
  layout?: "center" | "left" | "right" | "split";
}

export const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(
  (
    {
      headline,
      description,
      actions,
      image,
      layout = "center",
      containerSize = "2xl",
      background = "gradient",
      className = "",
      ...sectionProps
    },
    ref,
  ) => {
    // Layout-specific classes
    const layouts = {
      center: "flex flex-col items-center text-center",
      left: "flex flex-col items-start text-left",
      right: "flex flex-col items-end text-right",
      split: "grid md:grid-cols-2 gap-8 md:gap-12 items-center",
    };

    return (
      <Section
        ref={ref}
        containerSize={containerSize}
        spacing="xl"
        background={background}
        className={`min-h-[60vh] flex items-center ${className}`}
        {...sectionProps}
      >
        <div className={layouts[layout]}>
          {/* Text Content */}
          <div className={layout === "split" ? "" : "max-w-4xl"}>
            {headline && (
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gunmetal-900 dark:text-gunmetal-100 mb-6 animate-fade-in">
                {headline}
              </h1>
            )}
            {description && (
              <p className="text-lg md:text-xl lg:text-2xl text-gunmetal-600 dark:text-gunmetal-400 mb-8 animate-slide-up animation-delay-100">
                {description}
              </p>
            )}
            {actions && (
              <div className="flex flex-wrap gap-4 justify-center md:justify-start animate-slide-up animation-delay-200">
                {actions}
              </div>
            )}
          </div>

          {/* Image/Illustration */}
          {image && layout === "split" && (
            <div className="relative animate-fade-in animation-delay-300">
              {image}
            </div>
          )}
        </div>

        {/* Centered image for non-split layouts */}
        {image && layout !== "split" && (
          <div className="mt-12 animate-fade-in animation-delay-300">
            {image}
          </div>
        )}
      </Section>
    );
  },
);

HeroSection.displayName = "HeroSection";

/**
 * Feature Section - for showcasing features/benefits
 */
export interface FeatureSectionProps extends SectionProps {
  /** Feature items to display */
  features: Array<{
    icon?: ReactNode;
    title: string;
    description: string;
  }>;
  /** Number of columns for feature grid */
  columns?: 2 | 3 | 4;
}

export const FeatureSection: React.FC<FeatureSectionProps> = ({
  features,
  columns = 3,
  ...sectionProps
}) => {
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <Section {...sectionProps}>
      <div className={`grid gap-8 ${gridCols[columns]}`}>
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {feature.icon && (
              <div className="mb-4 text-4xl text-brand-primary">
                {feature.icon}
              </div>
            )}
            <h3 className="text-xl font-semibold text-gunmetal-900 dark:text-gunmetal-100 mb-2">
              {feature.title}
            </h3>
            <p className="text-gunmetal-600 dark:text-gunmetal-400">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
};

FeatureSection.displayName = "FeatureSection";

/**
 * CTA Section - Call to action section
 */
export interface CTASectionProps extends Omit<SectionProps, "align"> {
  /** CTA heading - can be string or ReactNode (e.g., ToolyWordmark component) */
  heading: ReactNode;
  /** CTA description */
  description?: string;
  /** Action buttons */
  actions: ReactNode;
}

export const CTASection: React.FC<CTASectionProps> = ({
  heading,
  description,
  actions,
  background = "gradient",
  ...sectionProps
}) => {
  return (
    <Section align="center" background={background} {...sectionProps}>
      <div className="glass-panel max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gunmetal-900 dark:text-white mb-4">
          {heading}
        </h2>
        {description && (
          <p className="text-lg text-gunmetal-700 dark:text-gunmetal-300 mb-8">
            {description}
          </p>
        )}
        <div className="flex flex-wrap gap-4 justify-center">{actions}</div>
      </div>
    </Section>
  );
};

CTASection.displayName = "CTASection";
