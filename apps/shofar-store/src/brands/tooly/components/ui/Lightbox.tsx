/**
 * Lightbox Component
 * Fullscreen image viewer with navigation
 *
 * Features:
 * - Fullscreen modal with dark backdrop
 * - Next/Prev navigation (buttons + keyboard)
 * - Touch swipe support (mobile)
 * - Close button + ESC key
 * - Image counter
 * - Respects prefers-reduced-motion
 */

"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface LightboxImage {
  src: string;
  alt: string;
  label?: string;
}

interface LightboxProps {
  /** Array of images to display */
  images: LightboxImage[];
  /** Initial index to open at */
  initialIndex?: number;
  /** Whether lightbox is open */
  open: boolean;
  /** Close handler */
  onClose: () => void;
}

export function Lightbox({
  images,
  initialIndex = 0,
  open,
  onClose,
}: LightboxProps): React.ReactElement | null {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  // Reset index when opening
  React.useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex);
    }
  }, [open, initialIndex]);

  // Check for reduced motion preference
  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Navigation functions (declared before keyboard effect)
  const goToNext = React.useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrev = React.useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard navigation
  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          goToPrev();
          break;
        case "ArrowRight":
          goToNext();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose, goToNext, goToPrev]);

  // Touch swipe handling
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrev();
    }
  };

  if (!open || images.length === 0) return null;

  const currentImage = images[currentIndex];

  const lightboxContent = (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center",
        "bg-black/95 backdrop-blur-sm",
        !prefersReducedMotion && "animate-fade-in",
      )}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className={cn(
          "absolute top-4 right-4 z-10",
          "w-12 h-12 rounded-full",
          "flex items-center justify-center",
          "bg-white/10 text-white hover:bg-white/20",
          "transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
        )}
        aria-label="Close lightbox"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Image counter */}
      <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Main image container */}
      <div
        className="relative w-full h-full flex items-center justify-center p-4 md:p-16"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative w-full h-full max-w-6xl max-h-[80vh]">
          <Image
            src={currentImage.src}
            alt={currentImage.alt}
            fill
            className={cn(
              "object-contain",
              !prefersReducedMotion && "transition-opacity duration-200",
            )}
            sizes="100vw"
            priority
          />
        </div>

        {/* Image label */}
        {currentImage.label && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-black/50 text-white text-sm">
            {currentImage.label}
          </div>
        )}
      </div>

      {/* Previous button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToPrev();
          }}
          className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 z-10",
            "w-12 h-12 rounded-full",
            "flex items-center justify-center",
            "bg-white/10 text-white hover:bg-white/20",
            "transition-colors duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
          )}
          aria-label="Previous image"
        >
          <svg
            className="w-6 h-6"
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
      )}

      {/* Next button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          className={cn(
            "absolute right-4 top-1/2 -translate-y-1/2 z-10",
            "w-12 h-12 rounded-full",
            "flex items-center justify-center",
            "bg-white/10 text-white hover:bg-white/20",
            "transition-colors duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
          )}
          aria-label="Next image"
        >
          <svg
            className="w-6 h-6"
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
      )}

      {/* Thumbnail strip (desktop only) */}
      {images.length > 1 && (
        <div className="hidden md:flex absolute bottom-4 left-1/2 -translate-x-1/2 gap-2 p-2 rounded-xl bg-black/50">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={cn(
                "relative w-16 h-12 rounded-lg overflow-hidden",
                "border-2 transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                idx === currentIndex
                  ? "border-[#02fcef] opacity-100"
                  : "border-transparent opacity-60 hover:opacity-100",
              )}
              aria-label={`View image ${idx + 1}`}
              aria-current={idx === currentIndex ? "true" : undefined}
            >
              <Image
                src={img.src}
                alt=""
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Portal to document body
  if (typeof document !== "undefined") {
    return createPortal(lightboxContent, document.body);
  }

  return null;
}

Lightbox.displayName = "Lightbox";

export default Lightbox;
