/**
 * TOOLY Design System - Component Exports
 * Work Order 2.5.2 - Final Polish & API Normalization
 *
 * Canonical components only - experimental components in /experiments
 */

// ============================================
// Canonical Button Components
// ============================================

// Primary button (Brand orange for main CTAs)
export { ButtonPrimary, type ButtonPrimaryProps } from './ButtonPrimary';

// Secondary button (Glass style for supporting actions)
export { ButtonSecondary, type ButtonSecondaryProps } from './ButtonSecondary';

// Tertiary button (Ghost style for low-priority actions)
export { ButtonTertiary, type ButtonTertiaryProps } from './ButtonTertiary';

// Destructive button (Red for dangerous actions)
export { ButtonDestructive, type ButtonDestructiveProps } from './ButtonDestructive';

// Link button (Text link style for inline navigation)
export { ButtonLink, type ButtonLinkProps } from './ButtonLink';

// Pill button (Compact rounded buttons)
export { ButtonPill, ButtonPillGroup, type ButtonPillProps } from './ButtonPill';

// Note: Experimental buttons (rainbow gradients, rotating effects) are available
// in ./experiments/ but not exported by default to maintain design consistency

// Card components
export {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardGrid,
  FeatureCard,
  type CardProps,
  type CardHeaderProps,
  type CardBodyProps,
  type CardFooterProps,
  type CardGridProps,
  type FeatureCardProps
} from './Card';

// Section components
export {
  Section,
  SectionDivider,
  HeroSection,
  FeatureSection,
  CTASection,
  type SectionProps,
  type HeroSectionProps,
  type FeatureSectionProps,
  type CTASectionProps
} from './Section';

// E-commerce Components
export { Navbar, type NavbarProps } from './Navbar';
export { ProductCard, type ProductCardProps } from './ProductCard';
export { SearchBar, type SearchBarProps, type SearchSuggestion } from './SearchBar';
export { Input, type InputProps } from './Input';

// Notification System
export {
  ToastProvider,
  useToast,
  toast,
  type ToastProps,
  type ToastVariant,
  type ToastPosition
} from './Toast';

// ============================================
// Checkout Primitives
// ============================================

// Dialog/Modal with focus trap and accessibility
export { Dialog, type DialogProps } from './Dialog';

// Popover/Dropdown for menus and selectors
export { Popover, type PopoverProps } from './Popover';

// Quantity stepper for cart/checkout
export { QuantityStepper, type QuantityStepperProps } from './QuantityStepper';