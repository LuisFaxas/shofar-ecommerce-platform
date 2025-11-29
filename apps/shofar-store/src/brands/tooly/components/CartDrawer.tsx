/**
 * CartDrawer Component
 * Slide-out drawer for cart contents with accessibility
 * WO 3.1 Implementation
 *
 * Features:
 * - Slide-in animation from right
 * - Focus trap (Tab cycles within drawer)
 * - ESC key closes drawer
 * - Overlay click closes drawer
 * - aria-live region for cart updates
 * - Empty state with "Shop Now" CTA
 */

'use client';

import * as React from 'react';
import { useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import FocusTrap from 'focus-trap-react';
import { cn } from '@/lib/utils';
import { useCart, type OrderLine } from '@/contexts/CartContext';
import { ButtonPrimary } from './ui/ButtonPrimary';
import { ButtonSecondary } from './ui/ButtonSecondary';
import { QuantityStepper } from './ui/QuantityStepper';

// Format price from cents to currency string
function formatPrice(cents: number, currencyCode: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(cents / 100);
}

interface CartLineItemProps {
  line: OrderLine;
  currencyCode: string;
  onUpdateQuantity: (lineId: string, quantity: number) => void;
  onRemove: (lineId: string) => void;
  disabled?: boolean;
}

function CartLineItem({
  line,
  currencyCode,
  onUpdateQuantity,
  onRemove,
  disabled,
}: CartLineItemProps): React.ReactElement {
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity === 0) {
      onRemove(line.id);
    } else {
      onUpdateQuantity(line.id, newQuantity);
    }
  };

  return (
    <div className="flex gap-4 p-4 border-b border-white/[0.08] last:border-b-0">
      {/* Product Image */}
      <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-white/[0.08] overflow-hidden">
        {line.productVariant.featuredAsset?.preview ? (
          <Image
            src={line.productVariant.featuredAsset.preview}
            alt={line.productVariant.name}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/30">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-white truncate">
          {line.productVariant.name}
        </h4>
        <p className="text-xs text-white/60 mt-0.5">
          {formatPrice(line.productVariant.priceWithTax, currencyCode)} each
        </p>

        {/* Quantity & Actions */}
        <div className="flex items-center justify-between mt-2">
          <QuantityStepper
            value={line.quantity}
            onChange={handleQuantityChange}
            min={0}
            max={99}
            size="sm"
            disabled={disabled}
          />
          <button
            onClick={() => onRemove(line.id)}
            disabled={disabled}
            className={cn(
              'p-1.5 rounded-md text-white/50 hover:text-red-400',
              'hover:bg-red-400/10 transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            aria-label={`Remove ${line.productVariant.name} from cart`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Line Total */}
      <div className="text-sm font-medium text-white">
        {formatPrice(line.linePriceWithTax, currencyCode)}
      </div>
    </div>
  );
}

function EmptyCartState({ onShopNow }: { onShopNow: () => void }): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
      <div className="w-16 h-16 mb-4 rounded-full bg-white/[0.08] flex items-center justify-center">
        <svg
          className="w-8 h-8 text-white/40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-white mb-2">Your cart is empty</h3>
      <p className="text-sm text-white/60 mb-6">
        Add some premium tools to get started
      </p>
      <ButtonSecondary onClick={onShopNow} showArrow>
        Shop Now
      </ButtonSecondary>
    </div>
  );
}

export function CartDrawer(): React.ReactElement {
  const {
    order,
    loading,
    itemCount,
    subtotal,
    currencyCode,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
  } = useCart();

  const drawerRef = useRef<HTMLDivElement>(null);

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isDrawerOpen, closeDrawer]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  const handleOverlayClick = useCallback(() => {
    closeDrawer();
  }, [closeDrawer]);

  const handleShopNow = useCallback(() => {
    closeDrawer();
    // Smooth scroll to product section
    const productSection = document.getElementById('product');
    if (productSection) {
      productSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, [closeDrawer]);

  const handleCheckout = useCallback(() => {
    // For now, just log - checkout implementation in later phase
    console.log('Proceed to checkout with order:', order?.code);
  }, [order]);

  const hasItems = order && order.lines.length > 0;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        data-testid="cart-drawer-overlay"
        className={cn(
          'fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm',
          'transition-opacity duration-300',
          isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Drawer */}
      <FocusTrap active={isDrawerOpen}>
        <aside
          ref={drawerRef}
          data-testid="cart-drawer"
          className={cn(
            'fixed top-0 right-0 z-[70] h-full w-full max-w-md',
            'bg-[#0b0e14] border-l border-white/[0.08]',
            'shadow-[-8px_0_32px_rgba(0,0,0,0.5)]',
            'flex flex-col',
            'transform transition-transform duration-300 ease-out',
            isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Shopping cart"
          aria-hidden={!isDrawerOpen}
        >
          {/* Header */}
          <header className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
            <h2 className="text-lg font-semibold text-white">
              Your Cart
              {itemCount > 0 && (
                <span className="ml-2 text-sm font-normal text-white/60">
                  ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                </span>
              )}
            </h2>
            <button
              data-testid="cart-drawer-close"
              onClick={closeDrawer}
              className={cn(
                'p-2 rounded-lg text-white/60 hover:text-white',
                'hover:bg-white/[0.08] transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50'
              )}
              aria-label="Close cart"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </header>

          {/* Cart Contents */}
          <div className="flex-1 overflow-y-auto" aria-live="polite" aria-atomic="false">
            {!hasItems ? (
              <EmptyCartState onShopNow={handleShopNow} />
            ) : (
              <div className="divide-y divide-white/[0.08]">
                {order.lines.map((line) => (
                  <CartLineItem
                    key={line.id}
                    line={line}
                    currencyCode={currencyCode}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                    disabled={loading}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer - Subtotal & Checkout */}
          {hasItems && (
            <footer className="px-6 py-4 border-t border-white/[0.08] space-y-4">
              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Subtotal</span>
                <span className="text-lg font-semibold text-white">
                  {formatPrice(subtotal, currencyCode)}
                </span>
              </div>

              {/* Shipping notice */}
              <p className="text-xs text-white/50 text-center">
                Shipping & taxes calculated at checkout
              </p>

              {/* Checkout Button */}
              <ButtonPrimary
                fullWidth
                size="lg"
                onClick={handleCheckout}
                disabled={loading}
                loading={loading}
                data-testid="checkout-button"
              >
                Continue to Checkout
              </ButtonPrimary>

              {/* Continue Shopping */}
              <button
                onClick={closeDrawer}
                className={cn(
                  'w-full py-2 text-sm text-white/60 hover:text-white',
                  'transition-colors text-center',
                  'focus-visible:outline-none focus-visible:underline'
                )}
              >
                Continue Shopping
              </button>
            </footer>
          )}
        </aside>
      </FocusTrap>
    </>
  );
}

CartDrawer.displayName = 'CartDrawer';

export default CartDrawer;
