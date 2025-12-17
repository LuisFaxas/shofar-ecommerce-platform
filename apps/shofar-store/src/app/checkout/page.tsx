/**
 * Checkout Page
 * Minimal checkout flow for TOOLY presale
 * MILESTONE 4 Implementation
 */

"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input } from "@/brands/tooly/components/ui/Input";
import { ButtonPrimary } from "@/brands/tooly/components/ui/ButtonPrimary";
import { ButtonSecondary } from "@/brands/tooly/components/ui/ButtonSecondary";
import {
  StripePaymentForm,
  TestPaymentForm,
} from "@/components/StripePaymentForm";

// Check if Stripe is configured
const STRIPE_ENABLED = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// Types
interface OrderLine {
  id: string;
  quantity: number;
  linePriceWithTax: number;
  productVariant: {
    id: string;
    name: string;
    sku: string;
    priceWithTax: number;
  };
}

interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  priceWithTax: number;
}

interface ActiveOrder {
  id: string;
  code: string;
  state: string;
  totalWithTax: number;
  subTotalWithTax: number;
  shippingWithTax: number;
  currencyCode: string;
  lines: OrderLine[];
  shippingAddress?: {
    fullName: string;
    streetLine1: string;
    streetLine2?: string;
    city: string;
    province?: string;
    postalCode: string;
    countryCode: string;
  };
  shippingLines: Array<{
    shippingMethod: { id: string; name: string };
    priceWithTax: number;
  }>;
  customer?: {
    firstName: string;
    lastName: string;
    emailAddress: string;
  };
}

// GraphQL helper
async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const response = await fetch("/api/shop", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  if (result.errors?.length > 0) {
    throw new Error(result.errors[0].message);
  }

  return result.data;
}

// Format price from cents
function formatPrice(cents: number, currencyCode: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(cents / 100);
}

// GraphQL Queries/Mutations
const ACTIVE_ORDER_QUERY = `
  query ActiveOrder {
    activeOrder {
      id
      code
      state
      totalWithTax
      subTotalWithTax
      shippingWithTax
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
        }
      }
      shippingAddress {
        fullName
        streetLine1
        streetLine2
        city
        province
        postalCode
        countryCode
      }
      shippingLines {
        shippingMethod { id name }
        priceWithTax
      }
      customer {
        firstName
        lastName
        emailAddress
      }
    }
  }
`;

const ELIGIBLE_SHIPPING_QUERY = `
  query EligibleShipping {
    eligibleShippingMethods {
      id
      name
      price
      priceWithTax
    }
  }
`;

const SET_CUSTOMER_MUTATION = `
  mutation SetCustomer($input: CreateCustomerInput!) {
    setCustomerForOrder(input: $input) {
      ... on Order { id customer { firstName lastName emailAddress } }
      ... on ErrorResult { errorCode message }
    }
  }
`;

const SET_SHIPPING_ADDRESS_MUTATION = `
  mutation SetShippingAddress($input: CreateAddressInput!) {
    setOrderShippingAddress(input: $input) {
      ... on Order {
        id
        shippingAddress { fullName streetLine1 city postalCode countryCode }
      }
      ... on ErrorResult { errorCode message }
    }
  }
`;

const SET_SHIPPING_METHOD_MUTATION = `
  mutation SetShippingMethod($id: [ID!]!) {
    setOrderShippingMethod(shippingMethodId: $id) {
      ... on Order {
        id
        shippingLines { shippingMethod { id name } priceWithTax }
        totalWithTax
        shippingWithTax
      }
      ... on ErrorResult { errorCode message }
    }
  }
`;

const TRANSITION_ORDER_MUTATION = `
  mutation TransitionOrder($state: String!) {
    transitionOrderToState(state: $state) {
      ... on Order { id state }
      ... on OrderStateTransitionError { transitionError message }
    }
  }
`;

const ADD_PAYMENT_MUTATION = `
  mutation AddPayment($input: PaymentInput!) {
    addPaymentToOrder(input: $input) {
      ... on Order {
        id
        code
        state
        totalWithTax
        payments { id state amount method }
      }
      ... on ErrorResult { errorCode message }
    }
  }
`;

type CheckoutStep = "address" | "shipping" | "payment" | "confirmation";

export default function CheckoutPage() {
  const router = useRouter();
  const [order, setOrder] = useState<ActiveOrder | null>(null);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<CheckoutStep>("address");

  // Form state
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [streetLine1, setStreetLine1] = useState("");
  const [streetLine2, setStreetLine2] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [selectedShippingId, setSelectedShippingId] = useState<string>("");

  // Fetch order on mount
  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true);
        const data = await graphqlRequest<{ activeOrder: ActiveOrder | null }>(
          ACTIVE_ORDER_QUERY,
        );

        if (!data.activeOrder || data.activeOrder.lines.length === 0) {
          router.push("/");
          return;
        }

        setOrder(data.activeOrder);

        // Pre-fill form if data exists
        if (data.activeOrder.customer) {
          setEmail(data.activeOrder.customer.emailAddress || "");
          setFirstName(data.activeOrder.customer.firstName || "");
          setLastName(data.activeOrder.customer.lastName || "");
        }
        if (data.activeOrder.shippingAddress) {
          const addr = data.activeOrder.shippingAddress;
          setStreetLine1(addr.streetLine1 || "");
          setStreetLine2(addr.streetLine2 || "");
          setCity(addr.city || "");
          setProvince(addr.province || "");
          setPostalCode(addr.postalCode || "");
        }
      } catch (err) {
        console.error("Failed to load order:", err);
        setError("Failed to load your order. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [router]);

  // Handle address step submission
  const handleAddressSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      setError(null);

      try {
        // Set customer info
        const customerResult = await graphqlRequest<{
          setCustomerForOrder:
            | ActiveOrder
            | { errorCode: string; message: string };
        }>(SET_CUSTOMER_MUTATION, {
          input: { firstName, lastName, emailAddress: email },
        });

        if ("errorCode" in customerResult.setCustomerForOrder) {
          throw new Error(customerResult.setCustomerForOrder.message);
        }

        // Set shipping address
        const addressResult = await graphqlRequest<{
          setOrderShippingAddress:
            | ActiveOrder
            | { errorCode: string; message: string };
        }>(SET_SHIPPING_ADDRESS_MUTATION, {
          input: {
            fullName: `${firstName} ${lastName}`,
            streetLine1,
            streetLine2: streetLine2 || undefined,
            city,
            province: province || undefined,
            postalCode,
            countryCode: "US",
          },
        });

        if ("errorCode" in addressResult.setOrderShippingAddress) {
          throw new Error(addressResult.setOrderShippingAddress.message);
        }

        // Fetch eligible shipping methods
        const shippingData = await graphqlRequest<{
          eligibleShippingMethods: ShippingMethod[];
        }>(ELIGIBLE_SHIPPING_QUERY);

        setShippingMethods(shippingData.eligibleShippingMethods);
        if (shippingData.eligibleShippingMethods.length > 0) {
          setSelectedShippingId(shippingData.eligibleShippingMethods[0].id);
        }

        setStep("shipping");
      } catch (err) {
        console.error("Address error:", err);
        setError(err instanceof Error ? err.message : "Failed to save address");
      } finally {
        setSubmitting(false);
      }
    },
    [
      email,
      firstName,
      lastName,
      streetLine1,
      streetLine2,
      city,
      province,
      postalCode,
    ],
  );

  // Handle shipping step submission
  const handleShippingSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      setError(null);

      try {
        const result = await graphqlRequest<{
          setOrderShippingMethod:
            | ActiveOrder
            | { errorCode: string; message: string };
        }>(SET_SHIPPING_METHOD_MUTATION, {
          id: [selectedShippingId],
        });

        if ("errorCode" in result.setOrderShippingMethod) {
          throw new Error(result.setOrderShippingMethod.message);
        }

        setOrder(result.setOrderShippingMethod as ActiveOrder);
        setStep("payment");
      } catch (err) {
        console.error("Shipping error:", err);
        setError(err instanceof Error ? err.message : "Failed to set shipping");
      } finally {
        setSubmitting(false);
      }
    },
    [selectedShippingId],
  );

  // Handle payment submission (dummy payment)
  const handlePaymentSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Transition to ArrangingPayment
      const transitionResult = await graphqlRequest<{
        transitionOrderToState:
          | ActiveOrder
          | { transitionError: string; message: string };
      }>(TRANSITION_ORDER_MUTATION, { state: "ArrangingPayment" });

      if ("transitionError" in transitionResult.transitionOrderToState) {
        throw new Error(transitionResult.transitionOrderToState.message);
      }

      // Add dummy payment
      const paymentResult = await graphqlRequest<{
        addPaymentToOrder: ActiveOrder | { errorCode: string; message: string };
      }>(ADD_PAYMENT_MUTATION, {
        input: { method: "test-payment", metadata: {} },
      });

      if ("errorCode" in paymentResult.addPaymentToOrder) {
        throw new Error(paymentResult.addPaymentToOrder.message);
      }

      setOrder(paymentResult.addPaymentToOrder as ActiveOrder);
      setStep("confirmation");
    } catch (err) {
      console.error("Payment error:", err);
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setSubmitting(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
        <div className="text-white">Loading checkout...</div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  // Step indicator
  const steps = [
    { key: "address", label: "Address" },
    { key: "shipping", label: "Shipping" },
    { key: "payment", label: "Payment" },
    { key: "confirmation", label: "Complete" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="min-h-screen bg-[#0b0e14]">
      {/* Header */}
      <header className="border-b border-white/[0.08] bg-[#0b0e14]/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="text-white/60 hover:text-white transition-colors flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Store
          </button>
          <h1 className="text-lg font-semibold text-white">Checkout</h1>
          <div className="w-24" /> {/* Spacer */}
        </div>
      </header>

      {/* Step Indicator */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-2">
          {steps.map((s, i) => (
            <React.Fragment key={s.key}>
              <div
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm",
                  i <= currentStepIndex
                    ? "bg-white/10 text-white"
                    : "text-white/40",
                )}
              >
                <span
                  className={cn(
                    "w-5 h-5 rounded-full text-xs flex items-center justify-center",
                    i < currentStepIndex
                      ? "bg-green-500 text-white"
                      : i === currentStepIndex
                        ? "bg-white text-[#0b0e14]"
                        : "bg-white/20 text-white/60",
                  )}
                >
                  {i < currentStepIndex ? "✓" : i + 1}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "w-8 h-px",
                    i < currentStepIndex ? "bg-green-500" : "bg-white/20",
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-3">
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Address Step */}
            {step === "address" && (
              <form onSubmit={handleAddressSubmit} className="space-y-6">
                <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">
                    Contact Information
                  </h2>
                  <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    fullWidth
                    autoComplete="email"
                  />
                </div>

                <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">
                    Shipping Address
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        fullWidth
                        autoComplete="given-name"
                      />
                      <Input
                        label="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        fullWidth
                        autoComplete="family-name"
                      />
                    </div>
                    <Input
                      label="Street Address"
                      value={streetLine1}
                      onChange={(e) => setStreetLine1(e.target.value)}
                      required
                      fullWidth
                      autoComplete="address-line1"
                    />
                    <Input
                      label="Apartment, suite, etc. (optional)"
                      value={streetLine2}
                      onChange={(e) => setStreetLine2(e.target.value)}
                      fullWidth
                      autoComplete="address-line2"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        fullWidth
                        autoComplete="address-level2"
                      />
                      <Input
                        label="State"
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        fullWidth
                        autoComplete="address-level1"
                      />
                    </div>
                    <Input
                      label="ZIP Code"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      required
                      fullWidth
                      autoComplete="postal-code"
                    />
                  </div>
                </div>

                <ButtonPrimary
                  type="submit"
                  fullWidth
                  size="lg"
                  disabled={submitting}
                  loading={submitting}
                >
                  Continue to Shipping
                </ButtonPrimary>
              </form>
            )}

            {/* Shipping Step */}
            {step === "shipping" && (
              <form onSubmit={handleShippingSubmit} className="space-y-6">
                <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">
                    Shipping Method
                  </h2>
                  <div className="space-y-3">
                    {shippingMethods.map((method) => (
                      <label
                        key={method.id}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors",
                          selectedShippingId === method.id
                            ? "bg-white/[0.08] border-white/30"
                            : "border-white/[0.08] hover:border-white/20",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            value={method.id}
                            checked={selectedShippingId === method.id}
                            onChange={(e) =>
                              setSelectedShippingId(e.target.value)
                            }
                            className="w-4 h-4 accent-white"
                          />
                          <span className="text-white">{method.name}</span>
                        </div>
                        <span className="text-white font-medium">
                          {formatPrice(method.priceWithTax, order.currencyCode)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <ButtonSecondary
                    type="button"
                    onClick={() => setStep("address")}
                    fullWidth
                  >
                    Back
                  </ButtonSecondary>
                  <ButtonPrimary
                    type="submit"
                    fullWidth
                    size="lg"
                    disabled={submitting || !selectedShippingId}
                    loading={submitting}
                  >
                    Continue to Payment
                  </ButtonPrimary>
                </div>
              </form>
            )}

            {/* Payment Step */}
            {step === "payment" && (
              <>
                {STRIPE_ENABLED ? (
                  <StripePaymentForm
                    onSuccess={() => {
                      // Refresh order state and move to confirmation
                      graphqlRequest<{ activeOrder: ActiveOrder | null }>(
                        ACTIVE_ORDER_QUERY,
                      ).then((data) => {
                        if (data.activeOrder) {
                          setOrder(data.activeOrder);
                        }
                        setStep("confirmation");
                      });
                    }}
                    onBack={() => setStep("shipping")}
                  />
                ) : (
                  <TestPaymentForm
                    onSubmit={handlePaymentSubmit}
                    onBack={() => setStep("shipping")}
                    loading={submitting}
                  />
                )}
              </>
            )}

            {/* Confirmation Step */}
            {step === "confirmation" && (
              <div className="space-y-6">
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Order Confirmed!
                  </h2>
                  <p className="text-green-300 mb-4">
                    Thank you for your order. Your order number is:
                  </p>
                  <p className="text-xl font-mono text-white bg-white/10 inline-block px-4 py-2 rounded-lg">
                    {order.code}
                  </p>
                </div>

                <ButtonPrimary
                  onClick={() => router.push("/")}
                  fullWidth
                  size="lg"
                >
                  Continue Shopping
                </ButtonPrimary>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Order Summary
              </h2>

              {/* Line Items */}
              <div className="space-y-3 mb-4">
                {order.lines.map((line) => (
                  <div
                    key={line.id}
                    className="flex items-start justify-between gap-4"
                  >
                    <div className="flex-1">
                      <p className="text-sm text-white">
                        {line.productVariant.name}
                      </p>
                      <p className="text-xs text-white/50">
                        Qty: {line.quantity}
                      </p>
                    </div>
                    <p className="text-sm text-white">
                      {formatPrice(line.linePriceWithTax, order.currencyCode)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/[0.08] pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Subtotal</span>
                  <span className="text-white">
                    {formatPrice(order.subTotalWithTax, order.currencyCode)}
                  </span>
                </div>
                {order.shippingWithTax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Shipping</span>
                    <span className="text-white">
                      {formatPrice(order.shippingWithTax, order.currencyCode)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold pt-2 border-t border-white/[0.08]">
                  <span className="text-white">Total</span>
                  <span className="text-white">
                    {formatPrice(order.totalWithTax, order.currencyCode)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
