/**
 * Design System Page
 *
 * DEV-ONLY: This page showcases all design system components.
 * Only accessible in development mode.
 *
 * Route: /design-system
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { DesignSystemContent } from './DesignSystemContent';

export const metadata: Metadata = {
  title: 'Design System',
  robots: { index: false, follow: false },
};

/**
 * Design System Page Component (Server Component)
 *
 * Thin wrapper that handles dev-only guard and metadata.
 * All interactive content is in DesignSystemContent (Client Component).
 */
export default function DesignSystemPage(): JSX.Element {
  // Dev-only guard
  if (process.env.NODE_ENV !== 'development') {
    notFound();
  }

  return <DesignSystemContent />;
}
