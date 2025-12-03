/**
 * Shop Layout
 *
 * Wraps all public store pages with PageShell (Header, Footer, Disclaimer).
 * Route group: (shop)
 */

import type { ReactNode } from 'react';
import { PageShell } from '../../components/layout/PageShell';

interface ShopLayoutProps {
  children: ReactNode;
}

export default function ShopLayout({ children }: ShopLayoutProps): JSX.Element {
  return <PageShell>{children}</PageShell>;
}
