/**
 * TOOLY Design System Showcase
 * Work Order 2.5.REBOOT
 *
 * Dark gunmetal + frosted glass with sparingly-used rainbow energy
 * Showcases all new components from the reboot
 */

'use client';

import React from 'react';
import { PointerVarsProvider } from '@/components/providers/PointerVarsProvider';
import { ButtonPrimary } from '@/brands/tooly/components/ui/ButtonPrimary';
import { ButtonGraphite } from '@/brands/tooly/components/ui/ButtonGraphite';
import { ButtonPill, ButtonPillGroup } from '@/brands/tooly/components/ui/ButtonPill';
import { ButtonRotatingWhite } from '@/brands/tooly/components/ui/ButtonRotatingWhite';
import { ButtonRotatingPurple } from '@/brands/tooly/components/ui/ButtonRotatingPurple';
import { ButtonConicShine } from '@/brands/tooly/components/ui/ButtonConicShine';
import { ButtonGlowUp } from '@/brands/tooly/components/ui/ButtonGlowUp';
import { ButtonRainbowShine } from '@/brands/tooly/components/ui/ButtonRainbowShine';
import { ToolyWordmark, ToolyWordmarkStacked } from '@/brands/tooly/components/ui/ToolyWordmark';
import { Watermark, WatermarkGrid, WatermarkAnimated } from '@/brands/tooly/components/ui/Watermark';
import { ReviewsMarquee, ReviewsMarqueeMultiRow } from '@/brands/tooly/components/ui/ReviewsMarquee';
import { FeatureRail } from '@/brands/tooly/components/ui/FeatureRail';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardGrid,
  Section,
  HeroSection,
  CTASection,
} from '@/brands/tooly/components/ui';

// Sample data for components
const sampleReviews = [
  {
    id: '1',
    author: 'Alex Chen',
    role: 'Lead Engineer',
    company: 'TechCorp',
    content: 'TOOLY tools transformed our workflow. The build quality is exceptional and the precision is unmatched.',
    rating: 5,
    date: '2024-01',
    verified: true
  },
  {
    id: '2',
    author: 'Sarah Martinez',
    role: 'Workshop Manager',
    company: 'MakerSpace Co',
    content: 'Industrial-grade quality at an accessible price point. These tools are built to last.',
    rating: 5,
    date: '2024-01',
    verified: true
  },
  {
    id: '3',
    author: 'Mike Johnson',
    role: 'Contractor',
    company: 'BuildRight LLC',
    content: 'The attention to detail in every tool is remarkable. Worth every penny.',
    rating: 5,
    date: '2024-01',
    verified: true
  },
  {
    id: '4',
    author: 'Lisa Wong',
    role: 'DIY Enthusiast',
    content: 'Professional quality for home projects. The ergonomics are perfect for extended use.',
    rating: 4,
    date: '2024-01'
  },
  {
    id: '5',
    author: 'David Brown',
    role: 'Maintenance Supervisor',
    company: 'Industrial Works',
    content: 'Reliability you can count on. These tools have never let us down.',
    rating: 5,
    date: '2023-12',
    verified: true
  }
];

const sampleFeatures = [
  {
    id: '1',
    title: 'Precision Engineering',
    description: 'Crafted with aerospace-grade materials and tolerances for ultimate accuracy.',
    badge: 'FLAGSHIP',
    highlight: '±0.001" tolerance',
    icon: '⚙️'
  },
  {
    id: '2',
    title: 'Lifetime Warranty',
    description: 'Built to last generations. If it breaks, we replace it. No questions asked.',
    highlight: 'Forever guarantee',
    icon: '🛡️'
  },
  {
    id: '3',
    title: 'Ergonomic Design',
    description: 'Engineered for comfort during extended use with anti-fatigue grips.',
    highlight: 'Reduces strain by 40%',
    icon: '✋'
  },
  {
    id: '4',
    title: 'Smart Integration',
    description: 'IoT-enabled tools that track usage, maintenance, and performance metrics.',
    badge: 'NEW',
    highlight: 'Connected workshop',
    icon: '📡'
  }
];

export default function DesignSystemPage() {
  return (
    <PointerVarsProvider>
      {/* Background effects */}
      <Watermark
        text="TOOLY"
        spotlight={true}
        opacity={0.02}
        position="center"
      />

      <div className="min-h-screen relative z-10">
        {/* Add noise overlay */}
        <div className="bg-noise" />

        {/* Hero Section with new wordmark */}
        <HeroSection
          headline={
            <div className="flex flex-col items-center gap-8">
              <ToolyWordmark size="xl" aberration={true} />
              <p className="text-2xl text-white/60 font-light tracking-wider">
                DESIGN SYSTEM 2.5.REBOOT
              </p>
            </div>
          }
          description="Dark gunmetal surfaces • Cool frosted glass • Reactive animations • Rainbow accents"
          actions={
            <div className="flex flex-wrap gap-4 justify-center">
              <ButtonPrimary size="lg" showArrow>
                Shop TOOLY Now
              </ButtonPrimary>
              <ButtonGraphite variant="secondary" size="lg">
                View Catalog
              </ButtonGraphite>
            </div>
          }
          background="transparent"
          className="spotlight min-h-[70vh] flex items-center"
        />

        {/* Gunmetal Palette Section */}
        <Section
          title="Gunmetal Palette"
          subtitle="Cool blue-gray metallic with exact hex values"
          containerSize="xl"
          spacing="lg"
          background="transparent"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { shade: 950, hex: '#0b0f14' },
              { shade: 900, hex: '#0d1218' },
              { shade: 800, hex: '#121822' },
              { shade: 700, hex: '#17202a' },
              { shade: 600, hex: '#1d2631' },
              { shade: 500, hex: '#243040' },
              { shade: 400, hex: '#2d3a4c' },
              { shade: 300, hex: '#374659' },
              { shade: 200, hex: '#425367' },
              { shade: 100, hex: '#516176' },
              { shade: 50, hex: '#637389' },
            ].map(({ shade, hex }) => (
              <div key={shade} className="glass-card p-4">
                <div
                  className={`w-full aspect-square rounded-lg bg-gm-${shade} mb-3 border border-white/10`}
                  style={{ backgroundColor: hex }}
                />
                <p className="font-medium text-white text-sm">GM-{shade}</p>
                <p className="text-xs font-mono text-white/50">{hex}</p>
              </div>
            ))}
          </div>

          {/* Brand colors */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-white mb-6">Brand Palette</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl">
              <div className="glass-card p-6">
                <div className="w-full aspect-square rounded-lg bg-[#FF6B35] mb-4" />
                <p className="font-semibold text-white">Primary Orange</p>
                <p className="text-xs font-mono text-white/50">#FF6B35</p>
              </div>
              <div className="glass-card p-6">
                <div className="w-full aspect-square rounded-lg bg-[#0B4E8B] mb-4" />
                <p className="font-semibold text-white">Deep Blue</p>
                <p className="text-xs font-mono text-white/50">#0B4E8B</p>
              </div>
              <div className="glass-card p-6">
                <div className="w-full aspect-square rounded-lg bg-[#FFC107] mb-4" />
                <p className="font-semibold text-white">Accent Yellow</p>
                <p className="text-xs font-mono text-white/50">#FFC107</p>
              </div>
            </div>
          </div>
        </Section>

        {/* Primary Button - Resend-Inspired */}
        <Section
          title="Primary Button System"
          subtitle="Premium button design inspired by Resend.com"
          containerSize="lg"
          spacing="lg"
        >
          <Card glass padding="xl">
            <CardHeader bordered>
              <h3 className="text-xl font-semibold text-white">
                ButtonPrimary - Animated Rainbow Border
              </h3>
              <p className="text-white/60 text-sm mt-2">
                Inspired by Resend.com's "Launch Week" button design
              </p>
            </CardHeader>
            <CardBody className="space-y-8">
              {/* Size Variants */}
              <div className="space-y-4">
                <p className="text-white/50 text-sm uppercase tracking-wider">Size Variants</p>
                <div className="flex flex-wrap gap-4 items-center justify-center">
                  <ButtonPrimary size="sm">Small Button</ButtonPrimary>
                  <ButtonPrimary size="md">Medium Button</ButtonPrimary>
                  <ButtonPrimary size="lg">Large Button</ButtonPrimary>
                </div>
              </div>

              {/* With Arrow Icons */}
              <div className="space-y-4">
                <p className="text-white/50 text-sm uppercase tracking-wider">With Arrow Icon</p>
                <div className="flex flex-wrap gap-4 items-center justify-center">
                  <ButtonPrimary showArrow size="sm">Shop TOOLY Now</ButtonPrimary>
                  <ButtonPrimary showArrow size="md">Shop TOOLY Now</ButtonPrimary>
                  <ButtonPrimary showArrow size="lg">Shop TOOLY Now</ButtonPrimary>
                </div>
              </div>

              {/* States */}
              <div className="space-y-4">
                <p className="text-white/50 text-sm uppercase tracking-wider">States</p>
                <div className="flex flex-wrap gap-4 items-center justify-center">
                  <ButtonPrimary showArrow>Default</ButtonPrimary>
                  <ButtonPrimary loading>Loading</ButtonPrimary>
                  <ButtonPrimary disabled showArrow>Disabled</ButtonPrimary>
                  <ButtonPrimary fullWidth showArrow>Full Width</ButtonPrimary>
                </div>
              </div>

              {/* Example CTAs */}
              <div className="space-y-4">
                <p className="text-white/50 text-sm uppercase tracking-wider">E-Commerce CTAs</p>
                <div className="flex flex-wrap gap-4 items-center justify-center">
                  <ButtonPrimary showArrow>Shop Now</ButtonPrimary>
                  <ButtonPrimary showArrow>Browse Tools</ButtonPrimary>
                  <ButtonPrimary showArrow>View Collection</ButtonPrimary>
                </div>
              </div>
            </CardBody>
          </Card>
        </Section>

        {/* Experimental Gradient Buttons */}
        <Section
          title="Experimental Gradient Buttons"
          subtitle="Advanced gradient and animation effects collection"
          containerSize="lg"
          spacing="lg"
        >
          <div className="space-y-8">
            {/* Rotating Gradient Buttons */}
            <Card glass padding="lg">
              <CardHeader bordered>
                <h3 className="text-xl font-semibold text-white">
                  Rotating Gradient Effects
                </h3>
              </CardHeader>
              <CardBody className="space-y-6">
                <div className="flex flex-wrap gap-6 items-center justify-center">
                  <ButtonRotatingWhite size="sm">Small White</ButtonRotatingWhite>
                  <ButtonRotatingWhite size="md">Medium White</ButtonRotatingWhite>
                  <ButtonRotatingWhite size="lg">Large White</ButtonRotatingWhite>
                </div>
                <div className="flex flex-wrap gap-6 items-center justify-center">
                  <ButtonRotatingPurple size="sm">Small Purple</ButtonRotatingPurple>
                  <ButtonRotatingPurple size="md">Medium Purple</ButtonRotatingPurple>
                  <ButtonRotatingPurple size="lg">Large Purple</ButtonRotatingPurple>
                </div>
              </CardBody>
            </Card>

            {/* Conic Gradient Buttons */}
            <Card glass padding="lg">
              <CardHeader bordered>
                <h3 className="text-xl font-semibold text-white">
                  Conic Gradient with Shine
                </h3>
              </CardHeader>
              <CardBody className="space-y-6">
                <div className="flex flex-wrap gap-6 items-center justify-center">
                  <ButtonConicShine size="sm">Cyan Shine</ButtonConicShine>
                  <ButtonConicShine size="md">Cyan Shine</ButtonConicShine>
                  <ButtonConicShine size="lg">Cyan Shine</ButtonConicShine>
                </div>
                <div className="flex flex-wrap gap-6 items-center justify-center">
                  <ButtonRainbowShine size="sm">Rainbow</ButtonRainbowShine>
                  <ButtonRainbowShine size="md">Rainbow</ButtonRainbowShine>
                  <ButtonRainbowShine size="lg">Rainbow</ButtonRainbowShine>
                </div>
              </CardBody>
            </Card>

            {/* Glow Effect Button */}
            <Card glass padding="lg">
              <CardHeader bordered>
                <h3 className="text-xl font-semibold text-white">
                  Glow Up Effect
                </h3>
              </CardHeader>
              <CardBody className="space-y-6">
                <div className="flex flex-wrap gap-6 items-center justify-center">
                  <ButtonGlowUp size="sm">Glow</ButtonGlowUp>
                  <ButtonGlowUp size="md">Button</ButtonGlowUp>
                  <ButtonGlowUp size="lg">Effect</ButtonGlowUp>
                </div>
              </CardBody>
            </Card>

            {/* ButtonGraphite showcase */}
            <Card glass padding="lg">
              <CardHeader bordered>
                <h3 className="text-xl font-semibold text-white">
                  ButtonGraphite - Static Rainbow Border
                </h3>
              </CardHeader>
              <CardBody className="space-y-6">
                <div className="flex flex-wrap gap-4">
                  <ButtonGraphite variant="primary" size="sm">Small Primary</ButtonGraphite>
                  <ButtonGraphite variant="primary" size="md">Medium Primary</ButtonGraphite>
                  <ButtonGraphite variant="primary" size="lg">Large Primary</ButtonGraphite>
                </div>
                <div className="flex flex-wrap gap-4">
                  <ButtonGraphite variant="secondary">Secondary</ButtonGraphite>
                  <ButtonGraphite variant="ghost">Ghost</ButtonGraphite>
                  <ButtonGraphite loading>Loading</ButtonGraphite>
                  <ButtonGraphite disabled>Disabled</ButtonGraphite>
                </div>
              </CardBody>
            </Card>

            {/* ButtonPill showcase */}
            <Card glass padding="lg">
              <CardHeader bordered>
                <h3 className="text-xl font-semibold text-white">
                  ButtonPill - Compact CTAs
                </h3>
              </CardHeader>
              <CardBody className="space-y-6">
                <ButtonPillGroup gap="sm">
                  <ButtonPill variant="primary">New</ButtonPill>
                  <ButtonPill variant="secondary">Draft</ButtonPill>
                  <ButtonPill variant="success">Published</ButtonPill>
                  <ButtonPill variant="error">Urgent</ButtonPill>
                  <ButtonPill variant="ghost">Archive</ButtonPill>
                </ButtonPillGroup>

                <div className="flex items-center gap-4">
                  <ButtonPill size="xs">XS Pill</ButtonPill>
                  <ButtonPill size="sm">SM Pill</ButtonPill>
                  <ButtonPill size="md">MD Pill</ButtonPill>
                  <ButtonPill loading>Loading</ButtonPill>
                  <ButtonPill pulse>Alert</ButtonPill>
                </div>
              </CardBody>
            </Card>
          </div>
        </Section>

        {/* Glassmorphism Effects */}
        <Section
          title="Cool Frosted Glass"
          subtitle="Refined glass effects with cool tints"
          containerSize="lg"
          spacing="lg"
          className="relative overflow-hidden"
        >
          {/* Gradient background for glass demo */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B4E8B]/20 via-transparent to-[#FF6B35]/10" />

          <CardGrid cols={{ default: 1, md: 3 }} gap="lg" className="relative z-10">
            <Card glass padding="lg">
              <h3 className="text-xl font-bold mb-3 text-white">Standard Glass</h3>
              <p className="text-white/70">
                Cool frosted effect with inner highlight. Optimized for dark surfaces.
              </p>
            </Card>

            <Card glass padding="lg" className="glass-blue">
              <h3 className="text-xl font-bold mb-3 text-white">Blue Tinted</h3>
              <p className="text-white/70">
                Cool blue tint for technical interfaces. Enhanced depth perception.
              </p>
            </Card>

            <Card glass padding="lg" className="glass-heavy">
              <h3 className="text-xl font-bold mb-3 text-white">Heavy Glass</h3>
              <p className="text-white/70">
                Maximum blur for hero panels. Reserved for primary CTAs.
              </p>
            </Card>
          </CardGrid>
        </Section>

        {/* Wordmark Variants */}
        <Section
          title="TOOLY Wordmark"
          subtitle="Chromatic aberration for tech aesthetic"
          containerSize="md"
          spacing="lg"
        >
          <Card glass padding="xl">
            <div className="space-y-12">
              <div className="text-center space-y-4">
                <p className="text-sm text-white/50 uppercase tracking-wider">With Aberration</p>
                <ToolyWordmark size="lg" aberration={true} />
              </div>

              <div className="text-center space-y-4">
                <p className="text-sm text-white/50 uppercase tracking-wider">Monochrome</p>
                <ToolyWordmark size="lg" aberration={false} />
              </div>

              <div className="text-center space-y-4">
                <p className="text-sm text-white/50 uppercase tracking-wider">Stacked Version</p>
                <ToolyWordmarkStacked size="md" aberration={true} />
              </div>
            </div>
          </Card>
        </Section>

        {/* Reviews Marquee */}
        <Section
          title="Social Proof"
          subtitle="Auto-scrolling customer testimonials"
          containerSize="full"
          spacing="lg"
        >
          <ReviewsMarquee
            reviews={sampleReviews}
            direction="left"
            duration={40}
            pauseOnHover={true}
            showFade={true}
          />

          <div className="mt-8">
            <ReviewsMarqueeMultiRow
              reviews={[sampleReviews.slice(0, 3), sampleReviews.slice(2, 5)]}
              duration={35}
            />
          </div>
        </Section>

        {/* Feature Rail */}
        <Section
          title="Product Features"
          subtitle="Interactive feature showcase with progress indicators"
          containerSize="lg"
          spacing="lg"
        >
          <div className="space-y-12">
            {/* Horizontal variant */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Horizontal Layout</h3>
              <FeatureRail
                features={sampleFeatures}
                autoAdvance={5000}
                showProgress={true}
                variant="horizontal"
              />
            </div>

            {/* Split variant */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Split Layout</h3>
              <FeatureRail
                features={sampleFeatures}
                autoAdvance={0} // Manual control
                showProgress={true}
                variant="split"
              />
            </div>

            {/* Vertical variant */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Vertical Layout</h3>
              <FeatureRail
                features={sampleFeatures}
                autoAdvance={4000}
                showProgress={true}
                variant="vertical"
              />
            </div>
          </div>
        </Section>

        {/* Motion & Loading States */}
        <Section
          title="Industrial Motion"
          subtitle="New loading states and animations"
          containerSize="lg"
          spacing="lg"
        >
          <CardGrid cols={{ default: 1, md: 2 }} gap="lg">
            <Card glass padding="lg">
              <CardHeader bordered>
                <h3 className="text-lg font-semibold text-white">Loading States</h3>
              </CardHeader>
              <CardBody className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="loader-gear" />
                  <span className="text-white/70">Gear Mechanism</span>
                </div>
                <div className="w-full">
                  <div className="loader-laser" />
                  <span className="text-white/70 text-sm mt-2 block">Laser Scanner</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="loader-liquid" />
                  <span className="text-white/70">Liquid Morph</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="loader-hex-grid">
                    <span></span><span></span><span></span>
                    <span></span><span></span><span></span>
                    <span></span><span></span><span></span>
                  </div>
                  <span className="text-white/70">Hexagon Grid</span>
                </div>
              </CardBody>
            </Card>

            <Card glass padding="lg">
              <CardHeader bordered>
                <h3 className="text-lg font-semibold text-white">Continuous Animations</h3>
              </CardHeader>
              <CardBody className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[var(--color-brand)] rounded animate-gear" />
                  <span className="text-white/70">Gear Rotation</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded animate-liquid-morph bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-2)]" />
                  <span className="text-white/70">Liquid Morph</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[var(--color-brand-3)] rounded animate-hex-pulse" />
                  <span className="text-white/70">Hex Pulse</span>
                </div>
                <div className="w-full h-10 rounded animate-energy-flow">
                  <span className="text-white/70">Energy Flow</span>
                </div>
              </CardBody>
            </Card>
          </CardGrid>
        </Section>

        {/* Background Effects */}
        <Section
          title="Alive Backgrounds"
          subtitle="Dynamic background effects and watermarks"
          containerSize="md"
          spacing="lg"
        >
          <Card glass padding="lg">
            <div className="space-y-6">
              <div className="p-8 rounded-xl bg-alive relative overflow-hidden h-32 flex items-center justify-center">
                <span className="text-white font-semibold z-10 relative">Animated Gradient Background</span>
              </div>

              <div className="p-8 rounded-xl spotlight bg-gm-900 relative overflow-hidden h-32 flex items-center justify-center">
                <span className="text-white font-semibold">Spotlight Effect (move cursor)</span>
              </div>

              <div className="p-8 rounded-xl bg-noise bg-gm-800 relative overflow-hidden h-32 flex items-center justify-center">
                <span className="text-white font-semibold">Noise Overlay Texture</span>
              </div>
            </div>
          </Card>
        </Section>

        {/* Performance & Accessibility */}
        <Section
          title="Performance First"
          subtitle="Optimized for speed and accessibility"
          containerSize="lg"
          spacing="lg"
        >
          <CardGrid cols={{ default: 1, md: 2 }} gap="lg">
            <Card glass padding="lg">
              <CardHeader bordered>
                <h3 className="text-xl font-semibold text-white">Performance Metrics</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">CSS Bundle</span>
                    <span className="font-mono text-white">~18KB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">JS Components</span>
                    <span className="font-mono text-white">~12KB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">First Paint</span>
                    <span className="font-mono text-green-400">&lt;1s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Layout Shift</span>
                    <span className="font-mono text-green-400">0 CLS</span>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card glass padding="lg">
              <CardHeader bordered>
                <h3 className="text-xl font-semibold text-white">Accessibility</h3>
              </CardHeader>
              <CardBody>
                <ul className="space-y-3 text-white/70">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>WCAG AA compliant colors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Keyboard navigation support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Screen reader friendly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Respects prefers-reduced-motion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Focus indicators on all elements</span>
                  </li>
                </ul>
              </CardBody>
            </Card>
          </CardGrid>
        </Section>

        {/* CTA Section */}
        <CTASection
          heading={<ToolyWordmark size="lg" aberration={true} />}
          description="Industrial-grade design system for modern web applications"
          actions={
            <div className="flex flex-wrap gap-4 justify-center">
              <ButtonPrimary size="lg" showArrow>
                Buy TOOLY Tools
              </ButtonPrimary>
              <ButtonPillGroup>
                <ButtonPill variant="secondary">Components</ButtonPill>
                <ButtonPill variant="secondary">Docs</ButtonPill>
                <ButtonPill variant="secondary">GitHub</ButtonPill>
              </ButtonPillGroup>
            </div>
          }
          spacing="xl"
          className="relative"
        />
      </div>
    </PointerVarsProvider>
  );
}