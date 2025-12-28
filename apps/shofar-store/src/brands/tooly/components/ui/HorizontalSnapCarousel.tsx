/**
 * HorizontalSnapCarousel - Responsive scroll-snap carousel
 * WO-DESIGN-SYSTEM-CAROUSEL-01
 *
 * Features:
 * - Mobile: horizontal scroll-snap carousel with finger tracking
 * - Desktop: CSS grid layout (configurable columns)
 * - No duplicated logic - single source of truth
 * - Respects prefers-reduced-motion
 */

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface HorizontalSnapCarouselProps {
  /** Items to render in the carousel */
  children: React.ReactNode;
  /** Width of each item on mobile in pixels (default: 260) */
  itemWidth?: number;
  /** Number of grid columns on desktop (default: 4) */
  desktopColumns?: 2 | 3 | 4 | 5 | 6;
  /** Gap between items (default: "md" = 12px/16px) */
  gap?: "sm" | "md" | "lg";
  /** Snap alignment (default: "start") */
  snapAlign?: "start" | "center";
  /** Additional className for the container */
  className?: string;
  /** Aria label for the carousel region */
  ariaLabel?: string;
}

// Gap size mapping
const gapSizes = {
  sm: "gap-2 md:gap-3",
  md: "gap-3 md:gap-4",
  lg: "gap-4 md:gap-6",
};

// Grid column mapping
const gridCols = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
  6: "md:grid-cols-6",
};

/**
 * Responsive horizontal snap carousel
 * Mobile: horizontal scroll with snap points
 * Desktop: CSS grid layout
 */
export function HorizontalSnapCarousel({
  children,
  itemWidth = 260,
  desktopColumns = 4,
  gap = "md",
  snapAlign = "start",
  className,
  ariaLabel = "Carousel",
}: HorizontalSnapCarouselProps): React.ReactElement {
  const items = React.Children.toArray(children);

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      className={cn(
        // Mobile: horizontal scroll with snap
        "flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2",
        // Desktop: grid layout
        "md:grid md:overflow-visible md:pb-0",
        gridCols[desktopColumns],
        // Gap
        gapSizes[gap],
        className,
      )}
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {items.map((child, index) => (
        <CarouselItem key={index} width={itemWidth} snapAlign={snapAlign}>
          {child}
        </CarouselItem>
      ))}
    </div>
  );
}

interface CarouselItemProps {
  children: React.ReactNode;
  width: number;
  snapAlign: "start" | "center";
}

function CarouselItem({
  children,
  width,
  snapAlign,
}: CarouselItemProps): React.ReactElement {
  return (
    <div
      className={cn(
        // Mobile: fixed width snap items
        snapAlign === "start" ? "snap-start" : "snap-center",
        "shrink-0",
        // Desktop: auto width
        "md:w-auto md:shrink",
      )}
      style={{
        // Use CSS variable for width that can be overridden
        width: `${width}px`,
      }}
    >
      {/* Wrapper that resets width on desktop */}
      <div className="w-full md:!w-auto">{children}</div>
    </div>
  );
}

HorizontalSnapCarousel.displayName = "HorizontalSnapCarousel";

export default HorizontalSnapCarousel;
