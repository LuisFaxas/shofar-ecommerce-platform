'use client';

/**
 * Newsletter Signup Form (Client Component)
 *
 * Extracted from Footer to handle form events.
 */

import { useState, type FormEvent } from 'react';

interface NewsletterFormProps {
  className?: string;
}

export function NewsletterForm({ className = '' }: NewsletterFormProps): JSX.Element {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (!email.trim()) return;

    // Placeholder: In production, this would call an API
    setStatus('loading');

    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      // Reset after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    }, 500);
  }

  return (
    <div className={className}>
      <h3 className="text-sm font-semibold text-[var(--peptide-fg)] mb-2">
        Stay updated
      </h3>
      <p className="text-sm text-[var(--peptide-fg-muted)] mb-4">
        Subscribe to our newsletter for research updates and new products.
      </p>

      {status === 'success' ? (
        <p className="text-sm text-[var(--peptide-accent)] font-medium">
          Thank you for subscribing!
        </p>
      ) : (
        <form className="flex gap-2" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={status === 'loading'}
            className="
              flex-1 px-4 py-2
              bg-[var(--peptide-bg)] border border-[var(--peptide-border)]
              rounded-lg text-sm
              placeholder:text-[var(--peptide-fg-muted)]
              focus:outline-none focus:ring-2 focus:ring-[var(--peptide-primary)] focus:border-transparent
              disabled:opacity-50
            "
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="
              px-4 py-2
              bg-[var(--peptide-primary)] text-white
              rounded-lg text-sm font-medium
              hover:bg-[var(--peptide-primary-dark)]
              transition-colors focus-ring
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      )}
    </div>
  );
}
