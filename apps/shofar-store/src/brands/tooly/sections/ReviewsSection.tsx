/**
 * ReviewsSection - Customer testimonials
 * WO 3.1 Implementation
 *
 * Features:
 * - Uses ReviewsMarquee component pattern
 * - Placeholder reviews with glass styling
 * - Will be wired to real reviews in Phase 2
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ReviewsSectionProps {
  className?: string;
}

const REVIEWS = [
  {
    id: 1,
    author: 'Alex M.',
    rating: 5,
    text: 'Absolutely incredible build quality. The precision is unmatched in this price range.',
    verified: true,
  },
  {
    id: 2,
    author: 'Sarah K.',
    rating: 5,
    text: 'Best purchase I\'ve made all year. The airflow design makes such a difference.',
    verified: true,
  },
  {
    id: 3,
    author: 'Marcus T.',
    rating: 5,
    text: 'The Cerakote finish is stunning. Looks even better in person.',
    verified: true,
  },
  {
    id: 4,
    author: 'Jennifer L.',
    rating: 4,
    text: 'Great product, fast shipping. Would recommend to anyone looking for quality.',
    verified: true,
  },
  {
    id: 5,
    author: 'David R.',
    rating: 5,
    text: 'Customer service was excellent when I had questions. Product exceeded expectations.',
    verified: true,
  },
  {
    id: 6,
    author: 'Emily W.',
    rating: 5,
    text: 'The attention to detail is remarkable. You can tell this was made with care.',
    verified: true,
  },
];

function StarRating({ rating }: { rating: number }): React.ReactElement {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={cn('w-4 h-4', i < rating ? 'text-yellow-400' : 'text-white/20')}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function ReviewsSection({ className }: ReviewsSectionProps): React.ReactElement {
  return (
    <section
      id="reviews"
      className={cn('py-16 md:py-24', className)}
      aria-labelledby="reviews-heading"
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
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

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className={cn(
                'p-6 rounded-xl',
                'bg-white/[0.04] border border-white/[0.08]',
                'hover:border-white/[0.12]',
                'transition-all duration-300'
              )}
            >
              {/* Rating */}
              <div className="mb-4">
                <StarRating rating={review.rating} />
              </div>

              {/* Review Text */}
              <p className="text-white/80 mb-4 leading-relaxed">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                {/* Avatar Placeholder */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#02fcef]/20 to-[#a02bfe]/20 flex items-center justify-center">
                  <span className="text-sm font-medium text-white/60">
                    {review.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{review.author}</p>
                  {review.verified && (
                    <p className="flex items-center gap-1 text-xs text-emerald-400">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Verified Purchase
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-white/[0.04] border border-white/[0.08]">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold text-white">4.9</span>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            <span className="w-px h-6 bg-white/20" />
            <span className="text-sm text-white/60">Based on 2,500+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
}

ReviewsSection.displayName = 'ReviewsSection';

export default ReviewsSection;
