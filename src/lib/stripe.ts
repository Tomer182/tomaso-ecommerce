import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';

// Stripe publishable key
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = () => {
  if (!stripePromise && stripePublishableKey) {
    stripePromise = loadStripe(stripePublishableKey);
  }
  return stripePromise;
};

export const isStripeConfigured = () => !!stripePublishableKey;

export interface CreatePaymentIntentRequest {
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  error?: string;
}

/**
 * Create a Payment Intent via our API
 * In production, this calls our Vercel serverless function
 */
export const createPaymentIntent = async (request: CreatePaymentIntentRequest): Promise<PaymentIntentResponse | null> => {
  // Use relative path for API route (works both locally and on Vercel)
  const apiUrl = '/api/create-payment-intent';
  
  // Demo mode fallback if API fails
  const demoFallback = () => ({
    clientSecret: 'demo_client_secret_' + Date.now(),
    paymentIntentId: 'demo_pi_' + Date.now()
  });

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      console.warn('Payment API not available, using demo mode');
      return demoFallback();
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data;
  } catch (error) {
    console.error('Payment intent error:', error);
    // Fallback to demo mode if API is not available
    console.warn('Falling back to demo mode');
    return demoFallback();
  }
};

/**
 * Confirm payment using Stripe Elements
 */
export const confirmCardPayment = async (
  clientSecret: string,
  cardElement: StripeCardElement,
  billingDetails: {
    name: string;
    email: string;
    phone?: string;
    address?: {
      line1: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  }
): Promise<{ success: boolean; error?: string; paymentIntentId?: string }> => {
  const stripe = await getStripe();
  
  if (!stripe) {
    return { success: false, error: 'Stripe not initialized' };
  }

  // If demo mode, simulate success
  if (clientSecret.startsWith('demo_')) {
    return { 
      success: true, 
      paymentIntentId: 'demo_pi_' + Date.now() 
    };
  }

  try {
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: billingDetails,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (paymentIntent?.status === 'succeeded') {
      return { success: true, paymentIntentId: paymentIntent.id };
    }

    return { success: false, error: 'Payment was not completed' };
  } catch (err) {
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Payment failed' 
    };
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

// Stripe Elements styling for Autopilot Commerce
export const stripeElementsOptions = {
  style: {
    base: {
      fontSize: '16px',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: '#0F172A',
      '::placeholder': {
        color: '#94A3B8',
      },
      iconColor: '#0F172A',
    },
    invalid: {
      color: '#DC2626',
      iconColor: '#DC2626',
    },
  },
};
