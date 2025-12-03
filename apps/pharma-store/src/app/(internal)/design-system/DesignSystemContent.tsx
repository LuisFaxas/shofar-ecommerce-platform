'use client';

/**
 * Design System Content (Client Component)
 *
 * Contains all interactive design system showcase components.
 * Separated from page.tsx to allow event handlers while keeping metadata in server component.
 */

import { Button } from '../../../components/ui/Button';
import { Input, Textarea } from '../../../components/ui/Input';
import { Badge, Pill } from '../../../components/ui/Badge';
import { GlassPanel, GlassCard, ColorSwatch } from '../../../components/ui/GlassPanel';
import { ProductCard, MOCK_PRODUCTS } from '../../../components/catalog/ProductCard';
import { ResearchDisclaimer } from '../../../components/compliance/ResearchDisclaimer';

/**
 * Section wrapper component
 */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <section className="py-8 border-b border-[var(--peptide-border)]">
      <h2 className="text-h2 text-[var(--peptide-fg)] mb-6">{title}</h2>
      {children}
    </section>
  );
}

/**
 * Design System Content Component
 */
export function DesignSystemContent(): JSX.Element {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-display text-[var(--peptide-fg)]">
          PEPTIDES Design System
        </h1>
        <p className="mt-4 text-body text-[var(--peptide-fg-muted)] max-w-2xl">
          Component library and design tokens for the pharma-store. This page is only
          visible in development mode.
        </p>
        <div className="mt-4">
          <Badge variant="warning" badgeStyle="subtle">
            Development Only
          </Badge>
        </div>
      </div>

      {/* Colors */}
      <Section title="Colors">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
          <ColorSwatch color="var(--peptide-primary)" name="Primary" value="#6366F1" />
          <ColorSwatch color="var(--peptide-primary-dark)" name="Primary Dark" value="#4F46E5" />
          <ColorSwatch color="var(--peptide-primary-light)" name="Primary Light" value="#818CF8" />
          <ColorSwatch color="var(--peptide-secondary)" name="Secondary" value="#8B5CF6" />
          <ColorSwatch color="var(--peptide-secondary-dark)" name="Secondary Dark" value="#7C3AED" />
          <ColorSwatch color="var(--peptide-secondary-light)" name="Secondary Light" value="#A78BFA" />
          <ColorSwatch color="var(--peptide-accent)" name="Accent" value="#10B981" />
          <ColorSwatch color="var(--peptide-accent-dark)" name="Accent Dark" value="#059669" />
          <ColorSwatch color="var(--peptide-accent-light)" name="Accent Light" value="#34D399" />
          <ColorSwatch color="var(--peptide-bg)" name="Background" value="#FAFAFA" />
          <ColorSwatch color="var(--peptide-fg)" name="Foreground" value="#111827" />
          <ColorSwatch color="var(--peptide-fg-muted)" name="Muted" value="#6B7280" />
        </div>
      </Section>

      {/* Typography */}
      <Section title="Typography">
        <div className="space-y-4">
          <div>
            <span className="text-caption block mb-1">Display</span>
            <p className="text-display">The quick brown fox</p>
          </div>
          <div>
            <span className="text-caption block mb-1">H1</span>
            <p className="text-h1">The quick brown fox</p>
          </div>
          <div>
            <span className="text-caption block mb-1">H2</span>
            <p className="text-h2">The quick brown fox</p>
          </div>
          <div>
            <span className="text-caption block mb-1">H3</span>
            <p className="text-h3">The quick brown fox</p>
          </div>
          <div>
            <span className="text-caption block mb-1">H4</span>
            <p className="text-h4">The quick brown fox</p>
          </div>
          <div>
            <span className="text-caption block mb-1">Body</span>
            <p className="text-body">The quick brown fox jumps over the lazy dog.</p>
          </div>
          <div>
            <span className="text-caption block mb-1">Body Small</span>
            <p className="text-body-sm">The quick brown fox jumps over the lazy dog.</p>
          </div>
          <div>
            <span className="text-caption block mb-1">Caption</span>
            <p className="text-caption">The quick brown fox jumps over the lazy dog.</p>
          </div>
        </div>
      </Section>

      {/* Buttons */}
      <Section title="Buttons">
        <div className="space-y-6">
          {/* Variants */}
          <div>
            <h3 className="text-h4 text-[var(--peptide-fg)] mb-3">Variants</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h3 className="text-h4 text-[var(--peptide-fg)] mb-3">Sizes</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>

          {/* States */}
          <div>
            <h3 className="text-h4 text-[var(--peptide-fg)] mb-3">States</h3>
            <div className="flex flex-wrap gap-3">
              <Button>Default</Button>
              <Button disabled>Disabled</Button>
              <Button isLoading>Loading</Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Inputs */}
      <Section title="Inputs">
        <div className="max-w-md space-y-6">
          <Input
            label="Default Input"
            placeholder="Enter text..."
            helperText="This is helper text"
          />
          <Input
            label="With Error"
            placeholder="Enter text..."
            error="This field is required"
          />
          <Input
            label="Disabled"
            placeholder="Disabled input"
            disabled
          />
          <Input
            label="With Left Icon"
            placeholder="Search..."
            leftElement={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
          <Textarea
            label="Textarea"
            placeholder="Enter longer text..."
            helperText="Supports multiline input"
          />
        </div>
      </Section>

      {/* Badges */}
      <Section title="Badges & Pills">
        <div className="space-y-6">
          {/* Badge variants */}
          <div>
            <h3 className="text-h4 text-[var(--peptide-fg)] mb-3">Badge Variants (Subtle)</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
            </div>
          </div>

          {/* Badge styles */}
          <div>
            <h3 className="text-h4 text-[var(--peptide-fg)] mb-3">Badge Styles</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary" badgeStyle="subtle">Subtle</Badge>
              <Badge variant="primary" badgeStyle="solid">Solid</Badge>
              <Badge variant="primary" badgeStyle="outline">Outline</Badge>
            </div>
          </div>

          {/* Pills */}
          <div>
            <h3 className="text-h4 text-[var(--peptide-fg)] mb-3">Pills</h3>
            <div className="flex flex-wrap gap-2">
              <Pill variant="primary">Filter Active</Pill>
              <Pill variant="secondary" onRemove={() => console.log('Remove clicked')}>Removable</Pill>
              <Pill variant="success" interactive>Interactive</Pill>
            </div>
          </div>
        </div>
      </Section>

      {/* Glass Panels */}
      <Section title="Glassmorphism">
        <div className="grid md:grid-cols-3 gap-6">
          <GlassPanel>
            <h3 className="text-h4 text-[var(--peptide-fg)] mb-2">Glass Panel</h3>
            <p className="text-body-sm text-[var(--peptide-fg-muted)]">
              Default glass effect with blur and transparency.
            </p>
          </GlassPanel>

          <GlassPanel variant="subtle">
            <h3 className="text-h4 text-[var(--peptide-fg)] mb-2">Subtle Glass</h3>
            <p className="text-body-sm text-[var(--peptide-fg-muted)]">
              Less prominent glass effect for secondary content.
            </p>
          </GlassPanel>

          <GlassPanel variant="solid">
            <h3 className="text-h4 text-[var(--peptide-fg)] mb-2">Solid Panel</h3>
            <p className="text-body-sm text-[var(--peptide-fg-muted)]">
              No glass effect, solid background.
            </p>
          </GlassPanel>
        </div>

        <div className="mt-6">
          <h3 className="text-h4 text-[var(--peptide-fg)] mb-3">Glass Card</h3>
          <div className="max-w-sm">
            <GlassCard
              title="Card Title"
              description="A hoverable card with glass effect"
              footer={<Button size="sm">Action</Button>}
            >
              <p className="text-body-sm text-[var(--peptide-fg-muted)]">
                Card content goes here. This card has a hover effect.
              </p>
            </GlassCard>
          </div>
        </div>
      </Section>

      {/* Product Cards */}
      <Section title="Product Cards">
        <div className="space-y-8">
          {/* Thumbnail Grid */}
          <div>
            <h3 className="text-h4 text-[var(--peptide-fg)] mb-4">Thumbnail View</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {MOCK_PRODUCTS.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant="thumbnail"
                  showQuickView
                  onQuickView={(p) => console.log('Quick view:', p.name)}
                />
              ))}
            </div>
          </div>

          {/* Detail List */}
          <div>
            <h3 className="text-h4 text-[var(--peptide-fg)] mb-4">Detail View</h3>
            <div className="space-y-4">
              {MOCK_PRODUCTS.slice(0, 2).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant="detail"
                  showQuickView
                  onQuickView={(p) => console.log('Quick view:', p.name)}
                />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Research Disclaimer */}
      <Section title="Research Disclaimer">
        <div className="space-y-6">
          <div>
            <h3 className="text-h4 text-[var(--peptide-fg)] mb-3">Banner (Global)</h3>
            <ResearchDisclaimer variant="banner" />
          </div>

          <div>
            <h3 className="text-h4 text-[var(--peptide-fg)] mb-3">Inline</h3>
            <ResearchDisclaimer variant="inline" />
          </div>

          <div>
            <h3 className="text-h4 text-[var(--peptide-fg)] mb-3">Footer</h3>
            <ResearchDisclaimer variant="footer" />
          </div>

          <div>
            <h3 className="text-h4 text-[var(--peptide-fg)] mb-3">Card</h3>
            <div className="max-w-md">
              <ResearchDisclaimer variant="card">
                This product is intended for laboratory research only. Not approved for human consumption.
              </ResearchDisclaimer>
            </div>
          </div>
        </div>
      </Section>

      {/* Spacing Reference */}
      <Section title="Spacing Scale">
        <div className="flex items-end gap-4">
          {[
            { name: 'xs', size: 'var(--spacing-xs)' },
            { name: 'sm', size: 'var(--spacing-sm)' },
            { name: 'md', size: 'var(--spacing-md)' },
            { name: 'lg', size: 'var(--spacing-lg)' },
            { name: 'xl', size: 'var(--spacing-xl)' },
          ].map(({ name, size }) => (
            <div key={name} className="flex flex-col items-center gap-2">
              <div
                className="bg-[var(--peptide-primary)]"
                style={{ width: size, height: size }}
              />
              <span className="text-caption">{name}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Border Radius Reference */}
      <Section title="Border Radius">
        <div className="flex items-center gap-4">
          {[
            { name: 'sm', radius: 'var(--radius-sm)' },
            { name: 'md', radius: 'var(--radius-md)' },
            { name: 'lg', radius: 'var(--radius-lg)' },
            { name: 'xl', radius: 'var(--radius-xl)' },
          ].map(({ name, radius }) => (
            <div key={name} className="flex flex-col items-center gap-2">
              <div
                className="w-16 h-16 bg-[var(--peptide-primary)]"
                style={{ borderRadius: radius }}
              />
              <span className="text-caption">{name}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
