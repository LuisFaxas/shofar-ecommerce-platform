/**
 * Footer Component
 *
 * Site footer for pharma-store with:
 * - Navigation columns
 * - Legal links (Privacy, Shipping, Terms, Refunds)
 * - Research disclaimer
 * - Copyright
 */

import Link from 'next/link';
import { ResearchDisclaimer } from '../compliance/ResearchDisclaimer';
import { NewsletterForm } from './NewsletterForm';

interface FooterLink {
  href: string;
  label: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'Products',
    links: [
      { href: '/products', label: 'All Peptides' },
      { href: '/products?category=research', label: 'Research Peptides' },
      { href: '/products?category=reference', label: 'Reference Standards' },
    ],
  },
  {
    title: 'Research',
    links: [
      { href: '/research', label: 'Articles' },
      { href: '/research/guides', label: 'Research Guides' },
      { href: '/research/protocols', label: 'Protocols' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About Us' },
      { href: '/contact', label: 'Contact' },
      { href: '/faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
      { href: '/shipping', label: 'Shipping Policy' },
      { href: '/refunds', label: 'Refund Policy' },
    ],
  },
];

interface FooterProps {
  className?: string;
}

export function Footer({ className = '' }: FooterProps): JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`
        bg-[var(--peptide-bg-alt)] border-t border-[var(--peptide-border)]
        ${className}
      `}
    >
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-[var(--peptide-fg)] mb-4">
                {column.title}
              </h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="
                        text-sm text-[var(--peptide-fg-muted)]
                        hover:text-[var(--peptide-fg)] transition-colors
                        focus-ring rounded
                      "
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter signup */}
        <div className="mt-12 pt-8 border-t border-[var(--peptide-border)]">
          <NewsletterForm className="max-w-md" />
        </div>
      </div>

      {/* Bottom bar with disclaimer and copyright */}
      <div className="border-t border-[var(--peptide-border)] bg-[var(--peptide-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Disclaimer */}
            <ResearchDisclaimer variant="footer" />

            {/* Copyright */}
            <p className="text-xs text-[var(--peptide-fg-muted)]">
              &copy; {currentYear} PEPTIDES. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
