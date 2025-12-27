import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Lock, Loader2, CreditCard, AlertCircle, ShieldCheck } from 'lucide-react';
import { createPaymentIntent, formatAmountForStripe, stripeElementsOptions, isStripeConfigured } from '../lib/stripe';

const stripePromise = isStripeConfigured() 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) 
  : null;

interface PaymentFormProps {
  total: number;
  billingDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const CardForm: React.FC<PaymentFormProps> = ({
  total,
  billingDetails,
  onSuccess,
  onError,
  isProcessing,
  setIsProcessing,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardName, setCardName] = useState('');
  const [cardError, setCardError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe not loaded yet, use demo mode
      console.log('Stripe not initialized, using demo mode');
      setIsProcessing(true);
      
      // Demo mode payment
      const result = await createPaymentIntent({
        amount: formatAmountForStripe(total),
        currency: 'usd',
      });

      if (result) {
        onSuccess(result.paymentIntentId);
      } else {
        onError('Payment failed');
      }
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);
    setCardError(null);

    try {
      // Create payment intent
      const paymentIntent = await createPaymentIntent({
        amount: formatAmountForStripe(total),
        currency: 'usd',
        metadata: {
          customerEmail: billingDetails.email,
        },
      });

      if (!paymentIntent) {
        throw new Error('Failed to create payment');
      }

      // If demo mode (client secret starts with demo_)
      if (paymentIntent.clientSecret.startsWith('demo_')) {
        onSuccess(paymentIntent.paymentIntentId);
        return;
      }

      // Confirm the payment with Stripe
      const cardNumber = elements.getElement(CardNumberElement);
      if (!cardNumber) {
        throw new Error('Card element not found');
      }

      const { error, paymentIntent: confirmedPayment } = await stripe.confirmCardPayment(
        paymentIntent.clientSecret,
        {
          payment_method: {
            card: cardNumber,
            billing_details: {
              name: cardName || billingDetails.name,
              email: billingDetails.email,
              phone: billingDetails.phone,
              address: {
                line1: billingDetails.address,
                city: billingDetails.city,
                state: billingDetails.state,
                postal_code: billingDetails.zipCode,
                country: billingDetails.country,
              },
            },
          },
        }
      );

      if (error) {
        setCardError(error.message || 'Payment failed');
        onError(error.message || 'Payment failed');
      } else if (confirmedPayment?.status === 'succeeded') {
        onSuccess(confirmedPayment.id);
      } else {
        throw new Error('Payment was not completed');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment failed';
      setCardError(message);
      onError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const elementOptions = {
    style: stripeElementsOptions.style,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Card Number */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-shop-muted mb-2">
          Card Number
        </label>
        <div className="relative">
          <div className="w-full bg-white border border-shop-border rounded-xl px-4 py-4 focus-within:ring-2 focus-within:ring-shop-accent/20 focus-within:border-shop-accent transition-all">
            <CardNumberElement options={elementOptions} />
          </div>
          <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 text-shop-muted" size={20} />
        </div>
      </div>

      {/* Expiry & CVC */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-shop-muted mb-2">
            Expiry Date
          </label>
          <div className="w-full bg-white border border-shop-border rounded-xl px-4 py-4 focus-within:ring-2 focus-within:ring-shop-accent/20 focus-within:border-shop-accent transition-all">
            <CardExpiryElement options={elementOptions} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-shop-muted mb-2">
            CVC
          </label>
          <div className="w-full bg-white border border-shop-border rounded-xl px-4 py-4 focus-within:ring-2 focus-within:ring-shop-accent/20 focus-within:border-shop-accent transition-all">
            <CardCvcElement options={elementOptions} />
          </div>
        </div>
      </div>

      {/* Cardholder Name */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-shop-muted mb-2">
          Name on Card
        </label>
        <input
          type="text"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          placeholder="JOHN DOE"
          className="w-full bg-white border border-shop-border rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-shop-accent/20 focus:border-shop-accent transition-all uppercase"
        />
      </div>

      {/* Error Display */}
      {cardError && (
        <div className="flex items-center gap-2 p-3 bg-shop-sale/10 border border-shop-sale/30 rounded-xl text-shop-sale text-sm">
          <AlertCircle size={18} />
          <span>{cardError}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isProcessing}
        className="w-full btn-cta py-5 text-lg font-bold uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Processing...
          </>
        ) : (
          <>
            <Lock size={20} />
            Complete Order • ${total.toFixed(2)}
          </>
        )}
      </button>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 text-shop-muted text-xs mt-4">
        <ShieldCheck size={16} />
        <span>Secured by Stripe • 256-bit SSL encryption</span>
      </div>
    </form>
  );
};

// Wrapper component with Stripe Elements provider
export const StripePaymentForm: React.FC<PaymentFormProps> = (props) => {
  // If Stripe is not configured, render demo mode form
  if (!stripePromise) {
    return <CardForm {...props} />;
  }

  return (
    <Elements stripe={stripePromise}>
      <CardForm {...props} />
    </Elements>
  );
};

export default StripePaymentForm;

