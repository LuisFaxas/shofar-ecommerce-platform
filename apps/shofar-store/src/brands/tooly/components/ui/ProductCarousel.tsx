/**
 * ProductCarousel - Mobile-first image carousel with lightbox
 *
 * Features:
 * - Touch swipe gestures
 * - CSS scroll-snap for smooth snapping
 * - Dot indicators with cyan active state
 * - Thumbnail strip on desktop
 * - Keyboard navigation (arrow keys)
 * - Click to open fullscreen lightbox
 * - Zoom cursor on desktop hover
 * - ARIA labels for accessibility
 */

"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Lightbox, type LightboxImage } from "./Lightbox";

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
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
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

  // Open lightbox at current index
  const openLightbox = React.useCallback(() => {
    setLightboxOpen(true);
  }, []);

  // Convert images to lightbox format
  const lightboxImages: LightboxImage[] = React.useMemo(
    () =>
      images.map((img, idx) => ({
        src: img.source || img.preview,
        alt: `${altPrefix} ${idx + 1}`,
      })),
    [images, altPrefix],
  );

  // Empty state
  if (!images || images.length === 0) {
    return (
      <div
        className={cn(
          "relative tooly-product-media aspect-[3/4] md:aspect-square rounded-xl",
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
    <>
      <div
        className={cn("relative", className)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="region"
        aria-label="Product image carousel"
        aria-roledescription="carousel"
      >
        {/* Main Carousel with Glass Dock wrapper */}
        <div className="relative">
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
                className={cn(
                  "snap-center shrink-0 w-full relative group",
                  "tooly-product-media aspect-[3/4] md:aspect-square",
                )}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${images.length}`}
              >
                {/* Clickable image with zoom cursor */}
                <button
                  onClick={openLightbox}
                  className={cn(
                    "absolute inset-0 w-full h-full overflow-hidden",
                    "cursor-zoom-in focus-visible:outline-none",
                    "focus-visible:ring-2 focus-visible:ring-[#02fcef] focus-visible:ring-inset",
                  )}
                  aria-label={`View ${altPrefix} ${index + 1} fullscreen`}
                >
                  <Image
                    src={image.preview}
                    alt={`${altPrefix} ${index + 1}`}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index === 0}
                  />
                </button>

                {/* Zoom icon (top-right corner) */}
                <div
                  className={cn(
                    "absolute top-3 right-3",
                    "pointer-events-none",
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 md:w-10 md:h-10 rounded-full",
                      "bg-black/30 md:bg-white/20 backdrop-blur-sm",
                      "flex items-center justify-center",
                      "opacity-70 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                    )}
                  >
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom scrim gradient (mobile only) - WO 2.0.5 */}
          {images.length > 1 && (
            <div
              className="absolute inset-x-0 bottom-0 h-24 md:hidden pointer-events-none"
              aria-hidden="true"
            >
              <div className="absolute inset-0 tooly-media-scrim" />
            </div>
          )}

          {/* Floating thumbnails overlay (mobile only) - WO 2.0.5 */}
          {images.length > 1 && (
            <div className="absolute left-4 right-4 bottom-4 md:hidden pointer-events-none">
              <div className="flex gap-2 px-1 overflow-x-auto scrollbar-hide pointer-events-auto">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollToIndex(idx);
                    }}
                    className={cn(
                      "relative shrink-0 w-11 h-11 rounded-lg overflow-hidden",
                      "border-2 transition-all duration-200",
                      "bg-black/20 backdrop-blur-sm",
                      idx === currentIndex
                        ? "border-[#02fcef]"
                        : "border-white/30 hover:border-white/50",
                    )}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <Image
                      src={img.preview}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dot Indicators (desktop only) */}
        {images.length > 1 && (
          <div
            className="hidden md:flex justify-center gap-2 mt-4"
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

        {/* Thumbnail Strip (Desktop only) */}
        {images.length > 1 && (
          <div
            className={cn(
              "hidden md:flex gap-2 mt-4",
              "justify-center",
              "pb-1",
            )}
          >
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => scrollToIndex(index)}
                className={cn(
                  "relative shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden snap-start",
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
                  sizes="56px"
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

      {/* Lightbox */}
      <Lightbox
        images={lightboxImages}
        initialIndex={currentIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}

ProductCarousel.displayName = "ProductCarousel";

export default ProductCarousel;
