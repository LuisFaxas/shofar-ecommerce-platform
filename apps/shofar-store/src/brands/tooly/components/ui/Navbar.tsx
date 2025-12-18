/**
 * Navbar Component
 * Glass-styled navigation header with cart integration
 * Core navigation component for TOOLY e-commerce
 *
 * WO 3.1 Enhancements:
 * - Wire cart badge to useCart().itemCount (or cartCount prop fallback)
 * - Add anchor links for one-page navigation
 * - Add focus-trap-react for mobile menu accessibility
 * - Add data-testid attributes
 * - ESC key closes mobile menu
 */

"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import FocusTrap from "focus-trap-react";
import { cn } from "@/lib/utils";
import { ButtonSecondary } from "./ButtonSecondary";
import { ButtonPill } from "./ButtonPill";

// Default anchor links for one-page navigation
const NAV_LINKS: Array<{ href: string; label: string; active?: boolean }> = [
  { href: "#product", label: "Shop" },
  { href: "#technology", label: "Technology" },
  { href: "#reviews", label: "Reviews" },
  { href: "#faq", label: "FAQ" },
];

export interface NavbarProps {
  /** Logo element or text */
  logo?: React.ReactNode;
  /** Navigation links (defaults to anchor links) */
  links?: Array<{
    label: string;
    href: string;
    active?: boolean;
  }>;
  /** Cart item count (fallback if not using CartContext) */
  cartCount?: number;
  /** User logged in state */
  isLoggedIn?: boolean;
  /** User name/email */
  userName?: string;
  /** Search placeholder */
  searchPlaceholder?: string;
  /** On search callback */
  onSearch?: (query: string) => void;
  /** On cart click (fallback if not using CartContext) */
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
  logo = "TOOLY",
  links = NAV_LINKS,
  cartCount,
  isLoggedIn = false,
  userName,
  searchPlaceholder = "Search for tools...",
  onSearch,
  onCartClick,
  onUserClick,
  sticky = true,
  className,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Use props for cart (provided by parent component using CartContext)
  const itemCount = cartCount ?? 0;
  const handleCartClick = useCallback(() => {
    // Close mobile menu first if open, then trigger cart
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    if (onCartClick) {
      onCartClick();
    }
  }, [onCartClick, isMobileMenuOpen]);

  // Handle ESC key to close mobile menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleMobileNavClick = useCallback(() => {
    // Close mobile menu when clicking a nav link
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <nav
      className={cn(
        "relative z-50",
        "bg-[#0b0e14]/80 backdrop-blur-xl",
        "border-b border-white/[0.08]",
        sticky && "sticky top-0",
        className,
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              {typeof logo === "string" ? (
                <span className="text-2xl font-bold bg-gradient-to-r from-[#02fcef] via-[#ffb52b] to-[#a02bfe] bg-clip-text text-transparent">
                  {logo}
                </span>
              ) : (
                logo
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium",
                  "transition-all duration-200",
                  link.active
                    ? "bg-white/[0.08] text-white"
                    : "text-white/70 hover:text-white hover:bg-white/[0.05]",
                )}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Section - Cart & User */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <button
              onClick={handleCartClick}
              data-testid="cart-drawer-toggle"
              className={cn(
                "relative p-2 rounded-lg",
                "text-white/80 hover:text-white",
                "hover:bg-white/[0.08] transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
              )}
              aria-label={`Cart with ${itemCount} items`}
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
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full bg-gradient-to-r from-[#02fcef] to-[#a02bfe] text-[10px] font-bold text-white">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            {isLoggedIn ? (
              <button
                onClick={onUserClick}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg",
                  "text-white/80 hover:text-white",
                  "hover:bg-white/[0.08] transition-all duration-200",
                )}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#02fcef] to-[#a02bfe] flex items-center justify-center text-white font-bold text-sm">
                  {userName ? userName[0].toUpperCase() : "U"}
                </div>
                <span className="hidden md:block text-sm font-medium">
                  {userName || "Account"}
                </span>
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
                    d="M19 9l-7 7-7-7"
                  />
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
                "lg:hidden p-2 rounded-lg",
                "text-white/80 hover:text-white",
                "hover:bg-white/[0.08] transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
              )}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Backdrop */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Mobile Menu with Focus Trap */}
        <FocusTrap active={isMobileMenuOpen}>
          <div
            id="mobile-menu"
            className={cn(
              "lg:hidden relative z-50",
              "overflow-hidden transition-all duration-300",
              "bg-[#0b0e14]", // Solid background for menu content
              isMobileMenuOpen
                ? "max-h-screen py-4 border-t border-white/[0.08]"
                : "max-h-0",
            )}
            aria-hidden={!isMobileMenuOpen}
          >
            {/* Mobile Links */}
            <div className="space-y-1">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  onClick={handleMobileNavClick}
                  tabIndex={isMobileMenuOpen ? 0 : -1}
                  className={cn(
                    "block px-3 py-2 rounded-lg text-sm font-medium",
                    "transition-all duration-200",
                    link.active
                      ? "bg-white/[0.08] text-white"
                      : "text-white/70 hover:text-white hover:bg-white/[0.05]",
                  )}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Mobile Sign In/Up */}
            {!isLoggedIn && (
              <div className="mt-4 flex items-center gap-2 sm:hidden">
                <ButtonPill
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  onClick={onUserClick}
                  tabIndex={isMobileMenuOpen ? 0 : -1}
                >
                  Sign In
                </ButtonPill>
                <ButtonSecondary
                  size="sm"
                  fullWidth
                  onClick={onUserClick}
                  tabIndex={isMobileMenuOpen ? 0 : -1}
                >
                  Sign Up
                </ButtonSecondary>
              </div>
            )}
          </div>
        </FocusTrap>
      </div>

      {/* Glass shine effect */}
      <span
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        aria-hidden="true"
      />
    </nav>
  );
};

Navbar.displayName = "Navbar";

export default Navbar;
