/**
 * PageShell Component
 *
 * Layout wrapper combining:
 * - Skip link (accessibility)
 * - ResearchDisclaimer banner (compliance)
 * - Header
 * - Main content area
 * - Footer
 */

import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { ResearchDisclaimer } from '../compliance/ResearchDisclaimer';

interface PageShellProps {
  children: ReactNode;
  /** Hide the global disclaimer banner (use sparingly) */
  hideDisclaimer?: boolean;
  /** Hide header (for special pages like checkout) */
  hideHeader?: boolean;
  /** Hide footer (for special pages like checkout) */
  hideFooter?: boolean;
  /** Additional class for main content area */
  className?: string;
}

export function PageShell({
  children,
  hideDisclaimer = false,
  hideHeader = false,
  hideFooter = false,
  className = '',
}: PageShellProps): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip link for keyboard navigation */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Global research disclaimer banner */}
      {!hideDisclaimer && <ResearchDisclaimer variant="banner" />}

      {/* Site header */}
      {!hideHeader && <Header />}

      {/* Main content */}
      <main
        id="main-content"
        className={`flex-1 ${className}`}
        tabIndex={-1}
      >
        {children}
      </main>

      {/* Site footer */}
      {!hideFooter && <Footer />}
    </div>
  );
}

/**
 * Page container for consistent max-width and padding
 */
interface PageContainerProps {
  children: ReactNode;
  className?: string;
  /** Use narrower max-width for content pages */
  narrow?: boolean;
}

export function PageContainer({
  children,
  className = '',
  narrow = false,
}: PageContainerProps): JSX.Element {
  return (
    <div
      className={`
        mx-auto px-4 sm:px-6 lg:px-8 py-8
        ${narrow ? 'max-w-4xl' : 'max-w-7xl'}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/**
 * Section component for page sections with consistent spacing
 */
interface SectionProps {
  children: ReactNode;
  className?: string;
  /** Section title */
  title?: string;
  /** Section description */
  description?: string;
}

export function Section({
  children,
  className = '',
  title,
  description,
}: SectionProps): JSX.Element {
  return (
    <section className={`py-8 md:py-12 ${className}`}>
      {(title || description) && (
        <div className="mb-8">
          {title && (
            <h2 className="text-h2 text-[var(--peptide-fg)]">{title}</h2>
          )}
          {description && (
            <p className="mt-2 text-body text-[var(--peptide-fg-muted)]">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
