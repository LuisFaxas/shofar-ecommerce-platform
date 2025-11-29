/**
 * CartContext - Global cart state management with Vendure integration
 * WO 3.1 Implementation
 *
 * Features:
 * - Fetches activeOrder from Vendure on mount
 * - Wires cart mutations to Vendure
 * - Cookie-based session persistence
 * - Drawer state management
 * - PostHog analytics events
 */

'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';

// Types for Vendure activeOrder response
interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  priceWithTax: number;
  featuredAsset?: {
    preview: string;
  } | null;
}

interface OrderLine {
  id: string;
  quantity: number;
  linePriceWithTax: number;
  productVariant: ProductVariant;
}

interface ActiveOrder {
  id: string;
  code: string;
  state: string;
  totalWithTax: number;
  currencyCode: string;
  lines: OrderLine[];
}

// Error types from Vendure mutations
interface ErrorResult {
  errorCode: string;
  message: string;
}

interface CartContextValue {
  // State (from Vendure activeOrder)
  order: ActiveOrder | null;
  loading: boolean;
  error: Error | null;
  itemCount: number;
  subtotal: number;
  currencyCode: string;

  // Actions (connected to Vendure mutations)
  addToCart: (variantId: string, quantity: number) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;

  // Drawer state
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

// GraphQL operations
const ACTIVE_ORDER_QUERY = `
  query ActiveOrder {
    activeOrder {
      id
      code
      state
      totalWithTax
      currencyCode
      lines {
        id
        quantity
        linePriceWithTax
        productVariant {
          id
          name
          sku
          priceWithTax
          featuredAsset {
            preview
          }
        }
      }
    }
  }
`;

const ADD_ITEM_MUTATION = `
  mutation AddItemToOrder($variantId: ID!, $quantity: Int!) {
    addItemToOrder(productVariantId: $variantId, quantity: $quantity) {
      ... on Order {
        id
        code
        state
        totalWithTax
        currencyCode
        lines {
          id
          quantity
          linePriceWithTax
          productVariant {
            id
            name
            sku
            priceWithTax
            featuredAsset {
              preview
            }
          }
        }
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

const ADJUST_LINE_MUTATION = `
  mutation AdjustOrderLine($lineId: ID!, $quantity: Int!) {
    adjustOrderLine(orderLineId: $lineId, quantity: $quantity) {
      ... on Order {
        id
        code
        state
        totalWithTax
        currencyCode
        lines {
          id
          quantity
          linePriceWithTax
          productVariant {
            id
            name
            sku
            priceWithTax
            featuredAsset {
              preview
            }
          }
        }
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

const REMOVE_LINE_MUTATION = `
  mutation RemoveOrderLine($lineId: ID!) {
    removeOrderLine(orderLineId: $lineId) {
      ... on Order {
        id
        code
        state
        totalWithTax
        currencyCode
        lines {
          id
          quantity
          linePriceWithTax
          productVariant {
            id
            name
            sku
            priceWithTax
            featuredAsset {
              preview
            }
          }
        }
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

// Helper to make GraphQL requests to our proxy
async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const response = await fetch('/api/shop', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important for cookies
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (result.errors && result.errors.length > 0) {
    throw new Error(result.errors[0].message);
  }

  return result.data;
}

// Check if result is an error
function isErrorResult(result: unknown): result is ErrorResult {
  return (
    typeof result === 'object' &&
    result !== null &&
    'errorCode' in result &&
    'message' in result
  );
}

// PostHog event tracking (safely handles if PostHog isn't loaded)
function trackEvent(eventName: string, properties?: Record<string, unknown>): void {
  if (typeof window !== 'undefined' && 'posthog' in window) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).posthog?.capture(eventName, properties);
  }
}

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps): React.ReactElement {
  const [order, setOrder] = useState<ActiveOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Computed values
  const itemCount = useMemo(() => {
    if (!order) return 0;
    return order.lines.reduce((sum, line) => sum + line.quantity, 0);
  }, [order]);

  const subtotal = useMemo(() => {
    return order?.totalWithTax ?? 0;
  }, [order]);

  const currencyCode = useMemo(() => {
    return order?.currencyCode ?? 'USD';
  }, [order]);

  // Fetch active order on mount
  const refreshCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await graphqlRequest<{ activeOrder: ActiveOrder | null }>(
        ACTIVE_ORDER_QUERY
      );

      setOrder(data.activeOrder);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch cart'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // Add item to cart
  const addToCart = useCallback(
    async (variantId: string, quantity: number) => {
      try {
        setLoading(true);
        setError(null);

        const data = await graphqlRequest<{ addItemToOrder: ActiveOrder | ErrorResult }>(
          ADD_ITEM_MUTATION,
          { variantId, quantity }
        );

        if (isErrorResult(data.addItemToOrder)) {
          throw new Error(data.addItemToOrder.message);
        }

        setOrder(data.addItemToOrder);

        // Track analytics
        trackEvent('add_to_cart', {
          variant_id: variantId,
          quantity,
          order_id: data.addItemToOrder.id,
        });

        // Open drawer after adding
        setIsDrawerOpen(true);
      } catch (err) {
        console.error('Failed to add to cart:', err);
        setError(err instanceof Error ? err : new Error('Failed to add to cart'));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Update line quantity
  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      try {
        setLoading(true);
        setError(null);

        const data = await graphqlRequest<{ adjustOrderLine: ActiveOrder | ErrorResult }>(
          ADJUST_LINE_MUTATION,
          { lineId, quantity }
        );

        if (isErrorResult(data.adjustOrderLine)) {
          throw new Error(data.adjustOrderLine.message);
        }

        setOrder(data.adjustOrderLine);
      } catch (err) {
        console.error('Failed to update quantity:', err);
        setError(err instanceof Error ? err : new Error('Failed to update quantity'));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Remove item from cart
  const removeItem = useCallback(
    async (lineId: string) => {
      try {
        setLoading(true);
        setError(null);

        // Find the line to track removal
        const lineToRemove = order?.lines.find((l) => l.id === lineId);

        const data = await graphqlRequest<{ removeOrderLine: ActiveOrder | ErrorResult }>(
          REMOVE_LINE_MUTATION,
          { lineId }
        );

        if (isErrorResult(data.removeOrderLine)) {
          throw new Error(data.removeOrderLine.message);
        }

        setOrder(data.removeOrderLine);

        // Track analytics
        if (lineToRemove) {
          trackEvent('remove_from_cart', {
            variant_id: lineToRemove.productVariant.id,
            variant_name: lineToRemove.productVariant.name,
            quantity: lineToRemove.quantity,
          });
        }
      } catch (err) {
        console.error('Failed to remove item:', err);
        setError(err instanceof Error ? err : new Error('Failed to remove item'));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [order]
  );

  // Clear cart (remove all items)
  const clearCart = useCallback(async () => {
    if (!order) return;

    try {
      setLoading(true);
      setError(null);

      // Remove all lines one by one
      for (const line of order.lines) {
        await graphqlRequest<{ removeOrderLine: ActiveOrder | ErrorResult }>(
          REMOVE_LINE_MUTATION,
          { lineId: line.id }
        );
      }

      // Refresh to get final state
      await refreshCart();

      trackEvent('clear_cart');
    } catch (err) {
      console.error('Failed to clear cart:', err);
      setError(err instanceof Error ? err : new Error('Failed to clear cart'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [order, refreshCart]);

  // Drawer controls
  const openDrawer = useCallback(() => {
    setIsDrawerOpen(true);
    trackEvent('cart_opened');
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  const toggleDrawer = useCallback(() => {
    setIsDrawerOpen((prev) => {
      const newState = !prev;
      if (newState) {
        trackEvent('cart_opened');
      }
      return newState;
    });
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      order,
      loading,
      error,
      itemCount,
      subtotal,
      currencyCode,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      refreshCart,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      toggleDrawer,
    }),
    [
      order,
      loading,
      error,
      itemCount,
      subtotal,
      currencyCode,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      refreshCart,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      toggleDrawer,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// Export types for use in other components
export type { ActiveOrder, OrderLine, ProductVariant };
