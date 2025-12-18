/**
 * Stripe Payment Form Component
 * Uses Stripe Payment Element for secure payment collection
 */

"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { ButtonPrimary } from "@/brands/tooly/components/ui/ButtonPrimary";

// Initialize Stripe (singleton)
let stripePromise: Promise<Stripe | null> | null = null;

function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      console.error("Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
}

// GraphQL helper (same as checkout page)
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

// Create Stripe Payment Intent mutation (from Vendure StripePlugin)
const CREATE_PAYMENT_INTENT_MUTATION = `
  mutation CreateStripePaymentIntent {
    createStripePaymentIntent
  }
`;

interface PaymentFormProps {
  onSuccess: () => void;
  onBack: () => void;
  disabled?: boolean;
}

// Inner form component that uses Stripe hooks
function PaymentForm({ onSuccess, onBack, disabled }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Confirm the payment with Stripe
      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout?step=confirmation`,
        },
        redirect: "if_required",
      });

      if (stripeError) {
        setError(stripeError.message || "Payment failed");
        return;
      }

      // Payment succeeded (or is processing)
      onSuccess();
    } catch (err) {
      console.error("Payment error:", err);
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Payment</h2>

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="stripe-element-container">
          <PaymentElement
            options={{
              layout: "tabs",
            }}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="flex-1 px-6 py-3 bg-white/[0.08] hover:bg-white/[0.12] text-white rounded-lg transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <ButtonPrimary
          type="submit"
          fullWidth
          size="lg"
          disabled={disabled || loading || !stripe || !elements}
          loading={loading}
        >
          Place Order
        </ButtonPrimary>
      </div>
    </form>
  );
}

interface StripePaymentFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

export function StripePaymentForm({
  onSuccess,
  onBack,
}: StripePaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);

  // Load Stripe and create payment intent
  useEffect(() => {
    async function setup() {
      try {
        setLoading(true);
        setError(null);

        // Load Stripe
        const stripe = await getStripe();
        if (!stripe) {
          throw new Error("Failed to load Stripe. Check your publishable key.");
        }
        setStripeInstance(stripe);

        // Create payment intent via Vendure
        const data = await graphqlRequest<{
          createStripePaymentIntent: string;
        }>(CREATE_PAYMENT_INTENT_MUTATION);

        if (!data.createStripePaymentIntent) {
          throw new Error("Failed to create payment intent");
        }

        setClientSecret(data.createStripePaymentIntent);
      } catch (err) {
        console.error("Stripe setup error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to initialize payment",
        );
      } finally {
        setLoading(false);
      }
    }

    setup();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Payment</h2>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white/60"></div>
            <span className="ml-3 text-white/60">Loading payment form...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Payment</h2>
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
          <p className="mt-4 text-white/60 text-sm">
            Please try again or contact support if the problem persists.
          </p>
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-6 py-3 bg-white/[0.08] hover:bg-white/[0.12] text-white rounded-lg transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  if (!clientSecret || !stripeInstance) {
    return null;
  }

  return (
    <Elements
      stripe={stripeInstance}
      options={{
        clientSecret,
        appearance: {
          theme: "night",
          variables: {
            colorPrimary: "#22d3ee",
            colorBackground: "#0b0e14",
            colorText: "#ffffff",
            colorDanger: "#ef4444",
            fontFamily: "system-ui, sans-serif",
            borderRadius: "8px",
          },
          rules: {
            ".Input": {
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            },
            ".Input:focus": {
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 0 0 2px rgba(34, 211, 238, 0.2)",
            },
            ".Label": {
              color: "rgba(255, 255, 255, 0.6)",
            },
          },
        },
      }}
    >
      <PaymentForm onSuccess={onSuccess} onBack={onBack} />
    </Elements>
  );
}

// Fallback for when Stripe is not configured (test mode)
export function TestPaymentForm({
  onSubmit,
  onBack,
  loading,
}: {
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  loading: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Payment</h2>
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-300 text-sm">
          <strong>Test Mode:</strong> This is a test checkout. No real payment
          will be processed. Click &quot;Place Order&quot; to complete your test
          order.
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="flex-1 px-6 py-3 bg-white/[0.08] hover:bg-white/[0.12] text-white rounded-lg transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <ButtonPrimary
          type="submit"
          fullWidth
          size="lg"
          disabled={loading}
          loading={loading}
        >
          Place Order
        </ButtonPrimary>
      </div>
    </form>
  );
}
