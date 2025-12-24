/**
 * GallerySection - Product image gallery with lightbox
 * WO-DESIGN-IMG-01 Implementation + Native Scroll-Snap Carousel
 *
 * Features:
 * - Desktop: 6-image grid with hover effects (unchanged)
 * - Mobile: Native scroll-snap carousel with finger-tracking drag
 * - Tap/click to open fullscreen lightbox
 * - "View all (N)" affordance when >6 images
 * - Lazy loading for non-priority images
 */

"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Lightbox, type LightboxImage } from "../components/ui/Lightbox";
import type { GalleryContent } from "../lib/storefront-content";

interface GalleryAsset {
  id: string;
  name: string;
  preview: string;
  source: string;
}

interface GallerySectionProps {
  className?: string;
  /** Gallery assets from Vendure product */
  assets?: GalleryAsset[] | null;
  /** Marketing gallery assets from Channel (takes priority) */
  channelGalleryAssets?: GalleryAsset[] | null;
  /** Content from Vendure Channel customFields */
  content?: GalleryContent;
}

const DEFAULT_GALLERY_ITEMS = [
  { id: "1", label: "TOOLY Front View", featured: true },
  { id: "2", label: "TOOLY Side Profile" },
  { id: "3", label: "TOOLY Detail Shot" },
  { id: "4", label: "TOOLY In Use" },
  { id: "5", label: "TOOLY Components" },
  { id: "6", label: "TOOLY Accessories" },
];

export function GallerySection({
  className,
  assets,
  channelGalleryAssets,
  content,
}: GallerySectionProps): React.ReactElement {
  // State for mobile carousel
  const [mobileActiveIndex, setMobileActiveIndex] = React.useState(0);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxStartIndex, setLightboxStartIndex] = React.useState(0);

  // Scroll-snap refs and dragging guard
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const isDraggingRef = React.useRef(false);
  const scrollTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Prioritize channel marketing gallery, fallback to product assets
  const effectiveAssets = channelGalleryAssets?.length
    ? channelGalleryAssets
    : assets;
  const allAssets = effectiveAssets || [];
  const hasAssets = allAssets.length > 0;
  const totalImages = allAssets.length;
  const hasMoreThanSix = totalImages > 6;

  // Convert to lightbox format
  const lightboxImages: LightboxImage[] = React.useMemo(
    () =>
      allAssets.map((asset) => ({
        src: asset.source || asset.preview,
        alt: asset.name,
        label: asset.name,
      })),
    [allAssets],
  );

  // Open lightbox at specific index
  const openLightbox = React.useCallback((index: number) => {
    setLightboxStartIndex(index);
    setLightboxOpen(true);
  }, []);

  // Set dragging true on pointer down (clear any pending timeout first)
  const handlePointerDown = React.useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = null;
    }
    isDraggingRef.current = true;
  }, []);

  // Scroll handler - sync active index and clear dragging after scroll settles
  const handleScroll = React.useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Update active index based on scroll position
    const scrollLeft = container.scrollLeft;
    const itemWidth = container.offsetWidth;
    const newIndex = Math.round(scrollLeft / itemWidth);
    if (newIndex >= 0 && newIndex < totalImages) {
      setMobileActiveIndex(newIndex);
    }

    // Clear dragging flag after scroll settles (150ms debounce)
    scrollTimeoutRef.current = setTimeout(() => {
      isDraggingRef.current = false;
    }, 150);
  }, [totalImages]);

  // Only open lightbox if not dragging
  const handleTap = React.useCallback(
    (index: number) => {
      if (!isDraggingRef.current) {
        openLightbox(index);
      }
    },
    [openLightbox],
  );

  // Scroll to specific index (for thumbnail clicks)
  const scrollToIndex = React.useCallback((index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const itemWidth = container.offsetWidth;
    container.scrollTo({ left: index * itemWidth, behavior: "smooth" });
  }, []);

  // Items for desktop grid (max 6)
  const gridItems = hasAssets ? allAssets.slice(0, 6) : DEFAULT_GALLERY_ITEMS;

  return (
    <section
      id="gallery"
      className={cn("py-12 md:py-24 bg-[#0d1218]", className)}
      aria-labelledby="gallery-heading"
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2
            id="gallery-heading"
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            {content?.heading ?? "Gallery"}
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            {content?.subhead ??
              "Every angle showcases the precision craftsmanship"}
          </p>
        </div>

        {/* Mobile Gallery (< md) - Native Scroll-Snap Carousel */}
        <div className="md:hidden">
          {hasAssets ? (
            <>
              {/* Scroll-snap carousel container */}
              <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                onPointerDown={handlePointerDown}
                className={cn(
                  "flex overflow-x-auto snap-x snap-mandatory",
                  "scrollbar-hide scroll-smooth",
                  "rounded-xl mb-3",
                )}
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {allAssets.map((asset, index) => (
                  <div
                    key={asset.id}
                    className="snap-center shrink-0 w-full aspect-[3/4] relative"
                    onClick={() => handleTap(index)}
                  >
                    <Image
                      src={asset.preview}
                      alt={asset.name}
                      fill
                      className="object-cover object-center"
                      sizes="100vw"
                      priority={index === 0}
                      draggable={false}
                    />

                    {/* Zoom icon overlay (small button, top-right) - only on active */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openLightbox(index);
                      }}
                      className={cn(
                        "absolute top-3 right-3 z-10",
                        "w-10 h-10 rounded-full",
                        "bg-black/40 backdrop-blur-sm",
                        "flex items-center justify-center",
                        "transition-opacity duration-[200ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#02fcef]",
                        index === mobileActiveIndex
                          ? "opacity-60"
                          : "opacity-0 pointer-events-none",
                      )}
                      aria-label="Open fullscreen"
                    >
                      <svg
                        className="w-5 h-5 text-white"
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
                    </button>

                    {/* Image counter - only on active */}
                    <div
                      className={cn(
                        "absolute bottom-3 left-3 px-2 py-1 rounded",
                        "bg-black/40 backdrop-blur-sm text-white text-xs font-medium",
                        "transition-opacity duration-[200ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                        index === mobileActiveIndex
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    >
                      {index + 1} / {totalImages}
                    </div>
                  </div>
                ))}
              </div>

              {/* Thumbnail Strip */}
              <div
                className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {allAssets.slice(0, 6).map((asset, index) => (
                  <button
                    key={asset.id}
                    onClick={() => scrollToIndex(index)}
                    className={cn(
                      "relative shrink-0 w-16 h-16 rounded-lg overflow-hidden",
                      "border-2 transition-all duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#02fcef]",
                      index === mobileActiveIndex
                        ? "border-[#02fcef]"
                        : "border-white/10",
                    )}
                    aria-label={`View ${asset.name}`}
                    aria-current={
                      index === mobileActiveIndex ? "true" : undefined
                    }
                  >
                    <Image
                      src={asset.preview}
                      alt=""
                      fill
                      className="object-cover object-center"
                      sizes="64px"
                      loading="lazy"
                    />
                  </button>
                ))}

                {/* "View all" button if >6 images */}
                {hasMoreThanSix && (
                  <button
                    onClick={() => openLightbox(0)}
                    className={cn(
                      "shrink-0 w-16 h-16 rounded-lg",
                      "bg-white/10 border-2 border-white/10",
                      "flex items-center justify-center",
                      "text-white text-xs font-medium",
                      "hover:bg-white/20 transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#02fcef]",
                    )}
                    aria-label={`View all ${totalImages} images`}
                  >
                    +{totalImages - 6}
                  </button>
                )}
              </div>
            </>
          ) : (
            /* Mobile placeholder */
            <div className="aspect-[3/4] rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
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
                <p className="text-white/40 text-sm">Gallery coming soon</p>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Gallery Grid (md+) - unchanged layout */}
        <div className="hidden md:block">
          <div className="grid grid-cols-3 gap-4">
            {gridItems.map((item, index) => {
              const asset = hasAssets ? (item as GalleryAsset) : null;
              const label =
                asset?.name ||
                (item as (typeof DEFAULT_GALLERY_ITEMS)[0]).label ||
                `Image ${index + 1}`;

              return (
                <button
                  key={asset?.id || `placeholder-${index}`}
                  onClick={() => hasAssets && openLightbox(index)}
                  disabled={!hasAssets}
                  className={cn(
                    "group relative overflow-hidden rounded-xl text-left",
                    hasAssets ? "cursor-zoom-in" : "cursor-default",
                    // Only show glass background when no image (placeholder)
                    asset?.preview
                      ? "bg-[#0d1218]"
                      : "bg-white/[0.04] border border-white/[0.08]",
                    !asset?.preview && "hover:border-white/[0.16]",
                    "transition-all duration-300",
                    // Featured item spans 2 columns
                    index === 0 && "col-span-2 row-span-2",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#02fcef]",
                  )}
                  aria-label={hasAssets ? `View ${label} fullscreen` : label}
                >
                  {/* Fixed aspect ratio container */}
                  <div
                    className={cn(
                      "aspect-video relative w-full h-full",
                      index === 0 && "aspect-square",
                    )}
                  >
                    {asset?.preview ? (
                      <Image
                        src={asset.preview}
                        alt={label}
                        fill
                        className="object-cover object-center w-full h-full transition-transform duration-300 group-hover:scale-105"
                        sizes={
                          index === 0
                            ? "(max-width: 768px) 100vw, 66vw"
                            : "(max-width: 768px) 50vw, 33vw"
                        }
                        loading={index === 0 ? "eager" : "lazy"}
                        priority={index === 0}
                      />
                    ) : (
                      /* Placeholder content */
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center p-4">
                          <div
                            className={cn(
                              "mx-auto mb-3 rounded-full flex items-center justify-center",
                              "bg-white/[0.06] text-white/30",
                              index === 0 ? "w-20 h-20" : "w-12 h-12",
                            )}
                          >
                            <svg
                              className={cn(
                                index === 0 ? "w-10 h-10" : "w-6 h-6",
                              )}
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
                          <p
                            className={cn(
                              "text-white/40",
                              index === 0 ? "text-sm" : "text-xs",
                            )}
                          >
                            {label}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Hover overlay with zoom icon */}
                    {asset?.preview && (
                      <div
                        className={cn(
                          "absolute inset-0",
                          "bg-gradient-to-t from-black/60 via-black/20 to-transparent",
                          "opacity-0 group-hover:opacity-100",
                          "transition-opacity duration-300",
                          "flex items-center justify-center",
                        )}
                      >
                        {/* Zoom icon */}
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-white"
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
                        {/* Label at bottom */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <p className="text-sm font-medium text-white">
                            {label}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* "View all" link if >6 images */}
          {hasMoreThanSix && (
            <div className="text-center mt-6">
              <button
                onClick={() => openLightbox(0)}
                className={cn(
                  "inline-flex items-center gap-2 px-6 py-3 rounded-lg",
                  "bg-white/10 text-white font-medium",
                  "hover:bg-white/20 transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#02fcef]",
                )}
              >
                View all {totalImages} images
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        images={lightboxImages}
        initialIndex={lightboxStartIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </section>
  );
}

GallerySection.displayName = "GallerySection";

export default GallerySection;
