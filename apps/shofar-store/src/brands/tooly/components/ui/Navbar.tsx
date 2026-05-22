/**
 * Navbar Component
 * Glass-styled navigation header with cart integration
 * Core navigation component for TOOLY e-commerce
 *
 * WO-FRONTEND-01: Removed search bar, fixed mobile menu close
 */

"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
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
 * Includes logo, nav links, cart, and user menu
 */
export const Navbar: React.FC<NavbarProps> = ({
  logo = "TOOLY",
  links = NAV_LINKS,
  cartCount,
  isLoggedIn = false,
  userName,
  onCartClick,
  onUserClick,
  sticky = true,
  className,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // `transparent` flips to false once the user scrolls past the hero cinemascroll.
  // The navbar is purely chrome on top of the cinematic during the hero scroll.
  const [transparent, setTransparent] = useState(true);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const hero = document.getElementById("hero");
      if (!hero) {
        setTransparent(false);
        return;
      }
      const rect = hero.getBoundingClientRect();
      // Materialize once the hero's bottom passes the navbar's bottom edge.
      // We approximate the navbar height with the larger desktop value so the
      // transition feels consistent across breakpoints.
      const navH = 80;
      setTransparent(rect.bottom > navH);
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        update();
        raf = 0;
      });
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // While the mobile menu is open we always want a solid backdrop, regardless
  // of scroll position, so the menu items read cleanly.
  const showSolid = !transparent || isMobileMenuOpen;

  // Use props for cart (provided by parent component using CartContext)
  const itemCount = cartCount ?? 0;

  const handleCartClick = useCallback(() => {
    // Close mobile menu if open, then trigger cart
    setIsMobileMenuOpen(false);
    if (onCartClick) {
      onCartClick();
    }
  }, [onCartClick]);

  const closeMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

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

  return (
    <>
      {/* Skip to content link - first focusable element for a11y */}
      <a
        href="#main"
        className={cn(
          "sr-only focus:not-sr-only",
          "focus:fixed focus:top-4 focus:left-4 focus:z-[60]",
          "focus:px-4 focus:py-2 focus:rounded-lg",
          "focus:bg-white focus:text-black focus:font-medium",
          "focus:outline-none focus:ring-2 focus:ring-white/50",
          "transition-opacity",
        )}
      >
        Skip to content
      </a>

      {/* Mobile Menu Backdrop - OUTSIDE nav for proper z-index stacking */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden"
          style={{ zIndex: 45 }}
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      <nav
        className={cn(
          // Fixed so the hero cinemascroll sits edge-to-edge at the very top of
          // the page; the navbar floats over content. Subsequent sections supply
          // their own top padding (py-16+) so the navbar never obscures content.
          "fixed inset-x-0 top-0 z-50",
          // Smooth fade between transparent (over hero cinemascroll) and solid
          // (everywhere else / when mobile menu open).
          "transition-[background-color,border-color,backdrop-filter] duration-300",
          showSolid
            ? "bg-[#0b0e14]/80 backdrop-blur-xl border-b border-white/[0.08]"
            : "bg-transparent border-b border-transparent",
          className,
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2">
                {typeof logo === "string" ? (
                  <span className="text-2xl font-semibold tracking-tight text-white">
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

          {/* Mobile Menu */}
          <div
            id="mobile-menu"
            className={cn(
              "lg:hidden",
              "overflow-hidden transition-all duration-300",
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
                  onClick={closeMenu}
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
        </div>

        {/* Glass shine effect — hidden while transparent (over hero) */}
        <span
          className={cn(
            "absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent",
            "transition-opacity duration-300",
            showSolid ? "opacity-100" : "opacity-0",
          )}
          aria-hidden="true"
        />
      </nav>
    </>
  );
};

Navbar.displayName = "Navbar";

export default Navbar;
