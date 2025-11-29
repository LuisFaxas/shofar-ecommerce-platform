# TOOLY Storefront — Master Build Plan v3.0

**Document Version:** 3.0
**Created:** November 2024
**Status:** Ready for Execution
**Target:** MVP One-Page Storefront with Checkout

---

## Executive Summary

This Master Plan outlines the complete build sequence for the TOOLY one-page storefront. It is based on Work Orders 3.x but has been **restructured** for:

1. **Better parallelization** - Independent tasks can run concurrently
2. **Risk mitigation** - High-risk items identified with fallback strategies
3. **Missing pieces added** - Cart context, guest checkout, order confirmation
4. **Progressive enhancement** - Build shells first, enhance with data layer
5. **Clear dependencies** - Each phase clearly states prerequisites

---

## Current State Assessment

### What EXISTS (v2.5.2-RESTORED)

| Area                    | Status      | Notes                                 |
| ----------------------- | ----------- | ------------------------------------- |
| Design System           | ✅ Complete | 22+ components, tokens, motion, glass |
| ButtonPrimary (Rainbow) | ✅ Sacred   | Static gradient + blur glow           |
| Vendure Backend         | ✅ Running  | Channel `tooly`, :3001                |
| API Client Factory      | ✅ Ready    | Apollo Client with channel tokens     |
| Brand Resolution        | ✅ Working  | BRAND_KEY=tooly                       |
| PrimaryCtaProvider      | ✅ Active   | Tracks button usage                   |

### What's MISSING (Must Build)

| Area                      | Priority | Complexity |
| ------------------------- | -------- | ---------- |
| Page sections scaffold    | P0       | Medium     |
| GraphQL queries/mutations | P0       | Medium     |
| Cart Context & Drawer     | P0       | High       |
| Product Selector carousel | P0       | Medium     |
| Checkout integration      | P0       | High       |
| Age Gate modal            | P1       | Low        |
| 3D placeholder            | P1       | Medium     |
| SEO/structured data       | P1       | Low        |
| E2E tests                 | P2       | Medium     |

---

## Architecture Decisions

### Cart State Management

```
Option A: React Context + Vendure Order (CHOSEN)
├── Cart mutations persist to Vendure
├── Local state for optimistic UI
├── activeOrderId stored in cookie/localStorage
└── Guest checkout supported via anonymous orders

Option B: Zustand + Local-first (REJECTED)
└── Reason: Lose server-side cart persistence, more complex sync
```

### Checkout Flow

```
Cart Drawer → /checkout (multi-step)
├── Step 1: Shipping Address (guest email or login)
├── Step 2: Shipping Method
├── Step 3: Payment (Accept Hosted iframe)
└── Step 4: Confirmation
```

### Key Technical Decisions

- **No SSG for cart/checkout** - Dynamic content requires SSR
- **Accept Hosted iframe** - SAQ-A compliance, no card data on server
- **PostHog events** - Track conversion funnel
- **Embla Carousel** - Already in deps, performant

---

## Phase Overview

```
PHASE 0: Foundation (WO 3.0)          [Day 1]
    ↓
PHASE 1: Shell & Structure (WO 3.1)   [Day 2-3]
    ↓
PHASE 2: Data Layer (WO 3.3)          [Day 3-4] ← Can overlap with Phase 1
    ↓
PHASE 3: Hero + Product (WO 3.2, 3.4) [Day 5-6]
    ↓
PHASE 4: Cart System (WO 3.5)         [Day 7-8]
    ↓
PHASE 5: Accessories (WO 3.6)         [Day 8]
    ↓
PHASE 6: Checkout (WO 3.7)            [Day 9-12] ← Highest complexity
    ↓
PHASE 7: Legal & Polish (WO 3.8, 3.9) [Day 13-14]
    ↓
PHASE 8: QA & Launch (WO 3.10)        [Day 15]
```

---

## PHASE 0: Foundation & Environment Sanity

**Goal:** Validate environment, seed complete product data, ensure GraphQL types.

**Status:** ✅ COMPLETE (2025-11-28)

### Phase 0.1 Completion Summary

| Task                 | Status | Notes                                                                              |
| -------------------- | ------ | ---------------------------------------------------------------------------------- |
| Port Configuration   | ✅     | shofar-store :3000, vendure :3001                                                  |
| Vendure Connectivity | ✅     | Shop API returns data with `vendure-token: tooly`                                  |
| Seed Script          | ✅     | `seed-tooly-full.ts` creates 5 products, 6 TOOLY variants, 4 accessories           |
| GraphQL Codegen      | ✅     | `shop-types.ts` generated with `vendure-token: tooly` header                       |
| ESLint Config        | ✅     | Fixed relative paths (Windows symlink issue), `import/export` disabled for codegen |
| API Proxy Route      | ✅     | `/api/shop` route proxies to Vendure with tooly token                              |

**Verified Data (Shop API):**

- TOOLY: 6 variants (DLC-GM, CK-MID, CK-ARC, CK-EMB, CK-COB, CK-TIT)
- Accessories: 4 items (Case+Vial, Chain Gold, Chain Silver, Cleaning Kit)
- All products channel-scoped to `tooly`

### Tasks

#### 0.1 Port Configuration

```bash
# apps/shofar-store/package.json
"dev": "next dev -p 3000"

# Vendure stays on :3001
```

#### 0.2 Vendure Connectivity Test

```bash
pnpm --filter @shofar/vendure dev

# Test query
curl -s http://localhost:3001/shop-api \
  -H "Content-Type: application/json" \
  -H "vendure-token: tooly" \
  -d '{"query":"{ products(options:{take:5}){items{id name slug variants{id sku priceWithTax stockLevel}}} }"}'
```

#### 0.3 Enhanced Seed Data (CRITICAL)

Current seed has only 1 variant. Create script to seed:

```typescript
// apps/vendure/src/initial-data/seed-tooly-full.ts
const TOOLY_VARIANTS = [
  {
    name: "DLC Gunmetal",
    sku: "TOOLY-DLC-GM",
    price: 14900,
    color: "gunmetal",
  },
  {
    name: "Cerakote Midnight",
    sku: "TOOLY-CK-MID",
    price: 16900,
    color: "black",
  },
  {
    name: "Cerakote Arctic",
    sku: "TOOLY-CK-ARC",
    price: 16900,
    color: "white",
  },
  {
    name: "Cerakote Ember",
    sku: "TOOLY-CK-EMB",
    price: 16900,
    color: "orange",
  },
  { name: "Cerakote Cobalt", sku: "TOOLY-CK-COB", price: 16900, color: "blue" },
  {
    name: "Cerakote Titanium",
    sku: "TOOLY-CK-TIT",
    price: 18900,
    color: "silver",
  },
];

const ACCESSORIES = [
  { name: "Silicone Case + Glass Vial", sku: "ACC-CASE-001", price: 2499 },
  { name: "Carry Chain - Gold", sku: "ACC-CHAIN-GLD", price: 1999 },
  { name: "Carry Chain - Silver", sku: "ACC-CHAIN-SLV", price: 1999 },
  { name: "Cleaning Kit", sku: "ACC-CLEAN-001", price: 999 },
];
```

#### 0.4 GraphQL Codegen

```bash
pnpm --filter @shofar/api-client codegen
```

### Acceptance Criteria

- [x] `http://localhost:3001/shop-api` returns TOOLY product ✅
- [x] 6 variants in channel `tooly` ✅
- [x] Accessories collection with 4 items ✅
- [x] Generated types available in `@shofar/api-client` ✅

### Files Changed

- `apps/shofar-store/package.json` (port)
- `apps/vendure/src/initial-data/seed-tooly-full.ts` (NEW)
- `apps/vendure/package.json` (add seed:tooly script)

---

## PHASE 1: Page Shell & Cart Context

**Goal:** Create the one-page structure and global cart infrastructure.

### Tasks

#### 1.1 Section IDs & Scaffold

```
#hero
#credibility (renamed from #proof - clearer)
#technology
#gallery
#product
#accessories
#reviews
#faq
#footer
```

#### 1.2 Cart Context Provider (NEW - Critical Addition)

```typescript
// apps/shofar-store/src/contexts/CartContext.tsx
interface CartContextValue {
  order: Order | null;
  loading: boolean;
  error: Error | null;
  itemCount: number;
  subtotal: number;

  // Actions
  addToCart: (variantId: string, quantity: number) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  clearCart: () => Promise<void>;

  // Drawer state
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}
```

#### 1.3 Cart Drawer Shell

- Empty state UI
- Loading skeleton
- Close on ESC / overlay click
- Focus trap for accessibility

#### 1.4 Navbar Integration

- Anchor links for all sections
- Mobile hamburger menu
- Cart icon with badge (from CartContext)
- Sticky on scroll

#### 1.5 Footer Shell

- Policy links (placeholder routes)
- Contact info
- Social links
- Legal disclaimer

### Acceptance Criteria

- [ ] All 9 sections render with placeholder content
- [ ] Smooth scroll to anchors works
- [ ] Cart Drawer opens/closes from any section
- [ ] CartContext provides item count to Navbar
- [ ] Mobile menu works
- [ ] CLS ≤ 0.02

### Files Changed

- `apps/shofar-store/src/brands/tooly/index.tsx` (full rewrite)
- `apps/shofar-store/src/contexts/CartContext.tsx` (NEW)
- `apps/shofar-store/src/brands/tooly/components/CartDrawer.tsx` (NEW)
- `apps/shofar-store/src/brands/tooly/sections/*.tsx` (NEW - 9 files)
- `apps/shofar-store/src/app/layout.tsx` (wrap CartProvider)

---

## PHASE 2: Data Layer

**Goal:** Create all GraphQL queries, mutations, and React hooks.

### Tasks

#### 2.1 GraphQL Queries

```graphql
# packages/api-client/src/queries/shop/products.graphql

fragment ProductFields on Product {
  id
  name
  slug
  description
  featuredAsset {
    id
    preview
    source
  }
  variants {
    id
    name
    sku
    priceWithTax
    stockLevel
    featuredAsset {
      id
      preview
      source
    }
    facetValues {
      id
      name
      code
      facet {
        id
        name
        code
      }
    }
  }
}

query GetToolyProduct {
  product(slug: "tooly") {
    ...ProductFields
  }
}

query GetAccessoriesCollection {
  collection(slug: "accessories") {
    id
    name
    productVariants {
      items {
        id
        name
        sku
        priceWithTax
        stockLevel
        product {
          id
          name
          slug
          featuredAsset {
            preview
          }
        }
      }
    }
  }
}
```

#### 2.2 Cart Mutations

```graphql
# packages/api-client/src/mutations/shop/order.graphql

mutation AddItemToOrder($variantId: ID!, $quantity: Int!) {
  addItemToOrder(productVariantId: $variantId, quantity: $quantity) {
    ... on Order {
      id
      code
      totalWithTax
      lines {
        id
        quantity
        linePriceWithTax
        productVariant {
          id
          name
          sku
          priceWithTax
        }
      }
    }
    ... on ErrorResult {
      errorCode
      message
    }
  }
}

mutation UpdateOrderLine($lineId: ID!, $quantity: Int!) {
  adjustOrderLine(orderLineId: $lineId, quantity: $quantity) {
    ... on Order {
      ...OrderFields
    }
    ... on ErrorResult {
      errorCode
      message
    }
  }
}

mutation RemoveOrderLine($lineId: ID!) {
  removeOrderLine(orderLineId: $lineId) {
    ... on Order {
      ...OrderFields
    }
    ... on ErrorResult {
      errorCode
      message
    }
  }
}

query GetActiveOrder {
  activeOrder {
    ...OrderFields
  }
}
```

#### 2.3 React Hooks

```typescript
// apps/shofar-store/src/lib/hooks/useProduct.ts
export function useToolyProduct() {
  // Returns { product, variants, loading, error }
}

// apps/shofar-store/src/lib/hooks/useAccessories.ts
export function useAccessories() {
  // Returns { accessories, loading, error }
}

// apps/shofar-store/src/lib/hooks/useCart.ts
export function useCart() {
  // Returns CartContext value with mutations
}
```

#### 2.4 Error & Loading States

- Skeleton components for product cards
- Error boundary for data failures
- Retry logic for transient failures
- Empty state designs

### Acceptance Criteria

- [ ] `useToolyProduct()` returns 6 variants
- [ ] `useAccessories()` returns 4 items
- [ ] `useCart()` mutations update Vendure order
- [ ] Error states show informative UI (not crashes)
- [ ] Network offline shows graceful degradation

### Files Changed

- `packages/api-client/src/queries/shop/*.graphql` (NEW)
- `packages/api-client/src/mutations/shop/*.graphql` (NEW)
- `apps/shofar-store/src/lib/hooks/*.ts` (NEW)
- `apps/shofar-store/src/components/skeletons/*.tsx` (NEW)

---

## PHASE 3: Hero & Product Selector

**Goal:** Build the hero section with 3D placeholder and the product selector carousel.

### Tasks

#### 3.1 Hero Section

```
┌─────────────────────────────────────────────────────┐
│                    [3D HEX TUBE]                    │
│                  (rotates slowly)                   │
│                                                     │
│              TOOLY by SHOFAR                        │
│     Precision. Airflow. Perfection.                 │
│                                                     │
│   [🌈 Shop Now]     [Learn More →]                  │
│                                                     │
│        "4× airflow • Hex anti-roll • DLC"           │
└─────────────────────────────────────────────────────┘
```

- **3D Placeholder:** CSS hexagonal tube (pure CSS or Three.js simple shape)
- **Reduced motion:** Static image fallback
- **Rainbow CTA:** `ButtonPrimary` → scrolls to #product
- **Secondary CTA:** `ButtonSecondary` (glass) → scrolls to #technology
- **PostHog event:** `hero_cta_clicked`

#### 3.2 Hex Tube CSS Placeholder

```css
/* 3D hex tube with CSS transforms - no WebGL needed initially */
.hex-tube {
  width: 120px;
  height: 300px;
  transform-style: preserve-3d;
  animation: rotate-y 20s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .hex-tube {
    animation: none;
  }
}
```

#### 3.3 Product Selector Section

```
┌─────────────────────────────────────────────────────┐
│              Choose Your TOOLY                      │
│                                                     │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐     │
│  │      │ │      │ │  ●   │ │      │ │      │     │
│  │ DLC  │ │ Mid  │ │ Arc  │ │ Emb  │ │ Cob  │     │
│  │      │ │      │ │      │ │      │ │      │     │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘     │
│           ← swipe / arrows →                        │
│                                                     │
│   Cerakote Arctic          $169.00                  │
│   In Stock                                          │
│                                                     │
│   Qty: [−] 1 [+]                                    │
│                                                     │
│         [🌈 Add to Cart]                            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

- **Embla Carousel:** Horizontal swipe, snap-to-center
- **Variant Cards:** Image, name, finish indicator
- **Selected State:** Scale + border highlight
- **Price Display:** `priceWithTax` formatted
- **Stock Display:** "In Stock" / "Low Stock" / "Out of Stock"
- **QuantityStepper:** Existing component
- **Add to Cart:** `ButtonPrimary` (rainbow) - THIS IS THE PRINCIPAL CTA

#### 3.4 Gallery Section

- Lightbox-capable image grid
- Short video loops (autoplay muted)
- Lazy loading with blur placeholders

### Acceptance Criteria

- [ ] Hero 3D placeholder rotates (or shows still with reduced-motion)
- [ ] Rainbow CTA scrolls to #product
- [ ] Carousel swipes smoothly on touch
- [ ] Keyboard arrows navigate variants
- [ ] Add to Cart updates CartContext
- [ ] Toast confirms addition
- [ ] No CLS during image loads

### Files Changed

- `apps/shofar-store/src/brands/tooly/sections/HeroSection.tsx`
- `apps/shofar-store/src/brands/tooly/sections/ProductSection.tsx`
- `apps/shofar-store/src/brands/tooly/sections/GallerySection.tsx`
- `apps/shofar-store/src/brands/tooly/components/HexTube.tsx` (NEW)
- `apps/shofar-store/src/brands/tooly/components/VariantCarousel.tsx` (NEW)
- `apps/shofar-store/src/brands/tooly/components/VariantCard.tsx` (NEW)

---

## PHASE 4: Cart System

**Goal:** Full cart drawer with persistence, totals, and upsell preparation.

### Tasks

#### 4.1 Cart Drawer Implementation

```
┌─────────────────────────────────────────────────────┐
│  Your Cart (2 items)                         [✕]   │
├─────────────────────────────────────────────────────┤
│  ┌────┐                                             │
│  │    │  TOOLY - Cerakote Arctic                   │
│  │ 🔧 │  $169.00              [−] 1 [+]  [Remove]  │
│  └────┘                                             │
│                                                     │
│  ┌────┐                                             │
│  │    │  Silicone Case + Vial                      │
│  │ 📦 │  $24.99               [−] 1 [+]  [Remove]  │
│  └────┘                                             │
│                                                     │
├─────────────────────────────────────────────────────┤
│  💡 Complete your setup:                            │
│  ┌──────────┐ ┌──────────┐                         │
│  │ Case     │ │ Chain    │                         │
│  │ $24.99   │ │ $19.99   │                         │
│  │ [+ Add]  │ │ [+ Add]  │                         │
│  └──────────┘ └──────────┘                         │
├─────────────────────────────────────────────────────┤
│                          Subtotal:      $193.99    │
│                                                     │
│         [🟠 Continue to Checkout]                   │
│                                                     │
│  Shipping calculated at checkout                    │
└─────────────────────────────────────────────────────┘
```

#### 4.2 Features

- **Line Items:** Image, name, variant, price, quantity stepper
- **Remove Action:** Confirm modal for expensive items
- **Upsell Panel:** Shows if TOOLY in cart but no case
- **Subtotal:** Real-time calculation
- **Checkout CTA:** `ButtonBrand` (orange) → /checkout
- **Persistence:** Vendure order survives refresh

#### 4.3 Cart Persistence Strategy

```typescript
// On mount: Check for existing order
const existingOrderToken = localStorage.getItem("vendure-order-token");
if (existingOrderToken) {
  // Restore from Vendure
  const order = await getActiveOrder();
  setOrder(order);
}

// On add/update: Vendure handles persistence automatically via auth token
```

#### 4.4 Empty State

```
┌─────────────────────────────────────────────────────┐
│  Your Cart                                   [✕]   │
│                                                     │
│              🛒                                     │
│        Your cart is empty                          │
│                                                     │
│     [Browse Products →]                            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Acceptance Criteria

- [ ] Items display with correct data
- [ ] Quantity updates persist after refresh
- [ ] Upsell panel appears conditionally
- [ ] Checkout button navigates to /checkout
- [ ] Focus trap works in drawer
- [ ] ESC and overlay click close drawer
- [ ] aria-live announces cart updates

### Files Changed

- `apps/shofar-store/src/brands/tooly/components/CartDrawer.tsx` (enhance)
- `apps/shofar-store/src/brands/tooly/components/CartLineItem.tsx` (NEW)
- `apps/shofar-store/src/brands/tooly/components/CartUpsell.tsx` (NEW)
- `apps/shofar-store/src/brands/tooly/components/CartEmpty.tsx` (NEW)
- `apps/shofar-store/src/contexts/CartContext.tsx` (enhance)

---

## PHASE 5: Accessories Section

**Goal:** Data-driven accessories grid with auto-hide.

### Tasks

#### 5.1 Accessories Grid

```
┌─────────────────────────────────────────────────────┐
│              Complete Your Setup                    │
│                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐│
│  │   📦     │ │   ⛓️     │ │   ⛓️     │ │  🧹   ││
│  │          │ │          │ │          │ │        ││
│  │ Case +   │ │ Chain    │ │ Chain    │ │ Clean  ││
│  │ Vial     │ │ Gold     │ │ Silver   │ │ Kit    ││
│  │ $24.99   │ │ $19.99   │ │ $19.99   │ │ $9.99  ││
│  │          │ │          │ │          │ │        ││
│  │ [+ Add]  │ │ [+ Add]  │ │ [+ Add]  │ │[+ Add] ││
│  └──────────┘ └──────────┘ └──────────┘ └────────┘│
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### 5.2 Auto-Hide Logic

```typescript
const { accessories, loading } = useAccessories();

// If no accessories exist, hide section AND nav link
if (!loading && accessories.length === 0) {
  return null;
}
```

#### 5.3 Add Behavior

- First click: Add to cart + show toast
- Second click: Show QuantityStepper inline
- Uses same CartContext as Product section

### Acceptance Criteria

- [ ] Grid renders from Vendure data
- [ ] Section hidden when collection empty
- [ ] Nav link removed when section hidden
- [ ] Add button works correctly
- [ ] No layout shift on first add

### Files Changed

- `apps/shofar-store/src/brands/tooly/sections/AccessoriesSection.tsx`
- `apps/shofar-store/src/brands/tooly/components/AccessoryCard.tsx` (NEW)

---

## PHASE 6: Checkout (HIGH COMPLEXITY)

**Goal:** SAQ-A compliant checkout with Authorize.Net Accept Hosted.

### Sub-Phases

#### 6A: Checkout Page Structure

```
/checkout
├── Step 1: Contact & Shipping
├── Step 2: Shipping Method
├── Step 3: Payment (iframe)
└── Step 4: Confirmation
```

#### 6B: Vendure Plugin for Authorize.Net

```typescript
// apps/vendure/src/plugins/authorize-net/authorize-net.plugin.ts
import { VendurePlugin, PluginCommonModule } from "@vendure/core";
import { AuthorizeNetPaymentHandler } from "./authorize-net.handler";

@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [],
  configuration: (config) => {
    config.paymentOptions.paymentMethodHandlers.push(
      AuthorizeNetPaymentHandler,
    );
    return config;
  },
})
export class AuthorizeNetPlugin {}
```

#### 6C: Payment Handler

```typescript
// apps/vendure/src/plugins/authorize-net/authorize-net.handler.ts
export const AuthorizeNetPaymentHandler = new PaymentMethodHandler({
  code: "authorize-net-hosted",
  description: [
    { languageCode: LanguageCode.en, value: "Authorize.Net Accept Hosted" },
  ],

  args: {
    apiLoginId: { type: "string" },
    transactionKey: { type: "string" },
    signatureKey: { type: "string" },
    sandbox: { type: "boolean" },
  },

  createPayment: async (ctx, order, amount, args, metadata) => {
    // Return pending - payment will be completed via webhook
    return {
      state: "Authorized",
      transactionId: metadata.transId,
      metadata,
    };
  },

  settlePayment: async (ctx, order, payment, args) => {
    return { success: true };
  },
});
```

#### 6D: Get Hosted Payment Token (Shop API Extension)

```typescript
// Custom resolver to get Accept Hosted token
@Resolver()
export class AuthorizeNetResolver {
  @Mutation()
  async requestHostedPaymentToken(
    @Ctx() ctx: RequestContext,
    @Args() args: { orderCode: string },
  ): Promise<string> {
    // Call Authorize.Net API to get hosted page token
    // Return token to frontend
  }
}
```

#### 6E: Frontend Checkout Flow

```typescript
// apps/shofar-store/src/app/checkout/page.tsx
export default function CheckoutPage() {
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');

  return (
    <div>
      {step === 'shipping' && <ShippingForm onComplete={() => setStep('payment')} />}
      {step === 'payment' && <PaymentIframe onComplete={() => setStep('confirmation')} />}
      {step === 'confirmation' && <OrderConfirmation />}
    </div>
  );
}
```

#### 6F: Accept Hosted iFrame

```typescript
// apps/shofar-store/src/brands/tooly/components/PaymentIframe.tsx
export function PaymentIframe({ token, onComplete }: Props) {
  useEffect(() => {
    // Listen for postMessage from communicator.html
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleMessage = (event: MessageEvent) => {
    // Verify origin
    if (!ALLOWED_ORIGINS.includes(event.origin)) return;

    if (event.data.transactResponse) {
      // Payment successful
      onComplete(event.data);
    }
  };

  return (
    <iframe
      src={`https://accept.authorize.net/payment/payment?token=${token}`}
      className="w-full h-[600px] border-0"
    />
  );
}
```

#### 6G: Communicator HTML

```html
<!-- public/authorize-net/communicator.html -->
<!DOCTYPE html>
<html>
  <head>
    <script>
      // STRICT ORIGIN ALLOWLIST - NO WILDCARDS
      const ALLOWED_ORIGINS = [
        "https://accept.authorize.net",
        "https://test.authorize.net",
      ];

      function receiveMessage(event) {
        if (!ALLOWED_ORIGINS.includes(event.origin)) {
          console.warn("Blocked message from:", event.origin);
          return;
        }
        window.parent.postMessage(event.data, window.location.origin);
      }

      window.addEventListener("message", receiveMessage, false);
    </script>
  </head>
  <body></body>
</html>
```

#### 6H: Webhook Handler (Vendure)

```typescript
// apps/vendure/src/plugins/authorize-net/webhook.controller.ts
@Controller("authorize-net")
export class AuthorizeNetWebhookController {
  @Post("webhook")
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    // Verify HMAC-SHA512 signature
    const signature = req.headers["x-anet-signature"];
    const isValid = this.verifySignature(req.body, signature);

    if (!isValid) {
      return res.status(401).send("Invalid signature");
    }

    // Process webhook
    // Update order state in Vendure
  }
}
```

### Risk Mitigation

- **Fallback:** If Authorize.Net integration blocked, use Vendure's `dummyPaymentHandler` for demo
- **Sandbox first:** All dev uses sandbox credentials
- **Manual testing:** Test with Authorize.Net sandbox card numbers

### Acceptance Criteria

- [ ] Checkout page loads with shipping form
- [ ] Accept Hosted iframe displays
- [ ] Communicator handles postMessage securely
- [ ] Successful payment transitions order state
- [ ] Confirmation page shows order code
- [ ] No card data touches our server (SAQ-A)

### Files Changed

- `apps/vendure/src/plugins/authorize-net/*.ts` (NEW - 5 files)
- `apps/shofar-store/src/app/checkout/page.tsx` (NEW)
- `apps/shofar-store/src/app/checkout/confirmation/page.tsx` (NEW)
- `apps/shofar-store/src/brands/tooly/components/checkout/*.tsx` (NEW - 4 files)
- `apps/shofar-store/public/authorize-net/communicator.html` (NEW)

### Environment Variables Required

```bash
# Authorize.Net (add to .env)
AUTHORIZE_NET_API_LOGIN_ID=xxx
AUTHORIZE_NET_TRANSACTION_KEY=xxx
AUTHORIZE_NET_SIGNATURE_KEY=xxx
AUTHORIZE_NET_SANDBOX=true
```

---

## PHASE 7: Legal, Age Gate, SEO

**Goal:** Compliance, discoverability, and polish.

### Tasks

#### 7.1 Age Gate Modal

```typescript
// apps/shofar-store/src/brands/tooly/components/AgeGate.tsx
export function AgeGate() {
  const [verified, setVerified] = useState(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem('age-verified') === 'true';
  });

  if (verified) return null;

  return (
    <Dialog open={!verified} onOpenChange={() => {}}>
      <DialogContent className="...">
        <h2>Age Verification Required</h2>
        <p>You must be 18 or older to enter this site.</p>
        <p>By continuing, you confirm you meet your local age requirements.</p>

        <div className="flex gap-4">
          <ButtonPrimary onClick={handleVerify}>
            I am 18 or older
          </ButtonPrimary>
          <ButtonSecondary onClick={handleExit}>
            Exit
          </ButtonSecondary>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

#### 7.2 Policy Pages/Drawers

```
/policies/intended-use     → Drawer or page
/policies/care-cleaning    → Drawer or page
/policies/warranty         → Drawer or page
/policies/returns          → Drawer or page
/policies/shipping         → Drawer or page
/policies/privacy          → Page (legal requirement)
/policies/terms            → Page (legal requirement)
```

#### 7.3 SEO Implementation

```typescript
// apps/shofar-store/src/app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL("https://tooly.shop"),
  title: {
    default: "TOOLY by SHOFAR | Premium Nasal Delivery Device",
    template: "%s | TOOLY",
  },
  description:
    "Precision-engineered nasal delivery device with patented 4× airflow, DLC coating, and hex anti-roll design.",
  keywords: ["nasal straw", "premium snuff tool", "DLC coating", "tooly"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "TOOLY by SHOFAR",
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

#### 7.4 Structured Data (JSON-LD)

```typescript
// Product schema
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "TOOLY",
  description: "...",
  brand: { "@type": "Brand", name: "SHOFAR" },
  offers: {
    "@type": "AggregateOffer",
    lowPrice: 149,
    highPrice: 189,
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
};
```

#### 7.5 PostHog Events

```typescript
const EVENTS = {
  // Funnel
  PAGE_VIEW: "page_view",
  HERO_CTA_CLICKED: "hero_cta_clicked",
  VARIANT_SELECTED: "variant_selected",
  ADD_TO_CART: "add_to_cart",
  CART_OPENED: "cart_opened",
  CHECKOUT_STARTED: "checkout_started",
  CHECKOUT_COMPLETED: "checkout_completed",

  // Engagement
  GALLERY_VIEWED: "gallery_viewed",
  FAQ_EXPANDED: "faq_expanded",
  ACCESSORY_ADDED: "accessory_added",
};
```

### Acceptance Criteria

- [ ] Age gate shows on first visit
- [ ] Age gate persists in localStorage
- [ ] All policies accessible from footer
- [ ] Legal disclaimer in footer
- [ ] Structured data passes Rich Results Test
- [ ] PostHog receives all funnel events
- [ ] Lighthouse SEO score > 90

### Files Changed

- `apps/shofar-store/src/brands/tooly/components/AgeGate.tsx` (NEW)
- `apps/shofar-store/src/app/policies/[slug]/page.tsx` (NEW)
- `apps/shofar-store/src/lib/analytics.ts` (NEW)
- `apps/shofar-store/src/app/layout.tsx` (enhance metadata)
- `apps/shofar-store/src/brands/tooly/sections/FooterSection.tsx` (enhance)

---

## PHASE 8: QA & Launch

**Goal:** Test coverage, documentation, performance validation.

### Tasks

#### 8.1 E2E Tests (Playwright)

```typescript
// e2e/tooly-checkout.spec.ts
test.describe("TOOLY Checkout Flow", () => {
  test("complete purchase happy path", async ({ page }) => {
    // 1. Visit homepage
    await page.goto("/");

    // 2. Verify age gate
    await page.click("text=I am 18 or older");

    // 3. Navigate to product
    await page.click("text=Shop Now");

    // 4. Select variant
    await page.click('[data-variant="TOOLY-CK-ARC"]');

    // 5. Add to cart
    await page.click("text=Add to Cart");

    // 6. Verify cart drawer
    await expect(page.locator('[data-testid="cart-drawer"]')).toBeVisible();

    // 7. Proceed to checkout
    await page.click("text=Continue to Checkout");

    // 8. Fill shipping
    // ... etc
  });
});
```

#### 8.2 Performance Validation

```bash
# Local Lighthouse
npx lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html

# Expected scores
# Performance: > 90
# Accessibility: > 95
# Best Practices: > 95
# SEO: > 95
```

#### 8.3 Budgets Check

- FCP < 1.8s
- LCP < 2.5s
- CLS ≤ 0.02
- Initial JS < 200KB gzipped

#### 8.4 Documentation Updates

- `apps/shofar-store/README.md` - Architecture, section management
- `CLAUDE.md` - New commands, env vars
- `apps/vendure/README.md` - Plugin documentation

### Acceptance Criteria

- [ ] E2E happy path passes
- [ ] Lighthouse scores meet targets
- [ ] All READMEs updated
- [ ] No console errors in production build

---

## Dependency Graph

```
PHASE 0 ─────────────────────────────────────────────────────────┐
    │                                                             │
    v                                                             │
PHASE 1 (Shell) ──────────────────────┐                          │
    │                                  │                          │
    v                                  v                          │
PHASE 2 (Data) ◄──────────────────────┤                          │
    │                                  │                          │
    v                                  │                          │
PHASE 3 (Hero + Product) ◄────────────┘                          │
    │                                                             │
    v                                                             │
PHASE 4 (Cart) ◄──────────────────────────────────────────────────┤
    │                                                             │
    v                                                             │
PHASE 5 (Accessories)                                             │
    │                                                             │
    v                                                             │
PHASE 6 (Checkout) ◄──────────────────────────────────────────────┘
    │                                     │
    v                                     v
PHASE 7 (Legal/SEO) ◄─────────────────────┤ (Can run in parallel)
    │                                     │
    v                                     v
PHASE 8 (QA) ◄────────────────────────────┘
```

---

## Risk Register

| Risk                                   | Probability | Impact | Mitigation                        |
| -------------------------------------- | ----------- | ------ | --------------------------------- |
| Authorize.Net sandbox keys unavailable | Medium      | High   | Use dummyPaymentHandler for demo  |
| Accept Hosted iframe blocked by CSP    | Low         | High   | Pre-configure CSP headers         |
| Vendure cart doesn't persist           | Low         | High   | Test persistence early in Phase 1 |
| 3D placeholder too slow                | Medium      | Low    | Use pure CSS hex tube fallback    |
| PostHog not configured                 | Low         | Low    | Events queue locally, sync later  |

---

## Environment Checklist

```bash
# .env.local (shofar-store)
NEXT_PUBLIC_VENDURE_SHOP_API_URL=http://localhost:3001/shop-api
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx  # Optional for dev
BRAND_KEY=tooly

# .env (vendure)
NODE_ENV=development
DB_TYPE=better-sqlite3
SUPERADMIN_USERNAME=superadmin
SUPERADMIN_PASSWORD=superadmin123
COOKIE_SECRET=dev-secret-change-in-prod
PORT=3001

# Payment (add when ready)
AUTHORIZE_NET_API_LOGIN_ID=
AUTHORIZE_NET_TRANSACTION_KEY=
AUTHORIZE_NET_SIGNATURE_KEY=
AUTHORIZE_NET_SANDBOX=true
```

---

## Command Quick Reference

```bash
# Start development
pnpm --filter @shofar/vendure dev          # Terminal 1
pnpm --filter @shofar/shofar-store dev     # Terminal 2

# Seed data
pnpm --filter @shofar/vendure run setup    # Initial setup
pnpm --filter @shofar/vendure run seed:tooly  # TOOLY products (after we create it)

# GraphQL codegen
pnpm --filter @shofar/api-client codegen

# Type check
pnpm --filter @shofar/shofar-store typecheck

# E2E tests
pnpm test:e2e

# Production build test
pnpm --filter @shofar/shofar-store build
```

---

## Changelog vs Original Work Orders

| Change                                    | Reason                          |
| ----------------------------------------- | ------------------------------- |
| Added CartContext Provider in Phase 1     | Critical infrastructure missing |
| Split Checkout (WO 3.7) into 8 sub-phases | Too complex for single WO       |
| Added guest checkout flow                 | Not mentioned in original       |
| Added Order Confirmation page             | Missing from original           |
| Renamed #proof to #credibility            | Clearer section naming          |
| Added detailed seed data script           | Original only had 1 variant     |
| Added error/retry logic specs             | Missing from original           |
| Added Risk Register                       | Missing from original           |
| Added Environment Checklist               | Scattered in original           |
| Added Dependency Graph                    | Implicit in original            |

---

## End of Master Plan

**Next Step:** Begin PHASE 0 - validate environment and seed data.

**Claude:** Execute phases sequentially. If blocked, note the blocker and continue with parallel work where possible. Ask ONE precise question if truly stuck.
