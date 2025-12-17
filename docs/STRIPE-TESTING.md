# Stripe Payment Testing Guide

This guide covers local development setup for testing Stripe payments in the TOOLY store.

## Prerequisites

1. **Stripe Account**: Create a free account at [stripe.com](https://stripe.com)
2. **Stripe CLI**: Install for webhook forwarding during development

## Installation

### Windows (Scoop)

```bash
scoop install stripe
```

### macOS (Homebrew)

```bash
brew install stripe/stripe-cli/stripe
```

### Login to Stripe CLI

```bash
stripe login
```

## Configuration

### 1. Get Your Test API Keys

1. Go to [Stripe Dashboard → Developers → API keys](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Publishable key** (`pk_test_...`)
3. Copy your **Secret key** (`sk_test_...`)

### 2. Configure Vendure Payment Method

1. Start Vendure: `pnpm --filter @shofar/vendure dev`
2. Open Admin UI: http://localhost:3001/admin
3. Login with `superadmin` / `superadmin123`
4. Navigate to **Settings → Payment Methods → Create new payment method**
5. Configure:
   - **Name**: "Stripe"
   - **Code**: "stripe" (auto-filled)
   - **Handler**: Select "Stripe payments"
   - **API Key**: Paste your `sk_test_...` key
   - **Webhook Secret**: Leave empty for now (we'll get this next)
   - **Enabled**: Yes
   - **Channel**: Select "tooly"
6. Save the payment method

### 3. Start Webhook Forwarding

In a new terminal:

```bash
stripe listen --forward-to localhost:3001/payments/stripe
```

You'll see output like:

```
> Ready! Your webhook signing secret is whsec_...
```

Copy the `whsec_...` value.

### 4. Update Webhook Secret

1. Go back to Admin UI → Settings → Payment Methods → Stripe
2. Paste the webhook secret in the **Webhook Secret** field
3. Save

### 5. Configure Storefront

Create `apps/shofar-store/.env.local`:

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
```

## Testing Checkout

### Start Services

```bash
# Terminal 1: Vendure
pnpm --filter @shofar/vendure dev

# Terminal 2: Storefront
pnpm --filter @shofar/shofar-store dev

# Terminal 3: Stripe webhook forwarding
stripe listen --forward-to localhost:3001/payments/stripe
```

### Test Cards

| Card Number           | Behavior           |
| --------------------- | ------------------ |
| `4242 4242 4242 4242` | Success            |
| `4000 0000 0000 0002` | Declined           |
| `4000 0027 6000 3184` | 3D Secure required |

Use any future expiry date and any 3-digit CVC.

### End-to-End Flow

1. Open http://localhost:3000
2. Add TOOLY to cart
3. Click "Checkout"
4. Fill shipping address
5. Select shipping method
6. Enter test card `4242 4242 4242 4242`
7. Click "Place Order"
8. Verify confirmation page shows order code
9. Check Vendure Admin → Orders → Order state is "PaymentSettled"

## Troubleshooting

### "Failed to create payment intent"

- Verify Stripe payment method is configured in Admin UI
- Check API key is correct (`sk_test_...`)
- Ensure payment method is assigned to "tooly" channel
- Check Vendure logs for errors

### Payment Element not showing

- Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set in `.env.local`
- Restart the Next.js dev server after changing env vars

### Order stays in "ArrangingPayment"

- Ensure `stripe listen` is running
- Verify webhook secret matches what's in Admin UI
- Check Stripe CLI output for webhook delivery status

### "No such PaymentIntent"

- Payment intent may have expired (24 hours)
- Start a new checkout flow

## Going Live

Before going live:

1. Switch to live API keys in Stripe Dashboard
2. Update Vendure payment method with live `sk_live_...` key
3. Create real webhook endpoint in Stripe Dashboard pointing to your production URL
4. Update webhook secret in Vendure
5. Update storefront env with live `pk_live_...` key
6. Test with real cards in a small amount first

## Resources

- [Stripe Payment Element](https://stripe.com/docs/payments/payment-element)
- [Vendure StripePlugin](https://docs.vendure.io/reference/core-plugins/payments-plugin/stripe-plugin/)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Stripe Test Cards](https://stripe.com/docs/testing#cards)
