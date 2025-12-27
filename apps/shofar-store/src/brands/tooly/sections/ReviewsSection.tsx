/**
 * ReviewsSection - Customer testimonials
 * WO 3.1 + WO 2.1.2 Implementation
 *
 * Features:
 * - 3-row marquee using ReviewsMarqueeMultiRow
 * - Mock reviews (future: real data from Vendure)
 * - Respects prefers-reduced-motion
 * - Trust badge at bottom
 */

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  ReviewsMarqueeMultiRow,
  type Review,
} from "../components/ui/ReviewsMarquee";

interface ReviewsSectionProps {
  className?: string;
}

// Mock reviews - 9 reviews for 3 rows (3 per row)
const MOCK_REVIEWS: Review[] = [
  {
    id: "1",
    author: "Alex M.",
    role: "Verified Buyer",
    content:
      "Absolutely incredible build quality. The precision is unmatched in this price range.",
    rating: 5,
    verified: true,
  },
  {
    id: "2",
    author: "Sarah K.",
    role: "Verified Buyer",
    content:
      "Best purchase I've made all year. The airflow design makes such a difference.",
    rating: 5,
    verified: true,
  },
  {
    id: "3",
    author: "Marcus T.",
    role: "Verified Buyer",
    content: "The Cerakote finish is stunning. Looks even better in person.",
    rating: 5,
    verified: true,
  },
  {
    id: "4",
    author: "Jennifer L.",
    role: "Verified Buyer",
    content:
      "Great product, fast shipping. Would recommend to anyone looking for quality.",
    rating: 4,
    verified: true,
  },
  {
    id: "5",
    author: "David R.",
    role: "Verified Buyer",
    content:
      "Customer service was excellent when I had questions. Product exceeded expectations.",
    rating: 5,
    verified: true,
  },
  {
    id: "6",
    author: "Emily W.",
    role: "Verified Buyer",
    content:
      "The attention to detail is remarkable. You can tell this was made with care.",
    rating: 5,
    verified: true,
  },
  {
    id: "7",
    author: "Chris P.",
    role: "Verified Buyer",
    content:
      "Worth every penny. Premium quality that you can feel immediately.",
    rating: 5,
    verified: true,
  },
  {
    id: "8",
    author: "Amanda H.",
    role: "Verified Buyer",
    content:
      "Exceeded all my expectations. The engineering is truly next level.",
    rating: 5,
    verified: true,
  },
  {
    id: "9",
    author: "Ryan B.",
    role: "Verified Buyer",
    content:
      "Finally found what I was looking for. Perfect balance of form and function.",
    rating: 5,
    verified: true,
  },
];

// Split into 3 rows for marquee
const reviewRows: Review[][] = [
  MOCK_REVIEWS.slice(0, 3), // Row 1: left direction
  MOCK_REVIEWS.slice(3, 6), // Row 2: right direction
  MOCK_REVIEWS.slice(6, 9), // Row 3: left direction
];

export function ReviewsSection({
  className,
}: ReviewsSectionProps): React.ReactElement {
  return (
    <section
      id="reviews"
      className={cn("py-16 md:py-24 overflow-hidden", className)}
      aria-labelledby="reviews-heading"
    >
      {/* Section Header */}
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2
            id="reviews-heading"
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            What Our Customers Say
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Join thousands of satisfied customers who made the switch to TOOLY
          </p>
        </div>
      </div>

      {/* 3-Row Marquee - full width */}
      <ReviewsMarqueeMultiRow reviews={reviewRows} duration={35} gap="md" />

      {/* Trust Badge */}
      <div className="container mx-auto px-4 md:px-6">
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-white/[0.04] border border-white/[0.08]">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold text-white">4.9</span>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            <span className="w-px h-6 bg-white/20" />
            <span className="text-sm text-white/60">
              Based on 2,500+ reviews
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

ReviewsSection.displayName = "ReviewsSection";

export default ReviewsSection;
