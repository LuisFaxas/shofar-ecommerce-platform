# TOOLY Store - User Manual

> **Version**: 1.0
> **Last Updated**: December 18, 2025
> **Audience**: TOOLY Team Members

---

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Services We Use](#services-we-use)
4. [Admin Panel Guide](#admin-panel-guide)
5. [Managing Products](#managing-products)
6. [Managing Content](#managing-content)
7. [Processing Orders](#processing-orders)
8. [Customer Storefront](#customer-storefront)
9. [Common Tasks](#common-tasks)
10. [Troubleshooting](#troubleshooting)
11. [Glossary](#glossary)

---

## Overview

TOOLY is an e-commerce platform for selling precision-crafted aroma delivery devices. The system consists of:

- **Customer-facing website** - Where customers browse and purchase products
- **Admin panel** - Where team members manage products, orders, and content
- **Payment processing** - Secure credit card payments via Stripe
- **Asset storage** - Product images stored in the cloud

### Key URLs

| What           | URL                                                                                |
| -------------- | ---------------------------------------------------------------------------------- |
| Customer Store | https://shofar-ecommerce-platform-shofar-st.vercel.app                             |
| Admin Panel    | https://vendure-server-production-75fc.up.railway.app/admin (FAXAS Ecom Solutions) |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    HOW IT ALL CONNECTS                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   CUSTOMER                                                   │
│      │                                                       │
│      ▼                                                       │
│   ┌─────────────────┐                                       │
│   │  TOOLY Website  │  ◄── Hosted on Vercel                 │
│   │  (Storefront)   │      (Frontend)                       │
│   └────────┬────────┘                                       │
│            │                                                 │
│            ▼                                                 │
│   ┌─────────────────┐                                       │
│   │  FAXAS Ecom     │  ◄── Hosted on Railway                │
│   │  Solutions      │      (Backend + Database)             │
│   └────────┬────────┘                                       │
│            │                                                 │
│       ┌────┴────┐                                           │
│       ▼         ▼                                           │
│   ┌───────┐ ┌───────┐                                       │
│   │Stripe │ │  R2   │                                       │
│   │(Pay)  │ │(Images)│                                      │
│   └───────┘ └───────┘                                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Services We Use

### 1. Vercel (Frontend Hosting)

**What it does**: Hosts the customer-facing website that shoppers see.

**Key features**:

- Automatically deploys when we push code updates
- Fast global delivery (CDN)
- SSL/HTTPS security included

**Dashboard**: https://vercel.com/dashboard

---

### 2. Railway (Backend Hosting)

**What it does**: Hosts the FAXAS Ecom Solutions admin panel and database.

**Key features**:

- Runs the order management system
- Stores all product data, orders, and customer info
- Processes business logic

**Dashboard**: https://railway.app/dashboard

---

### 3. Stripe (Payment Processing)

**What it does**: Securely processes credit card payments.

**Key features**:

- PCI-compliant (handles card data securely)
- Supports multiple payment methods (cards, Apple Pay, etc.)
- Automatic fraud detection
- Real-time payment notifications

**Dashboard**: https://dashboard.stripe.com

**Test Mode vs Live Mode**:

- **Test Mode**: Use card `4242 4242 4242 4242` for testing (no real charges)
- **Live Mode**: Real customer payments (requires switching API keys)

---

### 4. Cloudflare R2 (Image Storage)

**What it does**: Stores and delivers product images globally.

**Key features**:

- Fast image loading worldwide
- Unlimited storage
- Automatic image optimization

**Note**: Images are managed through the FAXAS Ecom Solutions Admin panel, not directly in R2.

---

## Admin Panel Guide

### Accessing the Admin Panel

1. Go to: https://vendure-server-production-75fc.up.railway.app/admin
2. Enter your credentials (provided separately by your admin)
3. You'll see the main dashboard

### Admin Panel Layout

```
┌─────────────────────────────────────────────────────┐
│  FAXAS ECOM SOLUTIONS                   [User Menu] │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ CATALOG  │         MAIN CONTENT AREA                │
│ Products │                                          │
│ Facets   │    (Changes based on what you click)     │
│ Assets   │                                          │
│          │                                          │
│ SALES    │                                          │
│ Orders   │                                          │
│ Customers│                                          │
│          │                                          │
│ SETTINGS │                                          │
│ Channels │                                          │
│ Shipping │                                          │
│ Payment  │                                          │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

---

## Managing Products

### Viewing Products

1. Click **Catalog** → **Products** in the left sidebar
2. You'll see a list of all products
3. Click any product to view/edit details

### Editing Product Information

1. Open the product you want to edit
2. You can change:
   - **Name**: The product title
   - **Description**: Detailed product info
   - **Price**: Set in the Variants section
   - **Stock**: How many units available

3. Click **Save** when done

### Managing Product Images

1. Open the product
2. Scroll to the **Assets** section
3. To add images:
   - Click **Add Assets**
   - Drag and drop images or click to browse
   - Select which image is the **Featured Asset** (main image)
4. Click **Save**

### Understanding Variants

A variant is a specific version of a product. For example:

- TOOLY - DLC Gunmetal (the current variant)

Each variant has its own:

- SKU (stock keeping unit)
- Price
- Stock level
- Images (optional)

---

## Managing Content

### What Can Be Edited in Admin

All storefront text can be edited without touching code! Go to:

**Settings → Channels → tooly → Storefront tab**

### Editable Content Areas

| Section          | What You Can Edit                                |
| ---------------- | ------------------------------------------------ |
| **Hero**         | Badge text, headline, subheadline, button labels |
| **Trust Badges** | 4 trust indicators (titles + subtitles)          |
| **Features**     | 6 feature cards (titles + descriptions)          |
| **Gallery**      | Section heading and subheading                   |
| **Shop Widget**  | Shipping text, delivery estimate, stock labels   |
| **FAQ**          | Up to 6 questions and answers                    |
| **Footer**       | Disclaimer text                                  |

### How to Edit Content

1. Go to **Settings** → **Channels**
2. Click on **tooly**
3. Click the **Storefront** tab
4. Edit any text field
5. Click **Save**
6. Changes appear on the website within 1-2 minutes

### Setting the Hero Background Image

1. Go to **Settings** → **Channels** → **tooly**
2. Find **Hero Background Image**
3. Click to upload or select an existing image
4. Click **Save**

### Setting the Gallery Images

1. Go to **Settings** → **Channels** → **tooly**
2. Find the **Marketing** tab
3. Upload up to 6 images for the gallery
4. Click **Save**

---

## Processing Orders

### Viewing Orders

1. Click **Sales** → **Orders** in the left sidebar
2. You'll see all orders sorted by date (newest first)

### Order Statuses

| Status               | Meaning                           |
| -------------------- | --------------------------------- |
| **Adding Items**     | Customer is still shopping (cart) |
| **ArrangingPayment** | Customer at checkout              |
| **PaymentSettled**   | Payment received successfully     |
| **Shipped**          | Order has been shipped            |
| **Delivered**        | Order delivered to customer       |
| **Cancelled**        | Order was cancelled               |

### Fulfilling an Order

1. Click on the order to open it
2. Review the items and shipping address
3. When ready to ship:
   - Click **Fulfill**
   - Enter tracking number (if available)
   - Select shipping carrier
   - Click **Confirm**
4. The customer will receive a notification

### Refunding an Order

1. Open the order
2. Click **Refund**
3. Select items to refund (or full order)
4. Add a reason for the refund
5. Click **Confirm**
6. Stripe will process the refund automatically

---

## Customer Storefront

### What Customers See

The storefront has these sections (top to bottom):

1. **Navigation Bar** - Logo, menu links, cart icon
2. **Hero Section** - Big headline with background image
3. **Credibility Section** - Stats and trust badges
4. **Technology Section** - 6 feature cards
5. **Gallery Section** - Product photos grid
6. **Product Section** - Main product with Add to Cart
7. **Accessories Section** - Related products (Coming Soon)
8. **Reviews Section** - Customer testimonials
9. **FAQ Section** - Common questions
10. **Footer** - Links and legal info

### Customer Checkout Flow

```
Add to Cart → View Cart → Checkout
                            │
                            ▼
                    ┌───────────────┐
                    │ 1. Address    │
                    │    Form       │
                    └───────┬───────┘
                            ▼
                    ┌───────────────┐
                    │ 2. Shipping   │
                    │    Method     │
                    └───────┬───────┘
                            ▼
                    ┌───────────────┐
                    │ 3. Payment    │
                    │    (Stripe)   │
                    └───────┬───────┘
                            ▼
                    ┌───────────────┐
                    │ 4. Order      │
                    │ Confirmation  │
                    └───────────────┘
```

---

## Common Tasks

### Task: Update Product Price

1. Admin Panel → **Catalog** → **Products**
2. Click on TOOLY
3. Scroll to **Variants**
4. Click on the variant (e.g., "DLC Gunmetal")
5. Change the **Price** field
6. Click **Save**

### Task: Update Stock Quantity

1. Admin Panel → **Catalog** → **Products**
2. Click on TOOLY
3. Scroll to **Variants**
4. Click on the variant
5. Change **Stock on hand**
6. Click **Save**

### Task: Change Shipping Price

1. Admin Panel → **Settings** → **Shipping methods**
2. Click on "Standard Shipping"
3. Edit the price in **Calculator** section
4. Click **Save**

### Task: Update Hero Text

1. Admin Panel → **Settings** → **Channels** → **tooly**
2. Click **Storefront** tab
3. Edit:
   - `storefrontHeroPill` - The small badge text
   - `storefrontHeroHeadlineLine1` - First line of headline
   - `storefrontHeroHeadlineAccent` - Colorful middle line
   - `storefrontHeroHeadlineLine3` - Third line
   - `storefrontHeroSubhead` - Paragraph below headline
4. Click **Save**

### Task: Add a New FAQ Question

1. Admin Panel → **Settings** → **Channels** → **tooly**
2. Click **Storefront** tab
3. Find the FAQ fields (storefrontFaq1Question, etc.)
4. Fill in both Question and Answer for an empty slot
5. Click **Save**

---

## Troubleshooting

### Problem: Changes not appearing on website

**Solution**:

- Wait 1-2 minutes (changes need to propagate)
- Hard refresh the page: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Clear browser cache

### Problem: Cannot log into Admin Panel

**Solution**:

- Check you're using the correct URL
- Verify credentials with your administrator
- Try a different browser
- Clear cookies and try again

### Problem: Product images not showing

**Solution**:

- Check images were uploaded in Admin → Products → [Product] → Assets
- Ensure one image is set as "Featured Asset"
- Wait a few minutes for images to propagate
- Check image file isn't corrupted (try opening it locally first)

### Problem: Customer says checkout failed

**Solution**:

1. Check Stripe Dashboard for the payment attempt
2. Look at the order in Admin Panel
3. Common causes:
   - Card declined by bank
   - Incorrect card details
   - Expired card
   - Insufficient funds

### Problem: Order stuck in "Adding Items"

**Solution**:

- This means the customer never completed checkout
- These are essentially abandoned carts
- No action needed - they'll expire automatically

---

## Glossary

| Term                     | Definition                                          |
| ------------------------ | --------------------------------------------------- |
| **Admin Panel**          | The backend interface for managing the store        |
| **Asset**                | An image or file uploaded to the system             |
| **Channel**              | A storefront configuration (we use "tooly")         |
| **Checkout**             | The process of completing a purchase                |
| **CMS**                  | Content Management System - where you edit text     |
| **Featured Asset**       | The main product image shown first                  |
| **Fulfill**              | Mark an order as shipped                            |
| **SKU**                  | Stock Keeping Unit - unique product identifier      |
| **Storefront**           | The customer-facing website                         |
| **Variant**              | A specific version of a product (color, size, etc.) |
| **FAXAS Ecom Solutions** | The e-commerce platform (admin panel) we use        |

---

## Need Help?

For technical issues or questions not covered in this manual, contact your system administrator.

---

_This manual covers the TOOLY store operations. Keep it handy for quick reference!_
