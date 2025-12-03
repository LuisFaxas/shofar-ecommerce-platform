/**
 * Terms of Service Page (Placeholder)
 */

import type { Metadata } from 'next';
import { PageContainer, Section } from '../../../components/layout/PageShell';
import { ResearchDisclaimer } from '../../../components/compliance/ResearchDisclaimer';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions for using PEPTIDES services and purchasing products.',
};

export default function TermsPage(): JSX.Element {
  return (
    <PageContainer narrow>
      <Section title="Terms of Service">
        <div className="prose prose-gray max-w-none">
          <p className="text-body text-[var(--peptide-fg-muted)]">
            This page is under construction. Our full terms of service will be available soon.
          </p>

          {/* Important Notice */}
          <div className="mt-8">
            <ResearchDisclaimer variant="card">
              By purchasing from PEPTIDES, you acknowledge that all products are intended
              for laboratory research purposes only and are not for human consumption.
            </ResearchDisclaimer>
          </div>

          <div className="mt-8 p-6 bg-[var(--peptide-bg-alt)] rounded-lg">
            <h3 className="text-h4 text-[var(--peptide-fg)] mb-4">Key Terms</h3>
            <ul className="space-y-2 text-body-sm text-[var(--peptide-fg-muted)]">
              <li>Products are sold for research purposes only</li>
              <li>Purchasers must be 18 years or older</li>
              <li>Products may not be resold for human consumption</li>
              <li>All sales are subject to our refund policy</li>
            </ul>
          </div>

          <div className="mt-8 p-6 border border-[var(--peptide-border)] rounded-lg">
            <h3 className="text-h4 text-[var(--peptide-fg)] mb-4">Acceptable Use</h3>
            <p className="text-body-sm text-[var(--peptide-fg-muted)]">
              All products sold by PEPTIDES are intended solely for use in legitimate
              scientific research conducted by qualified researchers. By purchasing our
              products, you agree to use them only for lawful research purposes in
              accordance with all applicable laws and regulations.
            </p>
          </div>

          <div className="mt-8">
            <p className="text-body-sm text-[var(--peptide-fg-muted)]">
              For questions about our terms, please contact us at{' '}
              <a
                href="mailto:legal@peptides.com"
                className="text-[var(--peptide-primary)] hover:underline"
              >
                legal@peptides.com
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
