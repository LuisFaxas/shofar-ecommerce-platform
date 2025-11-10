/**
 * Navbar Component
 * Glass-styled navigation header with cart integration
 * Core navigation component for TOOLY e-commerce
 */

'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ButtonSecondary } from './ButtonSecondary';
import { ButtonPill } from './ButtonPill';

export interface NavbarProps {
  /** Logo element or text */
  logo?: React.ReactNode;
  /** Navigation links */
  links?: Array<{
    label: string;
    href: string;
    active?: boolean;
  }>;
  /** Cart item count */
  cartCount?: number;
  /** User logged in state */
  isLoggedIn?: boolean;
  /** User name/email */
  userName?: string;
  /** Search placeholder */
  searchPlaceholder?: string;
  /** On search callback */
  onSearch?: (query: string) => void;
  /** On cart click */
  onCartClick?: () => void;
  /** On user menu click */
  onUserClick?: () => void;
  /** Sticky navbar */
  sticky?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * E-commerce navigation header with glass styling
 * Includes logo, search, cart, and user menu
 */
export const Navbar: React.FC<NavbarProps> = ({
  logo = 'TOOLY',
  links = [],
  cartCount = 0,
  isLoggedIn = false,
  userName,
  searchPlaceholder = 'Search for tools...',
  onSearch,
  onCartClick,
  onUserClick,
  sticky = true,
  className
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <nav
      className={cn(
        'relative z-50',
        'bg-[#0b0e14]/80 backdrop-blur-xl',
        'border-b border-white/[0.08]',
        sticky && 'sticky top-0',
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-2">
              {typeof logo === 'string' ? (
                <span className="text-2xl font-bold bg-gradient-to-r from-[#02fcef] via-[#ffb52b] to-[#a02bfe] bg-clip-text text-transparent">
                  {logo}
                </span>
              ) : (
                logo
              )}
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center flex-1 mx-8">
            {/* Nav Links */}
            <div className="flex items-center gap-1">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium',
                    'transition-all duration-200',
                    link.active ? (
                      'bg-white/[0.08] text-white'
                    ) : (
                      'text-white/70 hover:text-white hover:bg-white/[0.05]'
                    )
                  )}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Search Bar - Centered */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex-1 max-w-xl mx-auto px-6"
            >
              <div className="relative">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder={searchPlaceholder}
                  className={cn(
                    'w-full h-10 pl-10 pr-4 rounded-full',
                    'bg-white/[0.08] backdrop-blur-md',
                    'border border-white/[0.14]',
                    'text-white placeholder-white/40',
                    'transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-white/20',
                    'focus:bg-white/[0.12] focus:border-white/[0.20]'
                  )}
                />
                {/* Search Icon */}
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {/* Search Button (optional) */}
                {isSearchFocused && searchQuery && (
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs hover:bg-white/20 transition-colors"
                  >
                    Search
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right Section - Cart & User */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className={cn(
                'relative p-2 rounded-lg',
                'text-white/80 hover:text-white',
                'hover:bg-white/[0.08] transition-all duration-200'
              )}
              aria-label={`Cart with ${cartCount} items`}
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {/* Cart Badge */}
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full bg-gradient-to-r from-[#02fcef] to-[#a02bfe] text-[10px] font-bold text-white">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            {isLoggedIn ? (
              <button
                onClick={onUserClick}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg',
                  'text-white/80 hover:text-white',
                  'hover:bg-white/[0.08] transition-all duration-200'
                )}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#02fcef] to-[#a02bfe] flex items-center justify-center text-white font-bold text-sm">
                  {userName ? userName[0].toUpperCase() : 'U'}
                </div>
                <span className="hidden md:block text-sm font-medium">
                  {userName || 'Account'}
                </span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <ButtonPill variant="ghost" size="sm" onClick={onUserClick}>
                  Sign In
                </ButtonPill>
                <ButtonSecondary size="sm" onClick={onUserClick}>
                  Sign Up
                </ButtonSecondary>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                'lg:hidden p-2 rounded-lg',
                'text-white/80 hover:text-white',
                'hover:bg-white/[0.08] transition-all duration-200'
              )}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/[0.08]">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="mb-4">
              <div className="relative">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className={cn(
                    'w-full h-10 pl-10 pr-4 rounded-lg',
                    'bg-white/[0.08] backdrop-blur-md',
                    'border border-white/[0.14]',
                    'text-white placeholder-white/40',
                    'focus:outline-none focus:ring-2 focus:ring-white/20'
                  )}
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </form>

            {/* Mobile Links */}
            <div className="space-y-1">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className={cn(
                    'block px-3 py-2 rounded-lg text-sm font-medium',
                    'transition-all duration-200',
                    link.active ? (
                      'bg-white/[0.08] text-white'
                    ) : (
                      'text-white/70 hover:text-white hover:bg-white/[0.05]'
                    )
                  )}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Mobile Sign In/Up */}
            {!isLoggedIn && (
              <div className="mt-4 flex items-center gap-2 sm:hidden">
                <ButtonPill variant="ghost" size="sm" fullWidth onClick={onUserClick}>
                  Sign In
                </ButtonPill>
                <ButtonSecondary size="sm" fullWidth onClick={onUserClick}>
                  Sign Up
                </ButtonSecondary>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Glass shine effect */}
      <span
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        aria-hidden="true"
      />
    </nav>
  );
};

Navbar.displayName = 'Navbar';

export default Navbar;