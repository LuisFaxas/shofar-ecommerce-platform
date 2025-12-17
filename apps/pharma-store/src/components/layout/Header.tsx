"use client";

/**
 * Header Component
 *
 * Site header for pharma-store with:
 * - Logo placeholder
 * - Search box
 * - Navigation links
 * - Mobile menu support
 */

import { useState } from "react";
import Link from "next/link";

interface NavLink {
  href: string;
  label: string;
}

const NAV_LINKS: NavLink[] = [
  { href: "/products", label: "Products" },
  { href: "/research", label: "Research" },
  { href: "/about", label: "About" },
];

/**
 * Search icon
 */
function SearchIcon({ className = "" }: { className?: string }): JSX.Element {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

/**
 * Menu icon (hamburger)
 */
function MenuIcon({ className = "" }: { className?: string }): JSX.Element {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

/**
 * Close icon (X)
 */
function CloseIcon({ className = "" }: { className?: string }): JSX.Element {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/**
 * Cart icon
 */
function CartIcon({ className = "" }: { className?: string }): JSX.Element {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

interface HeaderProps {
  className?: string;
}

export function Header({ className = "" }: HeaderProps): JSX.Element {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement search navigation
      console.log("Search:", searchQuery);
    }
  };

  return (
    <header
      className={`
        sticky top-0 z-40
        bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]
        border-b border-[var(--peptide-border)]
        shadow-header
        ${className}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2 focus-ring rounded"
            >
              {/* Logo placeholder - replace with actual logo */}
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--peptide-primary)] to-[var(--peptide-secondary)] flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="font-semibold text-lg text-[var(--peptide-fg)] hidden sm:block">
                PEPTIDES
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center gap-6"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="
                  text-sm font-medium text-[var(--peptide-fg)]
                  hover:text-[var(--peptide-primary)] transition-colors
                  focus-ring rounded px-1
                "
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden sm:flex flex-1 max-w-md mx-8"
          >
            <div className="relative w-full">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--peptide-fg-muted)]" />
              <input
                type="search"
                placeholder="Search peptides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
                  w-full pl-10 pr-4 py-2
                  bg-[var(--peptide-bg-alt)] border border-[var(--peptide-border-light)]
                  rounded-lg text-sm text-[var(--peptide-fg)]
                  placeholder:text-[var(--peptide-fg-muted)]
                  focus:outline-none focus:ring-2 focus:ring-[var(--peptide-primary)]/30 focus:border-[var(--peptide-primary)]
                  transition-all duration-200
                "
              />
            </div>
          </form>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {/* Cart button */}
            <Link
              href="/cart"
              className="
                relative p-2 rounded-lg
                text-[var(--peptide-fg-muted)] hover:text-[var(--peptide-fg)]
                hover:bg-[var(--peptide-bg-alt)]
                transition-colors focus-ring
              "
              aria-label="View cart"
            >
              <CartIcon />
              {/* Cart count badge - uncomment when cart context is available */}
              {/* <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--peptide-accent)] text-white text-xs rounded-full flex items-center justify-center">
                0
              </span> */}
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="
                md:hidden p-2 rounded-lg
                text-[var(--peptide-fg-muted)] hover:text-[var(--peptide-fg)]
                hover:bg-[var(--peptide-bg-alt)]
                transition-colors focus-ring
              "
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile Search - below header on mobile */}
        <form onSubmit={handleSearchSubmit} className="sm:hidden pb-3">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--peptide-fg-muted)]" />
            <input
              type="search"
              placeholder="Search peptides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                w-full pl-10 pr-4 py-2
                bg-[var(--peptide-bg-alt)] border border-[var(--peptide-border-light)]
                rounded-lg text-sm text-[var(--peptide-fg)]
                placeholder:text-[var(--peptide-fg-muted)]
                focus:outline-none focus:ring-2 focus:ring-[var(--peptide-primary)]/30 focus:border-[var(--peptide-primary)]
                transition-all duration-200
              "
            />
          </div>
        </form>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <nav
          className="md:hidden border-t border-[var(--peptide-border-light)] bg-[var(--peptide-bg-elevated)]"
          aria-label="Mobile navigation"
        >
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="
                  block px-3 py-2 rounded-lg
                  text-base font-medium text-[var(--peptide-fg)]
                  hover:text-[var(--peptide-primary)] hover:bg-[var(--peptide-bg-alt)]
                  transition-colors focus-ring
                "
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
