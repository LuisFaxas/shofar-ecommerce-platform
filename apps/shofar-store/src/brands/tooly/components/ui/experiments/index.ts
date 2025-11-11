/**
 * TOOLY Design System - Experimental Components
 * Work Order 2.5.2 - Experimental/Marketing Components
 *
 * ⚠️ WARNING: These components are experimental and not part of the canonical design system.
 * Use sparingly for special marketing campaigns or hero sections only.
 * For standard UI, use the canonical buttons from the main exports.
 */

// Marketing Primary - Rainbow gradient border (former ButtonPrimary)
export { ButtonMarketingPrimary, type ButtonMarketingPrimaryProps } from './ButtonMarketingPrimary';

// Animated gradient buttons
export { ButtonRotatingWhite, type ButtonRotatingWhiteProps } from './ButtonRotatingWhite';
export { ButtonRotatingPurple, type ButtonRotatingPurpleProps } from './ButtonRotatingPurple';
export { ButtonConicShine, type ButtonConicShineProps } from './ButtonConicShine';
export { ButtonGlowUp, type ButtonGlowUpProps } from './ButtonGlowUp';
export { ButtonRainbowShine, type ButtonRainbowShineProps } from './ButtonRainbowShine';

/**
 * Usage Guidelines:
 *
 * DO:
 * - Use ButtonMarketingPrimary for special promotional CTAs
 * - Use animated buttons for landing page heroes
 * - Test performance on mobile before deploying
 * - Ensure AA contrast when using gradient backgrounds
 *
 * DON'T:
 * - Use experimental buttons for standard UI actions
 * - Mix multiple animated buttons on the same page
 * - Use bouncy/pulse animations by default
 * - Override the canonical button hierarchy
 *
 * For standard buttons, import from '@/brands/tooly/components/ui':
 * - ButtonPrimary (brand orange)
 * - ButtonSecondary (glass)
 * - ButtonTertiary (ghost)
 * - ButtonDestructive (red)
 * - ButtonLink (text link)
 */