/**
 * FooterSection - Page footer with navigation and legal links
 * WO 3.1 Implementation
 *
 * Features:
 * - 4-column grid: logo, links, social, legal
 * - Back to top link
 * - Newsletter signup placeholder
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface FooterSectionProps {
  className?: string;
}

const FOOTER_LINKS = {
  product: [
    { label: 'Features', href: '#technology' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Accessories', href: '#accessories' },
  ],
  support: [
    { label: 'FAQ', href: '#faq' },
    { label: 'Shipping', href: '#' },
    { label: 'Returns', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Press', href: '#' },
  ],
};

const SOCIAL_LINKS = [
  {
    name: 'Twitter',
    href: '#',
    icon: (
      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
    ),
  },
  {
    name: 'Instagram',
    href: '#',
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" strokeWidth="2" fill="none" stroke="currentColor" />
        <circle cx="12" cy="12" r="4" strokeWidth="2" fill="none" stroke="currentColor" />
        <circle cx="18" cy="6" r="1" fill="currentColor" />
      </>
    ),
  },
  {
    name: 'YouTube',
    href: '#',
    icon: (
      <path
        fillRule="evenodd"
        d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
        clipRule="evenodd"
      />
    ),
  },
];

export function FooterSection({ className }: FooterSectionProps): React.ReactElement {
  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="footer"
      className={cn('py-16 md:py-20 border-t border-white/[0.08]', className)}
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      <div className="container mx-auto px-4 md:px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            {/* Logo */}
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-[#02fcef] via-[#ffb52b] to-[#a02bfe] bg-clip-text text-transparent">
                TOOLY
              </span>
            </Link>
            <p className="text-sm text-white/60 mb-6 max-w-xs">
              Precision engineered tools for professionals who demand the best.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className={cn(
                    'w-10 h-10 rounded-lg',
                    'bg-white/[0.04] border border-white/[0.08]',
                    'flex items-center justify-center',
                    'text-white/60 hover:text-white hover:bg-white/[0.08]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
                    'transition-all duration-200'
                  )}
                  aria-label={social.name}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    {social.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter (optional) */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <h3 className="text-sm font-semibold text-white mb-4">Stay Updated</h3>
            <p className="text-sm text-white/60 mb-4">
              Get the latest news and exclusive offers.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email"
                className={cn(
                  'flex-1 h-10 px-4 rounded-lg',
                  'bg-white/[0.04] border border-white/[0.14]',
                  'text-white placeholder-white/40 text-sm',
                  'focus:outline-none focus:ring-2 focus:ring-white/20',
                  'transition-all duration-200'
                )}
              />
              <button
                type="submit"
                className={cn(
                  'h-10 px-4 rounded-lg',
                  'bg-white/[0.08] border border-white/[0.14]',
                  'text-white text-sm font-medium',
                  'hover:bg-white/[0.12]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
                  'transition-all duration-200'
                )}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.08]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-white/40">
              &copy; {new Date().getFullYear()} TOOLY by SHOFAR. All rights reserved.
            </p>

            {/* Legal Links */}
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-sm text-white/40 hover:text-white/60 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-white/40 hover:text-white/60 transition-colors"
              >
                Terms of Service
              </a>
              <button
                onClick={handleBackToTop}
                className={cn(
                  'flex items-center gap-1 text-sm text-white/40',
                  'hover:text-white/60 transition-colors',
                  'focus-visible:outline-none focus-visible:underline'
                )}
              >
                Back to top
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

FooterSection.displayName = 'FooterSection';

export default FooterSection;
