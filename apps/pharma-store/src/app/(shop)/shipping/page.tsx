/**
 * Shipping Policy Page (Placeholder)
 */

import type { Metadata } from 'next';
import { PageContainer, Section } from '../../../components/layout/PageShell';
import { ResearchDisclaimer } from '../../../components/compliance/ResearchDisclaimer';

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description: 'Shipping information for PEPTIDES - delivery times, methods, and policies.',
};

export default function ShippingPage(): JSX.Element {
  return (
    <PageContainer narrow>
      <Section title="Shipping Policy">
        <div className="prose prose-gray max-w-none">
          <p className="text-body text-[var(--peptide-fg-muted)]">
            This page is under construction. Our full shipping policy will be available soon.
          </p>

          <div className="mt-8 p-6 bg-[var(--peptide-bg-alt)] rounded-lg">
            <h3 className="text-h4 text-[var(--peptide-fg)] mb-4">Shipping Information</h3>
            <ul className="space-y-2 text-body-sm text-[var(--peptide-fg-muted)]">
              <li>Orders ship within 1-2 business days</li>
              <li>Free shipping on orders over $100</li>
              <li>Temperature-controlled packaging available</li>
              <li>International shipping to select countries</li>
            </ul>
          </div>

          <div className="mt-8 p-6 border border-[var(--peptide-border)] rounded-lg">
            <h3 className="text-h4 text-[var(--peptide-fg)] mb-4">Delivery Times</h3>
            <table className="w-full text-body-sm">
              <tbody>
                <tr className="border-b border-[var(--peptide-border)]">
                  <td className="py-2 text-[var(--peptide-fg)]">Standard Shipping</td>
                  <td className="py-2 text-[var(--peptide-fg-muted)]">5-7 business days</td>
                </tr>
                <tr className="border-b border-[var(--peptide-border)]">
                  <td className="py-2 text-[var(--peptide-fg)]">Express Shipping</td>
                  <td className="py-2 text-[var(--peptide-fg-muted)]">2-3 business days</td>
                </tr>
                <tr>
                  <td className="py-2 text-[var(--peptide-fg)]">Overnight</td>
                  <td className="py-2 text-[var(--peptide-fg-muted)]">Next business day</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8">
            <p className="text-body-sm text-[var(--peptide-fg-muted)]">
              For shipping inquiries, please contact us at{' '}
              <a
                href="mailto:shipping@peptides.com"
                className="text-[var(--peptide-primary)] hover:underline"
              >
                shipping@peptides.com
              </a>
            </p>
          </div>
        </div>
      </Section>

      <div className="mt-8">
        <ResearchDisclaimer variant="inline" />
      </div>
    </PageContainer>
  );
}
