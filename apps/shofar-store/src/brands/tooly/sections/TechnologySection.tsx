/**
 * TechnologySection - Features and technology showcase
 * WO 3.1 + WO 2.1.1 Implementation
 *
 * Features:
 * - 3-column grid with FeatureCards (desktop)
 * - 2-page horizontal pager with 3 cards each (mobile)
 * - Dot navigation matching ProductCarousel
 * - Icon + title + description pattern
 * - Glass morphism styling
 */

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { Feature } from "../lib/storefront-content";

// Utility to chunk array into groups
function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

interface TechnologySectionProps {
  className?: string;
  /** Features from Vendure Channel customFields */
  features?: [Feature, Feature, Feature, Feature, Feature, Feature];
}

// Default features with icons (icons are code-controlled, text from Vendure)
const DEFAULT_FEATURES = [
  {
    icon: "precision",
    title: "Precision Machining",
    body: "CNC-machined from aerospace-grade aluminum with tolerances under 0.01mm.",
  },
  {
    icon: "airflow",
    title: "Optimized Airflow",
    body: "Engineered chamber design delivers smooth, consistent draws every time.",
  },
  {
    icon: "materials",
    title: "Premium Materials",
    body: "Medical-grade stainless steel and borosilicate glass for purity.",
  },
  {
    icon: "design",
    title: "Easy Maintenance",
    body: "Simple disassembly and cleaning. Dishwasher-safe components.",
  },
  {
    icon: "temp",
    title: "Ergonomic Design",
    body: "Balanced weight distribution and textured grip for comfortable use.",
  },
  {
    icon: "battery",
    title: "Travel Ready",
    body: "Compact form factor with included protective case for portability.",
  },
];

function FeatureIcon({ type }: { type: string }): React.ReactElement {
  const icons: Record<string, React.ReactElement> = {
    precision: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
      />
    ),
    airflow: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
      />
    ),
    temp: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
      />
    ),
    battery: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M4.5 10.5H18V15H4.5v-4.5zM3.75 18h15A2.25 2.25 0 0021 15.75v-6a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 001.5 9.75v6A2.25 2.25 0 003.75 18z"
      />
    ),
    materials: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
      />
    ),
    design: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
      />
    ),
  };

  return (
    <svg
      className="w-8 h-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      {icons[type] || icons.precision}
    </svg>
  );
}

// Reusable FeatureCard component
function FeatureCard({
  feature,
}: {
  feature: { icon: string; title: string; body: string };
}): React.ReactElement {
  return (
    <div
      className={cn(
        "group p-6 rounded-xl",
        "bg-white/[0.04] border border-white/[0.08]",
        "hover:bg-white/[0.06] hover:border-white/[0.12]",
        "transition-all duration-300",
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "w-14 h-14 rounded-xl mb-4",
          "bg-gradient-to-br from-[#02fcef]/10 to-[#a02bfe]/10",
          "border border-white/[0.08]",
          "flex items-center justify-center",
          "text-[#02fcef] group-hover:text-white",
          "transition-colors duration-300",
        )}
      >
        <FeatureIcon type={feature.icon} />
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
        {feature.title}
      </h3>
      <p className="text-sm text-white/60 leading-relaxed line-clamp-3">
        {feature.body}
      </p>
    </div>
  );
}

export function TechnologySection({
  className,
  features,
}: TechnologySectionProps): React.ReactElement {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [activePageIndex, setActivePageIndex] = React.useState(0);

  // Merge features prop with default icons
  const displayFeatures = DEFAULT_FEATURES.map((defaultFeature, index) => ({
    icon: defaultFeature.icon,
    title: features?.[index]?.title ?? defaultFeature.title,
    body: features?.[index]?.body ?? defaultFeature.body,
  }));

  // Split features into pages of 3 for mobile pager
  const pages = chunkArray(displayFeatures, 3);

  // Handle scroll to detect active page
  const handleScroll = React.useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const newIndex = Math.round(container.scrollLeft / container.offsetWidth);
    if (
      newIndex !== activePageIndex &&
      newIndex >= 0 &&
      newIndex < pages.length
    ) {
      setActivePageIndex(newIndex);
    }
  }, [activePageIndex, pages.length]);

  // Scroll to specific page
  const scrollToPage = React.useCallback((index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollTo({
      left: index * container.offsetWidth,
      behavior: "smooth",
    });
    setActivePageIndex(index);
  }, []);

  return (
    <section
      id="technology"
      className={cn("py-16 md:py-24", className)}
      aria-labelledby="technology-heading"
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            id="technology-heading"
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Engineered for Excellence
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Every detail has been meticulously designed to deliver the ultimate
            experience
          </p>
        </div>

        {/* Desktop Grid - hidden on mobile */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayFeatures.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>

        {/* Mobile Pager - hidden on desktop */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="md:hidden flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth -mx-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {pages.map((pageFeatures, pageIndex) => (
            <div
              key={pageIndex}
              className="snap-center shrink-0 w-full flex flex-col gap-4 px-4"
            >
              {pageFeatures.map((feature, featureIndex) => (
                <FeatureCard key={featureIndex} feature={feature} />
              ))}
            </div>
          ))}
        </div>

        {/* Mobile Dot Indicators - matching ProductCarousel */}
        {pages.length > 1 && (
          <div
            className="md:hidden flex justify-center gap-2 mt-4"
            role="tablist"
            aria-label="Feature pages navigation"
          >
            {pages.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToPage(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#02fcef] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0e14]",
                  index === activePageIndex
                    ? "bg-[#02fcef] w-4"
                    : "bg-white/30 hover:bg-white/50",
                )}
                role="tab"
                aria-selected={index === activePageIndex}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

TechnologySection.displayName = "TechnologySection";

export default TechnologySection;
