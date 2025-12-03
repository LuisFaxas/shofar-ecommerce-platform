/**
 * Refund Policy Page (Placeholder)
 */

import type { Metadata } from 'next';
import { PageContainer, Section } from '../../../components/layout/PageShell';
import { ResearchDisclaimer } from '../../../components/compliance/ResearchDisclaimer';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Refund and return policy for PEPTIDES products.',
};

export default function RefundsPage(): JSX.Element {
  return (
    <PageContainer narrow>
      <Section title="Refund Policy">
        <div className="prose prose-gray max-w-none">
          <p className="text-body text-[var(--peptide-fg-muted)]">
            This page is under construction. Our full refund policy will be available soon.
          </p>

          <div className="mt-8 p-6 bg-[var(--peptide-bg-alt)] rounded-lg">
            <h3 className="text-h4 text-[var(--peptide-fg)] mb-4">Return Eligibility</h3>
            <ul className="space-y-2 text-body-sm text-[var(--peptide-fg-muted)]">
              <li>Products must be returned within 30 days of purchase</li>
              <li>Items must be unopened and in original packaging</li>
              <li>Proof of purchase is required for all returns</li>
              <li>Custom synthesis orders are non-refundable</li>
            </ul>
          </div>

          <div className="mt-8 p-6 border border-[var(--peptide-border)] rounded-lg">
            <h3 className="text-h4 text-[var(--peptide-fg)] mb-4">Refund Process</h3>
            <ol className="space-y-2 text-body-sm text-[var(--peptide-fg-muted)] list-decimal list-inside">
              <li>Contact our support team to initiate a return</li>
              <li>Receive a Return Merchandise Authorization (RMA) number</li>
              <li>Ship the product back with the RMA clearly marked</li>
              <li>Refund processed within 5-7 business days of receipt</li>
            </ol>
          </div>

          <div className="mt-8">
            <p className="text-body-sm text-[var(--peptide-fg-muted)]">
              For refund inquiries, please contact us at{' '}
              <a
                href="mailto:returns@peptides.com"
                className="text-[var(--peptide-primary)] hover:underline"
              >
                returns@peptides.com
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
