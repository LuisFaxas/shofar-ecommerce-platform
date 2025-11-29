/**
 * CredibilitySection - Social proof and trust signals
 * WO 3.1 Implementation
 *
 * Features:
 * - Glass cards with star ratings
 * - "Trusted by X+ customers" stats
 * - Fixed dimensions for zero CLS
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface CredibilitySectionProps {
  className?: string;
}

const STATS = [
  { value: '10,000+', label: 'Happy Customers' },
  { value: '4.9', label: 'Average Rating', stars: true },
  { value: '99%', label: 'Satisfaction Rate' },
  { value: '2 Year', label: 'Warranty' },
];

const TRUST_BADGES = [
  { icon: 'shield', label: 'Secure Checkout' },
  { icon: 'truck', label: 'Free Shipping' },
  { icon: 'refresh', label: '30-Day Returns' },
  { icon: 'support', label: '24/7 Support' },
];

function StarRating({ rating = 5 }: { rating?: number }): React.ReactElement {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={cn('w-5 h-5', i < rating ? 'text-yellow-400' : 'text-white/20')}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TrustIcon({ type }: { type: string }): React.ReactElement {
  const icons: Record<string, React.ReactElement> = {
    shield: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    ),
    truck: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
      />
    ),
    refresh: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
      />
    ),
    support: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
      />
    ),
  };

  return (
    <svg
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      {icons[type] || icons.shield}
    </svg>
  );
}

export function CredibilitySection({ className }: CredibilitySectionProps): React.ReactElement {
  return (
    <section
      id="credibility"
      className={cn('py-16 md:py-24 bg-[#0d1218]', className)}
      aria-labelledby="credibility-heading"
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 id="credibility-heading" className="sr-only">
            Why Choose TOOLY
          </h2>
          <p className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Trusted by Professionals Worldwide
          </p>
          <p className="text-white/60 max-w-xl mx-auto">
            Join thousands of satisfied customers who have elevated their craft with TOOLY
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {STATS.map((stat, index) => (
            <div
              key={index}
              className={cn(
                'p-6 rounded-xl text-center',
                'bg-white/[0.04] border border-white/[0.08]',
                'backdrop-blur-sm'
              )}
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stat.value}
              </div>
              {stat.stars && <StarRating />}
              <div className="text-sm text-white/60 mt-2">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TRUST_BADGES.map((badge, index) => (
            <div
              key={index}
              className={cn(
                'flex items-center gap-3 p-4 rounded-lg',
                'bg-white/[0.02] border border-white/[0.06]'
              )}
            >
              <div className="w-10 h-10 rounded-lg bg-white/[0.08] flex items-center justify-center text-white/60">
                <TrustIcon type={badge.icon} />
              </div>
              <span className="text-sm font-medium text-white/80">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

CredibilitySection.displayName = 'CredibilitySection';

export default CredibilitySection;
