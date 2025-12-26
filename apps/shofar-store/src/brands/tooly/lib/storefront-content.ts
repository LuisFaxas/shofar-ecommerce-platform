/**
 * Storefront Content Adapter
 * Extracts and provides fallbacks for Channel-based storefront content from Vendure
 * All client-facing text is editable via Vendure Admin: Settings → Channels → tooly → Storefront tab
 */

// ============================================================================
// TYPES - Channel Custom Fields from Vendure
// ============================================================================

export interface ChannelStorefrontFields {
  // Hero section
  storefrontHeroPill?: string | null;
  storefrontHeroHeadlineLine1?: string | null;
  storefrontHeroHeadlineAccent?: string | null;
  storefrontHeroHeadlineLine3?: string | null;
  storefrontHeroSubhead?: string | null;
  storefrontPrimaryCtaLabel?: string | null;
  storefrontSecondaryCtaLabel?: string | null;
  // Trust badges (4)
  storefrontTrust1Title?: string | null;
  storefrontTrust1Sub?: string | null;
  storefrontTrust2Title?: string | null;
  storefrontTrust2Sub?: string | null;
  storefrontTrust3Title?: string | null;
  storefrontTrust3Sub?: string | null;
  storefrontTrust4Title?: string | null;
  storefrontTrust4Sub?: string | null;
  // Feature grid (6)
  storefrontFeature1Title?: string | null;
  storefrontFeature1Body?: string | null;
  storefrontFeature2Title?: string | null;
  storefrontFeature2Body?: string | null;
  storefrontFeature3Title?: string | null;
  storefrontFeature3Body?: string | null;
  storefrontFeature4Title?: string | null;
  storefrontFeature4Body?: string | null;
  storefrontFeature5Title?: string | null;
  storefrontFeature5Body?: string | null;
  storefrontFeature6Title?: string | null;
  storefrontFeature6Body?: string | null;
  // Gallery section
  storefrontGalleryHeading?: string | null;
  storefrontGallerySubhead?: string | null;
  // Shop widget / product section
  storefrontShippingBlurb?: string | null;
  storefrontDeliveryEstimate?: string | null;
  storefrontInStockLabel?: string | null;
  storefrontOutOfStockLabel?: string | null;
  storefrontCarouselNavStyle?: string | null;
  // Footer / compliance
  storefrontDisclaimer?: string | null;
  // Header toggles
  storefrontShowAuthLinks?: boolean | null;
  storefrontShowSearch?: boolean | null;
  // FAQ section
  storefrontFaqHeading?: string | null;
  storefrontFaqSubhead?: string | null;
  storefrontShowFaq?: boolean | null;
  storefrontFaq1Question?: string | null;
  storefrontFaq1Answer?: string | null;
  storefrontFaq2Question?: string | null;
  storefrontFaq2Answer?: string | null;
  storefrontFaq3Question?: string | null;
  storefrontFaq3Answer?: string | null;
  storefrontFaq4Question?: string | null;
  storefrontFaq4Answer?: string | null;
  storefrontFaq5Question?: string | null;
  storefrontFaq5Answer?: string | null;
  storefrontFaq6Question?: string | null;
  storefrontFaq6Answer?: string | null;
}

// ============================================================================
// PROCESSED CONTENT - Ready to use in components
// ============================================================================

export interface HeroContent {
  pill: string;
  headlineLine1: string;
  headlineAccent: string;
  headlineLine3: string;
  subhead: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
}

export interface TrustBadge {
  title: string;
  subtitle: string;
}

export interface Feature {
  title: string;
  body: string;
}

export interface GalleryContent {
  heading: string;
  subhead: string;
}

export interface ShopContent {
  shippingBlurb: string;
  deliveryEstimate: string;
  inStockLabel: string;
  outOfStockLabel: string;
  carouselNavStyle: "dots" | "thumbs";
}

export interface HeaderToggles {
  showAuthLinks: boolean;
  showSearch: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqContent {
  heading: string;
  subhead: string;
  showFaq: boolean;
  items: FaqItem[];
}

export interface StorefrontContent {
  hero: HeroContent;
  trustBadges: [TrustBadge, TrustBadge, TrustBadge, TrustBadge];
  features: [Feature, Feature, Feature, Feature, Feature, Feature];
  gallery: GalleryContent;
  shop: ShopContent;
  disclaimer: string;
  header: HeaderToggles;
  faq: FaqContent;
}

// ============================================================================
// DEFAULT VALUES - Safe, truthful fallbacks (no false claims)
// ============================================================================

const DEFAULTS: StorefrontContent = {
  hero: {
    pill: "Precision Aroma Delivery",
    headlineLine1: "Precision.",
    headlineAccent: "Aroma.",
    headlineLine3: "Perfection.",
    subhead:
      "Experience the art of precision aroma delivery. Crafted for connoisseurs, designed for ritual.",
    primaryCtaLabel: "Shop Now",
    secondaryCtaLabel: "Learn More",
  },
  trustBadges: [
    { title: "Secure Checkout", subtitle: "256-bit encryption" },
    { title: "Premium Quality", subtitle: "Crafted with care" },
    { title: "Easy Returns", subtitle: "30-day return policy" },
    { title: "Support", subtitle: "Email support available" },
  ],
  features: [
    {
      title: "Precision Machining",
      body: "CNC-machined from aerospace-grade aluminum with tolerances under 0.01mm.",
    },
    {
      title: "Optimized Airflow",
      body: "Engineered chamber design delivers smooth, consistent draws every time.",
    },
    {
      title: "Premium Materials",
      body: "Medical-grade stainless steel and borosilicate glass for purity.",
    },
    {
      title: "Easy Maintenance",
      body: "Simple disassembly and cleaning. Dishwasher-safe components.",
    },
    {
      title: "Ergonomic Design",
      body: "Balanced weight distribution and textured grip for comfortable use.",
    },
    {
      title: "Travel Ready",
      body: "Compact form factor with included protective case for portability.",
    },
  ],
  gallery: {
    heading: "Gallery",
    subhead: "Every angle showcases the precision craftsmanship",
  },
  shop: {
    shippingBlurb: "Shipping calculated at checkout",
    deliveryEstimate: "Ships within 3-5 business days",
    inStockLabel: "In Stock",
    outOfStockLabel: "Out of Stock",
    carouselNavStyle: "dots",
  },
  disclaimer: "For aromatic and sensory evaluation purposes only.",
  header: {
    showAuthLinks: false,
    showSearch: false,
  },
  faq: {
    heading: "Frequently Asked Questions",
    subhead: "Everything you need to know about TOOLY",
    showFaq: true,
    items: [
      {
        question: "What materials is TOOLY made from?",
        answer:
          "TOOLY is precision CNC-machined from aerospace-grade 6061 aluminum with a medical-grade stainless steel chamber. The heating element uses premium ceramics for optimal heat distribution and purity.",
      },
      {
        question: "What is included with my TOOLY?",
        answer:
          "Every TOOLY comes with the precision-machined device, a protective carrying case, cleaning brush, spare screens, and a detailed user guide. Everything you need to get started is included in the box.",
      },
      {
        question: "What is your warranty policy?",
        answer:
          "Every TOOLY device comes with a comprehensive 2-year warranty covering manufacturing defects and component performance. Extended warranty options are available at checkout.",
      },
      {
        question: "How do I clean and maintain my TOOLY?",
        answer:
          "We recommend cleaning your TOOLY after every 5-10 sessions using the included cleaning kit. The modular design allows easy access to all components. Detailed maintenance guides are available in your account.",
      },
      {
        question: "What is your return policy?",
        answer:
          "We offer a 30-day satisfaction guarantee. If you're not completely satisfied with your purchase, return it in original condition for a full refund. Shipping is free on all returns.",
      },
    ],
  },
};

// ============================================================================
// ADAPTER FUNCTION
// ============================================================================

/**
 * Build StorefrontContent from Channel custom fields with fallbacks
 * @param fields - Raw custom fields from activeChannel.customFields
 * @returns Processed StorefrontContent ready for components
 */
export function buildStorefrontContent(
  fields: ChannelStorefrontFields | null | undefined,
): StorefrontContent {
  if (!fields) {
    return DEFAULTS;
  }

  return {
    hero: {
      pill: fields.storefrontHeroPill || DEFAULTS.hero.pill,
      headlineLine1:
        fields.storefrontHeroHeadlineLine1 || DEFAULTS.hero.headlineLine1,
      headlineAccent:
        fields.storefrontHeroHeadlineAccent || DEFAULTS.hero.headlineAccent,
      headlineLine3:
        fields.storefrontHeroHeadlineLine3 || DEFAULTS.hero.headlineLine3,
      subhead: fields.storefrontHeroSubhead || DEFAULTS.hero.subhead,
      primaryCtaLabel:
        fields.storefrontPrimaryCtaLabel || DEFAULTS.hero.primaryCtaLabel,
      secondaryCtaLabel:
        fields.storefrontSecondaryCtaLabel || DEFAULTS.hero.secondaryCtaLabel,
    },
    trustBadges: [
      {
        title: fields.storefrontTrust1Title || DEFAULTS.trustBadges[0].title,
        subtitle:
          fields.storefrontTrust1Sub || DEFAULTS.trustBadges[0].subtitle,
      },
      {
        title: fields.storefrontTrust2Title || DEFAULTS.trustBadges[1].title,
        subtitle:
          fields.storefrontTrust2Sub || DEFAULTS.trustBadges[1].subtitle,
      },
      {
        title: fields.storefrontTrust3Title || DEFAULTS.trustBadges[2].title,
        subtitle:
          fields.storefrontTrust3Sub || DEFAULTS.trustBadges[2].subtitle,
      },
      {
        title: fields.storefrontTrust4Title || DEFAULTS.trustBadges[3].title,
        subtitle:
          fields.storefrontTrust4Sub || DEFAULTS.trustBadges[3].subtitle,
      },
    ],
    features: [
      {
        title: fields.storefrontFeature1Title || DEFAULTS.features[0].title,
        body: fields.storefrontFeature1Body || DEFAULTS.features[0].body,
      },
      {
        title: fields.storefrontFeature2Title || DEFAULTS.features[1].title,
        body: fields.storefrontFeature2Body || DEFAULTS.features[1].body,
      },
      {
        title: fields.storefrontFeature3Title || DEFAULTS.features[2].title,
        body: fields.storefrontFeature3Body || DEFAULTS.features[2].body,
      },
      {
        title: fields.storefrontFeature4Title || DEFAULTS.features[3].title,
        body: fields.storefrontFeature4Body || DEFAULTS.features[3].body,
      },
      {
        title: fields.storefrontFeature5Title || DEFAULTS.features[4].title,
        body: fields.storefrontFeature5Body || DEFAULTS.features[4].body,
      },
      {
        title: fields.storefrontFeature6Title || DEFAULTS.features[5].title,
        body: fields.storefrontFeature6Body || DEFAULTS.features[5].body,
      },
    ],
    gallery: {
      heading: fields.storefrontGalleryHeading || DEFAULTS.gallery.heading,
      subhead: fields.storefrontGallerySubhead || DEFAULTS.gallery.subhead,
    },
    shop: {
      shippingBlurb:
        fields.storefrontShippingBlurb || DEFAULTS.shop.shippingBlurb,
      deliveryEstimate:
        fields.storefrontDeliveryEstimate || DEFAULTS.shop.deliveryEstimate,
      inStockLabel: fields.storefrontInStockLabel || DEFAULTS.shop.inStockLabel,
      outOfStockLabel:
        fields.storefrontOutOfStockLabel || DEFAULTS.shop.outOfStockLabel,
      carouselNavStyle:
        (fields.storefrontCarouselNavStyle as "dots" | "thumbs") ||
        DEFAULTS.shop.carouselNavStyle,
    },
    disclaimer: fields.storefrontDisclaimer || DEFAULTS.disclaimer,
    header: {
      showAuthLinks:
        fields.storefrontShowAuthLinks ?? DEFAULTS.header.showAuthLinks,
      showSearch: fields.storefrontShowSearch ?? DEFAULTS.header.showSearch,
    },
    faq: buildFaqContent(fields),
  };
}

/**
 * Build FAQ content from Channel custom fields
 * Only includes items where both question AND answer are non-empty
 */
function buildFaqContent(fields: ChannelStorefrontFields): FaqContent {
  const items: FaqItem[] = [];

  // Collect FAQ items 1-6, only include if both Q and A are non-empty
  const faqPairs = [
    { q: fields.storefrontFaq1Question, a: fields.storefrontFaq1Answer },
    { q: fields.storefrontFaq2Question, a: fields.storefrontFaq2Answer },
    { q: fields.storefrontFaq3Question, a: fields.storefrontFaq3Answer },
    { q: fields.storefrontFaq4Question, a: fields.storefrontFaq4Answer },
    { q: fields.storefrontFaq5Question, a: fields.storefrontFaq5Answer },
    { q: fields.storefrontFaq6Question, a: fields.storefrontFaq6Answer },
  ];

  for (const pair of faqPairs) {
    if (pair.q && pair.a) {
      items.push({ question: pair.q, answer: pair.a });
    }
  }

  // If no items from Vendure, use defaults
  const finalItems = items.length > 0 ? items : DEFAULTS.faq.items;

  return {
    heading: fields.storefrontFaqHeading || DEFAULTS.faq.heading,
    subhead: fields.storefrontFaqSubhead || DEFAULTS.faq.subhead,
    showFaq: fields.storefrontShowFaq ?? DEFAULTS.faq.showFaq,
    items: finalItems,
  };
}

/**
 * Get default StorefrontContent (for use when no data is available)
 */
export function getDefaultStorefrontContent(): StorefrontContent {
  return DEFAULTS;
}
