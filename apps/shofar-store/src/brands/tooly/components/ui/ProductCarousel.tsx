/**
 * ProductCarousel - Mobile-first image carousel
 *
 * Features:
 * - Touch swipe gestures
 * - CSS scroll-snap for smooth snapping
 * - Dot indicators with cyan active state
 * - Thumbnail strip on desktop
 * - Keyboard navigation (← →)
 * - ARIA labels for accessibility
 */

"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductAsset {
  id: string;
  preview: string;
  source?: string;
}

interface ProductCarouselProps {
  /** Array of product assets to display */
  images: ProductAsset[];
  /** Alt text prefix for images */
  altPrefix?: string;
  /** Additional className */
  className?: string;
}

export function ProductCarousel({
  images,
  altPrefix = "Product image",
  className,
}: ProductCarouselProps): React.ReactElement {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Handle scroll snap detection
  const handleScroll = React.useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const itemWidth = container.offsetWidth;
    const newIndex = Math.round(scrollLeft / itemWidth);

    if (
      newIndex !== currentIndex &&
      newIndex >= 0 &&
      newIndex < images.length
    ) {
      setCurrentIndex(newIndex);
    }
  }, [currentIndex, images.length]);

  // Scroll to specific index
  const scrollToIndex = React.useCallback((index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const itemWidth = container.offsetWidth;
    container.scrollTo({
      left: index * itemWidth,
      behavior: "smooth",
    });
    setCurrentIndex(index);
  }, []);

  // Keyboard navigation
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft" && currentIndex > 0) {
        scrollToIndex(currentIndex - 1);
      } else if (e.key === "ArrowRight" && currentIndex < images.length - 1) {
        scrollToIndex(currentIndex + 1);
      }
    },
    [currentIndex, images.length, scrollToIndex],
  );

  // Empty state
  if (!images || images.length === 0) {
    return (
      <div
        className={cn(
          "relative aspect-square rounded-xl",
          "bg-white/[0.04] border border-white/[0.08]",
          "flex items-center justify-center",
          className,
        )}
      >
        <div className="text-center p-6">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/[0.06] flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>
          <p className="text-white/40 text-sm">No images</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("relative", className)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Product image carousel"
      aria-roledescription="carousel"
    >
      {/* Main Carousel */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className={cn(
          "flex overflow-x-auto snap-x snap-mandatory",
          "scrollbar-hide scroll-smooth",
          "rounded-xl bg-white/[0.04] border border-white/[0.08]",
        )}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {images.map((image, index) => (
          <div
            key={image.id}
            className="snap-center shrink-0 w-full aspect-square relative"
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${images.length}`}
          >
            <Image
              src={image.preview}
              alt={`${altPrefix} ${index + 1}`}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Dot Indicators */}
      {images.length > 1 && (
        <div
          className="flex justify-center gap-2 mt-4"
          role="tablist"
          aria-label="Carousel navigation"
        >
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#02fcef] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0e14]",
                index === currentIndex
                  ? "bg-[#02fcef] w-4"
                  : "bg-white/30 hover:bg-white/50",
              )}
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Thumbnail Strip (Desktop) */}
      {images.length > 1 && (
        <div className="hidden md:flex gap-2 mt-4 justify-center">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => scrollToIndex(index)}
              className={cn(
                "relative w-16 h-16 rounded-lg overflow-hidden",
                "border-2 transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#02fcef]",
                index === currentIndex
                  ? "border-[#02fcef]"
                  : "border-white/10 hover:border-white/30",
              )}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image.preview}
                alt=""
                fill
                className="object-contain p-1"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Arrow Navigation (Desktop) */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => scrollToIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className={cn(
              "hidden md:flex absolute left-2 top-1/2 -translate-y-1/2",
              "w-10 h-10 rounded-full items-center justify-center",
              "bg-black/50 text-white/80 backdrop-blur-sm",
              "hover:bg-black/70 hover:text-white transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#02fcef]",
              "disabled:opacity-30 disabled:cursor-not-allowed",
            )}
            aria-label="Previous image"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={() =>
              scrollToIndex(Math.min(images.length - 1, currentIndex + 1))
            }
            disabled={currentIndex === images.length - 1}
            className={cn(
              "hidden md:flex absolute right-2 top-1/2 -translate-y-1/2",
              "w-10 h-10 rounded-full items-center justify-center",
              "bg-black/50 text-white/80 backdrop-blur-sm",
              "hover:bg-black/70 hover:text-white transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#02fcef]",
              "disabled:opacity-30 disabled:cursor-not-allowed",
            )}
            aria-label="Next image"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

ProductCarousel.displayName = "ProductCarousel";

export default ProductCarousel;
