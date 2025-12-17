/**
 * ReviewsMarquee Component
 * Work Order 2.5.REBOOT
 *
 * Resend-inspired auto-scrolling reviews marquee
 * Continuous horizontal scroll with glassmorphic cards
 */

"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface Review {
  id: string;
  author: string;
  role?: string;
  company?: string;
  content: string;
  rating?: number;
  date?: string;
  verified?: boolean;
}

export interface ReviewsMarqueeProps {
  /** Reviews to display */
  reviews: Review[];
  /** Scroll direction */
  direction?: "left" | "right";
  /** Scroll speed (lower is faster) */
  duration?: number;
  /** Pause on hover */
  pauseOnHover?: boolean;
  /** Show gradient fade edges */
  showFade?: boolean;
  /** Gap between cards */
  gap?: "sm" | "md" | "lg";
  /** Custom className */
  className?: string;
}

/**
 * Auto-scrolling marquee of review cards
 * Inspired by Resend's testimonial sections
 */
export const ReviewsMarquee: React.FC<ReviewsMarqueeProps> = ({
  reviews,
  direction = "left",
  duration = 40,
  pauseOnHover = true,
  showFade = true,
  gap = "md",
  className,
}) => {
  const gapClasses = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
  };

  // Duplicate reviews for seamless loop
  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        showFade && "gradient-fade-x",
        className,
      )}
    >
      <div
        className={cn(
          "flex",
          gapClasses[gap],
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
        style={{
          animation: `marquee-${direction} ${duration}s linear infinite`,
          width: "max-content",
        }}
      >
        {duplicatedReviews.map((review, index) => (
          <ReviewCard key={`${review.id}-${index}`} review={review} />
        ))}
      </div>
    </div>
  );
};

// Individual review card component
const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  return (
    <div
      className={cn(
        // Glass effect
        "bg-white/[0.04] backdrop-blur-md",
        "border border-white/[0.08]",
        "rounded-xl p-6",
        "min-w-[320px] max-w-[400px]",
        "transition-all duration-300",

        // Hover state
        "hover:bg-white/[0.06]",
        "hover:border-white/[0.12]",
        "hover:shadow-[0_6px_24px_rgba(0,0,0,0.15)]",
      )}
    >
      {/* Rating stars */}
      {review.rating !== undefined && (
        <div className="flex gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon
              key={i}
              filled={i < (review.rating ?? 0)}
              className="w-4 h-4"
            />
          ))}
        </div>
      )}

      {/* Review content */}
      <blockquote className="text-white/80 text-sm leading-relaxed mb-4">
        &quot;{review.content}&quot;
      </blockquote>

      {/* Author info */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-white font-medium text-sm">{review.author}</p>
            {review.verified && <VerifiedBadge />}
          </div>
          {(review.role || review.company) && (
            <p className="text-white/50 text-xs mt-0.5">
              {review.role}
              {review.role && review.company && " at "}
              {review.company}
            </p>
          )}
        </div>
        {review.date && (
          <time className="text-white/40 text-xs">{review.date}</time>
        )}
      </div>
    </div>
  );
};

// Star icon component
const StarIcon: React.FC<{
  filled?: boolean;
  className?: string;
}> = ({ filled = false, className }) => (
  <svg
    className={cn(
      filled ? "text-[var(--color-brand-3)]" : "text-white/20",
      className,
    )}
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

// Verified badge component
const VerifiedBadge: React.FC = () => (
  <svg
    className="w-4 h-4 text-[var(--color-brand-2)]"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

// Multi-row marquee variant
export const ReviewsMarqueeMultiRow: React.FC<{
  reviews: Review[][];
  duration?: number;
  gap?: "sm" | "md" | "lg";
  className?: string;
}> = ({ reviews, duration = 40, gap = "md", className }) => {
  const gapClasses = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
  };

  return (
    <div className={cn("flex flex-col", gapClasses[gap], className)}>
      {reviews.map((row, index) => (
        <ReviewsMarquee
          key={index}
          reviews={row}
          direction={index % 2 === 0 ? "left" : "right"}
          duration={duration}
          gap={gap}
          showFade={true}
        />
      ))}
    </div>
  );
};

// Add marquee animation keyframes
const marqueeKeyframes = `
  @keyframes marquee-left {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-50%);
    }
  }

  @keyframes marquee-right {
    from {
      transform: translateX(-50%);
    }
    to {
      transform: translateX(0);
    }
  }
`;

// Inject keyframes on component mount
if (
  typeof window !== "undefined" &&
  !document.querySelector("#marquee-keyframes")
) {
  const style = document.createElement("style");
  style.id = "marquee-keyframes";
  style.textContent = marqueeKeyframes;
  document.head.appendChild(style);
}

ReviewsMarquee.displayName = "ReviewsMarquee";
ReviewsMarqueeMultiRow.displayName = "ReviewsMarqueeMultiRow";

export default ReviewsMarquee;
