/**
 * GallerySection - Product image gallery
 * WO 3.1 / 3.2 Implementation
 *
 * Features:
 * - 6-image grid with glass border placeholders
 * - Fixed 16:9 aspect ratio for zero CLS
 * - Hover effects
 * - Accepts optional gallery data from Vendure
 */

"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

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
}: GallerySectionProps): React.ReactElement {
  // Prioritize channel marketing gallery, fallback to product assets, then placeholders
  const effectiveAssets = channelGalleryAssets?.length
    ? channelGalleryAssets
    : assets;
  const galleryItems = effectiveAssets?.slice(0, 6) || [];
  const hasAssets = galleryItems.length > 0;

  return (
    <section
      id="gallery"
      className={cn("py-16 md:py-24 bg-[#0d1218]", className)}
      aria-labelledby="gallery-heading"
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2
            id="gallery-heading"
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Gallery
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Every angle showcases the precision craftsmanship of TOOLY
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {(hasAssets ? galleryItems : DEFAULT_GALLERY_ITEMS).map(
            (item, index) => {
              const asset = hasAssets ? (item as GalleryAsset) : null;
              const label =
                asset?.name ||
                (item as (typeof DEFAULT_GALLERY_ITEMS)[0]).label ||
                `Image ${index + 1}`;

              return (
                <div
                  key={asset?.id || `placeholder-${index}`}
                  className={cn(
                    "group relative overflow-hidden rounded-xl",
                    "bg-white/[0.04] border border-white/[0.08]",
                    "hover:border-white/[0.16] transition-all duration-300",
                    // Featured item spans 2 columns on larger screens
                    index === 0 && "md:col-span-2 md:row-span-2",
                  )}
                >
                  {/* Fixed aspect ratio container */}
                  <div
                    className={cn(
                      "aspect-video relative",
                      index === 0 && "md:aspect-square",
                    )}
                  >
                    {asset?.preview ? (
                      <Image
                        src={asset.preview}
                        alt={label}
                        fill
                        className="object-cover"
                        sizes={
                          index === 0
                            ? "(max-width: 768px) 100vw, 66vw"
                            : "(max-width: 768px) 50vw, 33vw"
                        }
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

                    {/* Hover overlay */}
                    <div
                      className={cn(
                        "absolute inset-0",
                        "bg-gradient-to-t from-black/60 via-transparent to-transparent",
                        "opacity-0 group-hover:opacity-100",
                        "transition-opacity duration-300",
                      )}
                    >
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-sm font-medium text-white">
                          {label}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            },
          )}
        </div>
      </div>
    </section>
  );
}

GallerySection.displayName = "GallerySection";

export default GallerySection;
