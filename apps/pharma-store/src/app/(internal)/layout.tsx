/**
 * Internal Layout
 *
 * Minimal layout for internal/dev-only pages.
 * No PageShell (no Header/Footer/Disclaimer).
 * Route group: (internal)
 */

import type { ReactNode } from 'react';

interface InternalLayoutProps {
  children: ReactNode;
}

export default function InternalLayout({ children }: InternalLayoutProps): JSX.Element {
  return (
    <div className="min-h-screen bg-[var(--peptide-bg)]">
      {children}
    </div>
  );
}
