# PEPTIDE_PLAN.md

> **Status**: Draft - Pending Review
> **Store**: pharma-store (`@shofar/pharma-store`)
> **Brand**: PEPTIDES
> **Channel**: `peptide`

---

## 1. Overview

This document defines the implementation plan for the PEPTIDES brand within pharma-store. All work must adhere to the constraints defined in `CLAUDE.md` under "Peptide Store Addendum (Append-Only)".

### Core Principles
- **Complete isolation** from shofar-store and faxas-store
- **Compliance-first** design (research use only)
- **Privacy-focused** architecture
- **SEO-optimized** for discoverability

---

## 2. API Integration

### 2.1 Channel Configuration
All API requests must include the channel header:

```typescript
// lib/api-client.ts
const shopClient = createShopClient({
  apiUrl: process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL,
  defaultHeaders: {
    'vendure-token': 'peptide'
  }
});
```

### 2.2 GraphQL Queries
- [ ] Create peptide-specific product queries
- [ ] Implement facet queries for goal-based filtering
- [ ] Add blog article queries with peptide cross-references

---

## 3. Privacy Implementation

### 3.1 Cookie Configuration
```typescript
// lib/cookies.ts
export const COOKIE_OPTIONS = {
  prefix: '__Host-',
  sameSite: 'strict' as const,
  secure: true,
  httpOnly: true,
  path: '/'
};

// Cookie names
export const COOKIES = {
  SESSION: '__Host-peptide-session',
  CART: '__Host-peptide-cart',
  CONSENT: '__Host-peptide-consent'
};
```

### 3.2 Logging Policy
- [ ] Implement PII scrubber for all log outputs
- [ ] Configure separate log streams for pharma-store
- [ ] Audit existing logging for PII leaks

### 3.3 Analytics Isolation
- [ ] Create dedicated PostHog/analytics project
- [ ] Configure separate NEXT_PUBLIC_POSTHOG_KEY
- [ ] Implement consent-first tracking

---

## 4. Compliance Requirements

### 4.1 Disclaimer Component
```tsx
// components/compliance/ResearchDisclaimer.tsx
export function ResearchDisclaimer({ variant = 'banner' }) {
  return (
    <div className={disclaimerStyles[variant]}>
      For Research Use Only / Not for human use.
    </div>
  );
}
```

**Required placement**:
- [ ] Site header (persistent)
- [ ] Product detail pages
- [ ] Cart page
- [ ] Checkout flow (each step)
- [ ] Order confirmation
- [ ] Email templates

### 4.2 Content Guidelines
Create content review checklist:
- [ ] No health claims
- [ ] No medical claims
- [ ] No therapeutic claims
- [ ] No human dosage recommendations
- [ ] Research context only

---

## 5. Blog ↔ PDP Cross-Links

### 5.1 Data Model

**Product custom fields** (Vendure):
```typescript
// vendure custom field definition
{
  name: 'peptideSlugs',
  type: 'string',
  list: true,
  label: 'Related Blog Articles',
  description: 'Slugs of related research articles'
}
```

**Blog frontmatter** (MDX):
```yaml
---
title: "BPC-157 Research Overview"
slug: "bpc-157-research"
relatedPeptides:
  - "bpc-157-5mg"
  - "bpc-157-10mg"
---
```

### 5.2 Implementation Tasks
- [ ] Add Vendure custom field for peptideSlugs
- [ ] Create blog MDX schema with relatedPeptides
- [ ] Build `<RelatedArticles />` component for PDP
- [ ] Build `<RelatedProducts />` component for blog
- [ ] Implement bidirectional query resolvers

---

## 6. Search (v1)

### 6.1 Features
| Feature | Priority | Status |
|---------|----------|--------|
| Basic text search | P0 | [ ] |
| Synonym mapping | P0 | [ ] |
| Fuzzy matching | P1 | [ ] |
| Goal facets | P1 | [ ] |
| Semantic search | P2 (future) | [ ] |

### 6.2 Synonym Configuration
```typescript
// lib/search/synonyms.ts
export const PEPTIDE_SYNONYMS: Record<string, string[]> = {
  'bpc-157': ['body protection compound', 'bpc157', 'bpc 157'],
  'tb-500': ['thymosin beta 4', 'tb500', 'tb 500'],
  'pt-141': ['bremelanotide', 'pt141'],
  // ... extend as needed
};
```

### 6.3 Goal Facets
Predefined research goal categories:
- [ ] Recovery & Repair
- [ ] Cognitive Research
- [ ] Metabolic Studies
- [ ] Longevity Research
- [ ] Immune Function

---

## 7. Catalog Views

### 7.1 View Components

**Thumbnail View** (default):
```
┌──────┐ ┌──────┐ ┌──────┐
│ IMG  │ │ IMG  │ │ IMG  │
│ Name │ │ Name │ │ Name │
│ $$$  │ │ $$$  │ │ $$$  │
└──────┘ └──────┘ └──────┘
```

**Detail View**:
```
┌─────────────────────────────┐
│ IMG │ Name                  │
│     │ Description excerpt   │
│     │ Key specs • Price     │
└─────────────────────────────┘
```

**Quick View Modal**:
- Triggered by hover/click on thumbnail
- Shows expanded product info
- CTA links to canonical PDP (no in-modal cart)

### 7.2 Implementation Tasks
- [ ] `<ProductCard variant="thumbnail" />`
- [ ] `<ProductCard variant="detail" />`
- [ ] `<QuickViewModal />`
- [ ] View toggle component
- [ ] Persist view preference (localStorage)

---

## 8. SEO Implementation

### 8.1 Route Structure
```
/                           # Homepage
/products                   # Catalog (all peptides)
/products/[slug]            # PDP (canonical)
/research                   # Blog index
/research/[slug]            # Blog article
/categories/[category]      # Category pages
```

### 8.2 JSON-LD Schemas

**Product (PDP)**:
```typescript
// lib/seo/product-schema.ts
export function generateProductSchema(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    }
  };
}
```

**Article (Blog)**:
```typescript
// lib/seo/article-schema.ts
export function generateArticleSchema(article: Article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { '@type': 'Organization', name: 'PEPTIDES Research' }
  };
}
```

### 8.3 Sitemap
- [ ] Configure next-sitemap for pharma-store
- [ ] Include all PDP routes
- [ ] Include all blog routes
- [ ] Exclude cart/checkout/account pages
- [ ] Set appropriate changefreq/priority

### 8.4 Canonical URLs
```tsx
// app/products/[slug]/page.tsx
export function generateMetadata({ params }) {
  return {
    alternates: {
      canonical: `https://peptides.example.com/products/${params.slug}`
    }
  };
}
```

---

## 9. UI Architecture

### 9.1 Directory Structure
```
apps/pharma-store/src/
├── app/                    # Next.js App Router
│   ├── (shop)/
│   │   ├── products/
│   │   │   ├── page.tsx    # Catalog
│   │   │   └── [slug]/
│   │   │       └── page.tsx # PDP
│   │   └── research/
│   │       ├── page.tsx    # Blog index
│   │       └── [slug]/
│   │           └── page.tsx # Article
│   └── layout.tsx
├── components/
│   ├── catalog/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── QuickViewModal.tsx
│   │   └── ViewToggle.tsx
│   ├── compliance/
│   │   └── ResearchDisclaimer.tsx
│   ├── pdp/
│   │   ├── ProductDetails.tsx
│   │   └── RelatedArticles.tsx
│   ├── blog/
│   │   ├── ArticleCard.tsx
│   │   └── RelatedProducts.tsx
│   └── search/
│       ├── SearchBar.tsx
│       └── FacetFilters.tsx
├── lib/
│   ├── api/
│   ├── cookies.ts
│   ├── search/
│   └── seo/
└── brands/
    └── peptides/
        └── theme.ts
```

### 9.2 Isolation Verification
- [ ] No imports from `@shofar/shofar-store`
- [ ] No imports from `@shofar/faxas-store`
- [ ] All shared code via `@shofar/api-client` or `@shofar/pharma-brand-config`

---

## 10. Implementation Phases

### Phase 1: Foundation
- [ ] API client with peptide channel header
- [ ] Cookie/privacy infrastructure
- [ ] Compliance disclaimer component
- [ ] Basic catalog page (thumbnail view)

### Phase 2: Product Experience
- [ ] PDP implementation
- [ ] Detail view variant
- [ ] Quick view modal
- [ ] JSON-LD for products

### Phase 3: Content & Search
- [ ] Blog system setup
- [ ] Blog ↔ PDP cross-links
- [ ] Search with synonyms
- [ ] Goal facets

### Phase 4: SEO & Polish
- [ ] Full JSON-LD coverage
- [ ] Sitemap generation
- [ ] Canonical URL audit
- [ ] Performance optimization

---

## 11. Acceptance Criteria

### Must Have (v1)
- [ ] All API calls use `vendure-token: peptide` header
- [ ] `__Host-` cookie prefix on all cookies
- [ ] "For Research Use Only" visible on all product-related pages
- [ ] No PII in application logs
- [ ] Thumbnail and Detail catalog views functional
- [ ] PDP pages with JSON-LD Product schema
- [ ] Basic search with synonym support

### Should Have (v1)
- [ ] Blog system with cross-links
- [ ] Goal-based facet filtering
- [ ] Quick view modal
- [ ] Full sitemap coverage

### Nice to Have (v1+)
- [ ] Semantic search
- [ ] Advanced analytics dashboard
- [ ] A/B testing infrastructure

---

## 12. Open Questions

1. **Analytics provider**: PostHog vs. dedicated pharma analytics solution?
2. **Blog CMS**: MDX files vs. headless CMS integration?
3. **Search backend**: Vendure native vs. Algolia/Meilisearch?
4. **Image CDN**: Shared with shofar-store or dedicated?

---

## Revision History

| Date | Author | Changes |
|------|--------|---------|
| TBD  | -      | Initial draft |
