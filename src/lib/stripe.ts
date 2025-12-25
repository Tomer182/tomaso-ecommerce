import { loadStripe, Stripe } from '@stripe/stripe-js';

// Stripe publishable key (safe to expose in frontend)
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = () => {
  if (!stripePromise && stripePublishableKey) {
    stripePromise = loadStripe(stripePublishableKey);
  }
  return stripePromise;
};

// Payment intent creation (should be called from backend, but we simulate here)
export interface CreatePaymentIntentRequest {
  amount: number; // in cents
  currency?: string;
  metadata?: Record<string, string>;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

// Simulate payment intent creation (in production, call your backend)
export const createPaymentIntent = async (request: CreatePaymentIntentRequest): Promise<PaymentIntentResponse | null> => {
  const apiUrl = import.meta.env.VITE_API_URL;
  
  if (!apiUrl) {
    // Demo mode - simulate successful payment
    console.log('Demo mode: Simulating payment intent creation');
    return {
      clientSecret: 'demo_client_secret_' + Date.now(),
      paymentIntentId: 'demo_pi_' + Date.now()
    };
  }

  try {
    const response = await fetch(`${apiUrl}/api/create-payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) throw new Error('Payment intent creation failed');
    
    return await response.json();
  } catch (error) {
    console.error('Payment intent error:', error);
    return null;
  }
};

// Format price for Stripe (convert dollars to cents)
export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100);
};

// Format price from Stripe (convert cents to dollars)
export const formatAmountFromStripe = (amount: number): number => {
  return amount / 100;
};

