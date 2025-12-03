/**
 * Privacy Policy Page (Placeholder)
 */

import type { Metadata } from 'next';
import { PageContainer, Section } from '../../../components/layout/PageShell';
import { ResearchDisclaimer } from '../../../components/compliance/ResearchDisclaimer';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for PEPTIDES - how we collect, use, and protect your information.',
};

export default function PrivacyPage(): JSX.Element {
  return (
    <PageContainer narrow>
      <Section title="Privacy Policy">
        <div className="prose prose-gray max-w-none">
          <p className="text-body text-[var(--peptide-fg-muted)]">
            This page is under construction. Our full privacy policy will be available soon.
          </p>

          <div className="mt-8 p-6 bg-[var(--peptide-bg-alt)] rounded-lg">
            <h3 className="text-h4 text-[var(--peptide-fg)] mb-4">Key Points</h3>
            <ul className="space-y-2 text-body-sm text-[var(--peptide-fg-muted)]">
              <li>We collect only necessary information for order processing</li>
              <li>Your data is encrypted and securely stored</li>
              <li>We never sell your personal information to third parties</li>
              <li>You can request data deletion at any time</li>
            </ul>
          </div>

          <div className="mt-8">
            <p className="text-body-sm text-[var(--peptide-fg-muted)]">
              For questions about our privacy practices, please contact us at{' '}
              <a
                href="mailto:privacy@peptides.com"
                className="text-[var(--peptide-primary)] hover:underline"
              >
                privacy@peptides.com
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
