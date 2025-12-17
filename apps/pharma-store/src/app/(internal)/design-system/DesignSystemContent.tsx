"use client";

/**
 * Design System Content (Client Component)
 *
 * Contains all interactive design system showcase components.
 * Separated from page.tsx to allow event handlers while keeping metadata in server component.
 */

import React, { type ReactNode, useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Input, Textarea } from "../../../components/ui/Input";
import { Badge, Pill } from "../../../components/ui/Badge";
import {
  GlassPanel,
  GlassCard,
  ColorSwatch,
  SpecCard,
} from "../../../components/ui/GlassPanel";
import {
  ProductCard,
  MOCK_PRODUCTS,
} from "../../../components/catalog/ProductCard";
import {
  FilterPanel,
  FilterBar,
} from "../../../components/catalog/FilterPanel";
import type { ResearchGoal } from "../../../lib/mock-peptides";
import {
  SortSelect,
  type SortOption,
} from "../../../components/catalog/SortSelect";
import { ResearchDisclaimer } from "../../../components/compliance/ResearchDisclaimer";

/**
 * Section wrapper component
 */
function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}): React.JSX.Element {
  return (
    <section className="py-8 border-b border-[var(--peptide-border)]">
      <h2 className="text-h2 text-[var(--peptide-fg-strong)] mb-6">{title}</h2>
      {children}
    </section>
  );
}

/**
 * Design System Content Component
 */
export function DesignSystemContent(): React.JSX.Element {
  // State for filter/sort demos
  const [selectedGoals, setSelectedGoals] = useState<ResearchGoal[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("recommended");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <p className="text-overline mb-2">Ultra-Premium Light Theme</p>
        <h1 className="text-display text-[var(--peptide-fg-strong)]">
          PEPTIDES Design System
        </h1>
        <p className="mt-4 text-body text-[var(--peptide-fg)] max-w-2xl">
          Clinical, Apple-like, research-grade component library for the
          pharma-store. Single light theme with premium frosted glass aesthetic.
        </p>
        <div className="mt-4 flex gap-2">
          <Badge variant="primary" badgeStyle="subtle">
            Light Only
          </Badge>
          <Badge variant="warning" badgeStyle="subtle">
            Development Only
          </Badge>
        </div>
      </div>

      {/* Colors */}
      <Section title="Colors">
        <div className="space-y-8">
          {/* Brand Colors */}
          <div>
            <h3 className="text-h4 text-[var(--peptide-fg-strong)] mb-4">
              Brand Palette
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
              <ColorSwatch
                color="var(--peptide-primary)"
                name="Primary"
                value="#6366F1"
              />
              <ColorSwatch
                color="var(--peptide-primary-dark)"
                name="Primary Dark"
                value="#4F46E5"
              />
              <ColorSwatch
                color="var(--peptide-primary-light)"
                name="Primary Light"
                value="#818CF8"
              />
              <ColorSwatch
                color="var(--peptide-secondary)"
                name="Secondary"
                value="#8B5CF6"
              />
              <ColorSwatch
                color="var(--peptide-secondary-dark)"
                name="Secondary Dark"
                value="#7C3AED"
              />
              <ColorSwatch
                color="var(--peptide-secondary-light)"
                name="Secondary Light"
                value="#A78BFA"
              />
            </div>
          </div>

          {/* Accent */}
          <div>
            <h3 className="text-h4 text-[var(--peptide-fg-strong)] mb-4">
              Accent (Emerald)
            </h3>
            <div className="grid grid-cols-3 gap-4 max-w-md">
              <ColorSwatch
                color="var(--peptide-accent)"
                name="Accent"
                value="#10B981"
              />
              <ColorSwatch
                color="var(--peptide-accent-dark)"
                name="Accent Dark"
                value="#059669"
              />
              <ColorSwatch
                color="var(--peptide-accent-light)"
                name="Accent Light"
                value="#34D399"
              />
            </div>
          </div>

          {/* Surfaces */}
          <div>
            <h3 className="text-h4 text-[var(--peptide-fg-strong)] mb-4">
              Surfaces & Text
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
              <ColorSwatch
                color="var(--peptide-bg)"
                name="Background"
                value="#FAFBFC"
              />
              <ColorSwatch
                color="var(--peptide-bg-alt)"
                name="Background Alt"
                value="#F1F5F9"
              />
              <ColorSwatch
                color="var(--peptide-bg-elevated)"
                name="Elevated"
                value="#FFFFFF"
              />
              <ColorSwatch
                color="var(--peptide-fg-strong)"
                name="Strong"
                value="#020617"
              />
              <ColorSwatch
                color="var(--peptide-fg)"
                name="Foreground"
                value="#0F172A"
              />
              <ColorSwatch
                color="var(--peptide-fg-muted)"
                name="Muted"
                value="#475569"
              />
              <ColorSwatch
                color="var(--peptide-border)"
                name="Border"
                value="#CBD5E1"
              />
            </div>
          </div>
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
            <p className="text-body">
              The quick brown fox jumps over the lazy dog.
            </p>
          </div>
          <div>
            <span className="text-caption block mb-1">Body Small</span>
            <p className="text-body-sm">
              The quick brown fox jumps over the lazy dog.
            </p>
          </div>
          <div>
            <span className="text-caption block mb-1">Caption</span>
            <p className="text-caption">
              The quick brown fox jumps over the lazy dog.
            </p>
          </div>
          <div>
            <span className="text-caption block mb-1">Overline</span>
            <p className="text-overline">Research compound</p>
          </div>
        </div>
      </Section>

      {/* Buttons */}
      <Section title="Buttons">
        <div className="space-y-6">
          {/* Variants */}
          <div>
            <h3 className="text-h4 text-[var(--peptide-fg-strong)] mb-3">
              Variants
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h3 className="text-h4 text-[var(--peptide-fg-strong)] mb-3">
              Sizes
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>

          {/* States */}
          <div>
            <h3 className="text-h4 text-[var(--peptide-fg-strong)] mb-3">
              States
            </h3>
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
          <Input label="Disabled" placeholder="Disabled input" disabled />
          <Input
            label="With Left Icon"
            placeholder="Search..."
            leftElement={
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
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
            <h3 className="text-h4 text-[var(--peptide-fg-strong)] mb-3">
              Badge Variants (Subtle)
            </h3>
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
            <h3 className="text-h4 text-[var(--peptide-fg-strong)] mb-3">
              Badge Styles
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary" badgeStyle="subtle">
                Subtle
              </Badge>
              <Badge variant="primary" badgeStyle="solid">
                Solid
              </Badge>
              <Badge variant="primary" badgeStyle="outline">
                Outline
              </Badge>
            </div>
          </div>

          {/* Pills */}
          <div>
            <h3 className="text-h4 text-[var(--peptide-fg-strong)] mb-3">
              Pills
            </h3>
            <div className="flex flex-wrap gap-2">
              <Pill variant="primary">Filter Active</Pill>
              <Pill
                variant="secondary"
                onRemove={() => console.log("Remove clicked")}
              >
                Removable
              </Pill>
              <Pill variant="success" interactive>
                Interactive
              </Pill>
            </div>
          </div>
        </div>
      </Section>

      {/* Glass Panels */}
      <Section title="Glassmorphism">
        {/* On neutral background */}
        <div>
          <h3 className="text-h4 text-[var(--peptide-fg-strong)] mb-4">
            Panel Variants
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <GlassPanel>
              <h4 className="text-h4 text-[var(--peptide-fg-strong)] mb-2">
                Glass Panel
              </h4>
              <p className="text-body-sm text-[var(--peptide-fg-muted)]">
                Default glass effect with blur and subtle indigo tint.
              </p>
            </GlassPanel>

            <GlassPanel variant="subtle">
              <h4 className="text-h4 text-[var(--peptide-fg-strong)] mb-2">
                Subtle Glass
              </h4>
              <p className="text-body-sm text-[var(--peptide-fg-muted)]">
                Less prominent glass effect for secondary content.
              </p>
            </GlassPanel>

            <GlassPanel variant="solid">
              <h4 className="text-h4 text-[var(--peptide-fg-strong)] mb-2">
                Solid Panel
              </h4>
              <p className="text-body-sm text-[var(--peptide-fg-muted)]">
                Clean white card with subtle shadow.
              </p>
            </GlassPanel>
          </div>
        </div>

        {/* On gradient background to show frosted effect */}
        <div className="mt-8">
          <h3 className="text-h4 text-[var(--peptide-fg-strong)] mb-4">
            Frosted Effect Demo
          </h3>
          <div
            className="p-8 rounded-2xl"
            style={{
              background:
                "linear-gradient(135deg, var(--peptide-primary-light) 0%, var(--peptide-secondary-light) 50%, var(--peptide-accent-light) 100%)",
            }}
          >
            <div className="grid md:grid-cols-2 gap-6">
              <GlassPanel>
                <h4 className="text-h4 text-[var(--peptide-fg-strong)] mb-2">
                  Premium Frosted
                </h4>
                <p className="text-body-sm text-[var(--peptide-fg-muted)]">
                  Glass panels shine on colored backgrounds, creating a premium,
                  layered effect.
                </p>
              </GlassPanel>
              <GlassPanel variant="subtle">
                <h4 className="text-h4 text-[var(--peptide-fg-strong)] mb-2">
                  Subtle Variant
                </h4>
                <p className="text-body-sm text-[var(--peptide-fg-muted)]">
                  The subtle variant allows more background color through.
                </p>
              </GlassPanel>
            </div>
          </div>
        </div>

        {/* Glass Card */}
        <div className="mt-8">
          <h3 className="text-h4 text-[var(--peptide-fg-strong)] mb-4">
            Glass Card (Hoverable)
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <GlassCard
              title="Interactive Card"
              description="Hover to see the elevation effect"
              footer={<Button size="sm">Action</Button>}
            >
              <p className="text-body-sm text-[var(--peptide-fg-muted)]">
                Cards have smooth hover transitions with shadow and border
                changes.
              </p>
            </GlassCard>
            <GlassCard
              variant="solid"
              title="Solid Card"
              description="Non-glass variant for high contrast"
              footer={
                <Button variant="secondary" size="sm">
                  Secondary
                </Button>
              }
            >
              <p className="text-body-sm text-[var(--peptide-fg-muted)]">
                Use solid cards when glass effect isn&apos;t needed.
              </p>
            </GlassCard>
          </div>
        </div>

        {/* Spec Cards */}
        <div className="mt-8">
          <h3 className="text-h4 text-[var(--peptide-fg-strong)] mb-4">
            Spec Cards
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SpecCard
              label="Purity"
              value="≥99%"
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />
            <SpecCard
              label="Size"
              value="5mg"
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              }
            />
            <SpecCard
              label="Storage"
              value="-20°C"
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              }
            />
            <SpecCard
              label="Form"
              value="Lyophilized"
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              }
            />
          </div>
        </div>
      </Section>

      {/* Product Cards */}
      <Section title="Product Cards">
        <div className="space-y-8">
          {/* Thumbnail Grid */}
          <div>
            <h3 className="text-h4 text-[var(--peptide-fg-strong)] mb-4">
              Thumbnail View
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {MOCK_PRODUCTS.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant="thumbnail"
                  showQuickView
                  onQuickView={(p) => console.log("Quick view:", p.name)}
                />
              ))}
            </div>
          </div>

          {/* Detail List */}
          <div>
            <h3 className="text-h4 text-[var(--peptide-fg-strong)] mb-4">
              Detail View
            </h3>
            <div className="space-y-4">
              {MOCK_PRODUCTS.slice(0, 2).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant="detail"
                  showQuickView
                  onQuickView={(p) => console.log("Quick view:", p.name)}
                />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Catalog Filters & Sorting */}
      <Section title="Catalog Filters & Sorting">
        <div className="space-y-8">
          {/* Sort Select */}
          <div>
            <h3 className="text-h4 text-[var(--peptide-fg-strong)] mb-4">
              Sort Select
            </h3>
            <div className="flex items-center gap-4">
              <SortSelect value={sortOption} onChange={setSortOption} />
              <span className="text-body-sm text-[var(--peptide-fg-muted)]">
                Selected:{" "}
                <code className="text-[var(--peptide-primary)]">
                  {sortOption}
                </code>
              </span>
            </div>
          </div>

          {/* Filter Bar (Horizontal/Mobile) */}
          <div>
            <h3 className="text-h4 text-[var(--peptide-fg-strong)] mb-4">
              Filter Bar (Horizontal)
            </h3>
            <p className="text-body-sm text-[var(--peptide-fg-muted)] mb-4">
              Compact horizontal layout for toolbar placement. Scrollable on
              mobile.
            </p>
            <FilterBar
              selectedGoals={selectedGoals}
              onGoalsChange={setSelectedGoals}
              inStockOnly={inStockOnly}
              onInStockChange={setInStockOnly}
            />
          </div>

          {/* Filter Panel (Vertical) */}
          <div>
            <h3 className="text-h4 text-[var(--peptide-fg-strong)] mb-4">
              Filter Panel (Vertical)
            </h3>
            <p className="text-body-sm text-[var(--peptide-fg-muted)] mb-4">
              Full panel layout for sidebar or expanded filter view.
            </p>
            <div className="max-w-sm">
              <GlassPanel variant="solid" padding="md">
                <FilterPanel
                  selectedGoals={selectedGoals}
                  onGoalsChange={setSelectedGoals}
                  inStockOnly={inStockOnly}
                  onInStockChange={setInStockOnly}
                />
              </GlassPanel>
            </div>
          </div>

          {/* Current State Display */}
          <div>
            <h3 className="text-h4 text-[var(--peptide-fg-strong)] mb-4">
              Current Filter State
            </h3>
            <div className="p-4 rounded-lg bg-[var(--peptide-bg-alt)] font-mono text-body-sm">
              <p>
                <span className="text-[var(--peptide-fg-muted)]">
                  selectedGoals:
                </span>{" "}
                [{selectedGoals.map((g) => `'${g}'`).join(", ")}]
              </p>
              <p>
                <span className="text-[var(--peptide-fg-muted)]">
                  inStockOnly:
                </span>{" "}
                {inStockOnly.toString()}
              </p>
              <p>
                <span className="text-[var(--peptide-fg-muted)]">
                  sortOption:
                </span>{" "}
                '{sortOption}'
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Research Disclaimer */}
      <Section title="Research Disclaimer">
        <div className="space-y-6">
          <div>
            <h3 className="text-h4 text-[var(--peptide-fg-strong)] mb-3">
              Banner (Global)
            </h3>
            <ResearchDisclaimer variant="banner" />
          </div>

          <div>
            <h3 className="text-h4 text-[var(--peptide-fg-strong)] mb-3">
              Inline
            </h3>
            <ResearchDisclaimer variant="inline" />
          </div>

          <div>
            <h3 className="text-h4 text-[var(--peptide-fg-strong)] mb-3">
              Footer
            </h3>
            <ResearchDisclaimer variant="footer" />
          </div>

          <div>
            <h3 className="text-h4 text-[var(--peptide-fg-strong)] mb-3">
              Card
            </h3>
            <div className="max-w-md">
              <ResearchDisclaimer variant="card">
                This product is intended for laboratory research only. Not
                approved for human consumption.
              </ResearchDisclaimer>
            </div>
          </div>
        </div>
      </Section>

      {/* Spacing Reference */}
      <Section title="Spacing Scale">
        <div className="flex items-end gap-4">
          {[
            { name: "xs", size: "var(--spacing-xs)" },
            { name: "sm", size: "var(--spacing-sm)" },
            { name: "md", size: "var(--spacing-md)" },
            { name: "lg", size: "var(--spacing-lg)" },
            { name: "xl", size: "var(--spacing-xl)" },
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
            { name: "sm", radius: "var(--radius-sm)" },
            { name: "md", radius: "var(--radius-md)" },
            { name: "lg", radius: "var(--radius-lg)" },
            { name: "xl", radius: "var(--radius-xl)" },
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
