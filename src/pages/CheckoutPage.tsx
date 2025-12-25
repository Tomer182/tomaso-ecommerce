import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Lock, 
  Truck, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Check,
  AlertCircle,
  Loader2,
  ChevronDown,
  Package
} from 'lucide-react';
import { CartItem, ShippingAddress, Order } from '../types';
import { createPaymentIntent, formatAmountForStripe } from '../lib/stripe';
import { createOrder } from '../lib/supabase';

interface CheckoutPageProps {
  cart: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  appliedPromo: { code: string; discount: number } | null;
  onBack: () => void;
  onSuccess: (order: Order) => void;
  clearCart: () => void;
}

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'AU', name: 'Australia' },
  { code: 'IL', name: 'Israel' },
];

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cart,
  subtotal,
  shipping,
  discount,
  total,
  appliedPromo,
  onBack,
  onSuccess,
  clearCart,
}) => {
  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [shippingData, setShippingData] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'applepay'>('card');
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });

  const [saveInfo, setSaveInfo] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateShipping = () => {
    const newErrors: Record<string, string> = {};
    
    if (!shippingData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!shippingData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!shippingData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingData.email)) newErrors.email = 'Invalid email format';
    if (!shippingData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!shippingData.address.trim()) newErrors.address = 'Address is required';
    if (!shippingData.city.trim()) newErrors.city = 'City is required';
    if (!shippingData.state.trim()) newErrors.state = 'State is required';
    if (!shippingData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const newErrors: Record<string, string> = {};
    
    if (paymentMethod === 'card') {
      if (!cardData.number.trim()) newErrors.cardNumber = 'Card number is required';
      if (!cardData.expiry.trim()) newErrors.cardExpiry = 'Expiry date is required';
      if (!cardData.cvc.trim()) newErrors.cardCvc = 'CVC is required';
      if (!cardData.name.trim()) newErrors.cardName = 'Name on card is required';
    }
    
    if (!acceptTerms) newErrors.terms = 'You must accept the terms';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateShipping()) {
      setStep('payment');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePayment()) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Create payment intent (simulated in demo mode)
      const paymentIntent = await createPaymentIntent({
        amount: formatAmountForStripe(total),
        currency: 'usd',
        metadata: {
          email: shippingData.email,
          itemCount: cart.length.toString(),
        },
      });

      if (!paymentIntent) {
        throw new Error('Payment processing failed');
      }

      // Create order
      const order: Order = {
        id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        shipping: shippingData,
        subtotal,
        shippingCost: shipping,
        discount,
        total,
        paymentMethod,
        paymentIntentId: paymentIntent.paymentIntentId,
        status: 'processing',
        createdAt: new Date().toISOString(),
      };

      // Try to save to Supabase (will fail gracefully if not connected)
      try {
        await createOrder({
          items: order.items,
          shipping_address: order.shipping,
          subtotal: order.subtotal,
          shipping_cost: order.shippingCost,
          discount: order.discount,
          total: order.total,
          payment_method: order.paymentMethod,
          payment_intent_id: order.paymentIntentId,
          status: order.status,
        });
      } catch (dbError) {
        console.log('Order saved locally (DB not connected)');
      }

      // Save order to localStorage for success page
      localStorage.setItem('autopilot_last_order', JSON.stringify(order));
      
      // Clear cart and redirect to success
      clearCart();
      onSuccess(order);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during checkout');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  // Progress indicator
  const steps = [
    { key: 'shipping', label: 'Shipping', icon: Truck },
    { key: 'payment', label: 'Payment', icon: CreditCard },
    { key: 'review', label: 'Review', icon: Check },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === step);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen bg-shop-bg pt-8 pb-32"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={onBack}
            className="p-3 bg-white border rounded-2xl shadow-sm hover:bg-shop-bg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tighter uppercase">
            Secure Checkout
          </h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {steps.map((s, i) => (
            <React.Fragment key={s.key}>
              <div 
                className={`flex items-center gap-2 ${
                  i <= currentStepIndex ? 'text-shop-primary' : 'text-shop-muted'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  i < currentStepIndex 
                    ? 'bg-shop-cta text-white' 
                    : i === currentStepIndex 
                      ? 'bg-shop-primary text-white' 
                      : 'bg-shop-border text-shop-muted'
                }`}>
                  {i < currentStepIndex ? <Check size={18} /> : <s.icon size={18} />}
                </div>
                <span className="hidden sm:block text-sm font-bold uppercase tracking-widest">
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-12 lg:w-24 h-0.5 ${
                  i < currentStepIndex ? 'bg-shop-cta' : 'bg-shop-border'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {/* Shipping Step */}
            {step === 'shipping' && (
              <motion.form 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleShippingSubmit}
                className="bg-white rounded-3xl p-8 shadow-sm border border-shop-border"
              >
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <Truck className="text-shop-accent" size={24} />
                  Shipping Information
                </h2>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-shop-muted mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={shippingData.firstName}
                      onChange={(e) => setShippingData({ ...shippingData, firstName: e.target.value })}
                      className={`w-full bg-shop-bg border rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-shop-accent/20 focus:border-shop-accent transition-all ${
                        errors.firstName ? 'border-shop-sale' : 'border-shop-border'
                      }`}
                      placeholder="John"
                    />
                    {errors.firstName && <p className="text-shop-sale text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-shop-muted mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={shippingData.lastName}
                      onChange={(e) => setShippingData({ ...shippingData, lastName: e.target.value })}
                      className={`w-full bg-shop-bg border rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-shop-accent/20 focus:border-shop-accent transition-all ${
                        errors.lastName ? 'border-shop-sale' : 'border-shop-border'
                      }`}
                      placeholder="Doe"
                    />
                    {errors.lastName && <p className="text-shop-sale text-xs mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-shop-muted mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={shippingData.email}
                      onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                      className={`w-full bg-shop-bg border rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-shop-accent/20 focus:border-shop-accent transition-all ${
                        errors.email ? 'border-shop-sale' : 'border-shop-border'
                      }`}
                      placeholder="pilot@mission.com"
                    />
                    {errors.email && <p className="text-shop-sale text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-shop-muted mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={shippingData.phone}
                      onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                      className={`w-full bg-shop-bg border rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-shop-accent/20 focus:border-shop-accent transition-all ${
                        errors.phone ? 'border-shop-sale' : 'border-shop-border'
                      }`}
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors.phone && <p className="text-shop-sale text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-bold uppercase tracking-widest text-shop-muted mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={shippingData.address}
                    onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                    className={`w-full bg-shop-bg border rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-shop-accent/20 focus:border-shop-accent transition-all ${
                      errors.address ? 'border-shop-sale' : 'border-shop-border'
                    }`}
                    placeholder="123 Innovation Street"
                  />
                  {errors.address && <p className="text-shop-sale text-xs mt-1">{errors.address}</p>}
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-bold uppercase tracking-widest text-shop-muted mb-2">
                    Apartment, suite, etc. (optional)
                  </label>
                  <input
                    type="text"
                    value={shippingData.apartment}
                    onChange={(e) => setShippingData({ ...shippingData, apartment: e.target.value })}
                    className="w-full bg-shop-bg border border-shop-border rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-shop-accent/20 focus:border-shop-accent transition-all"
                    placeholder="Apt 4B"
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-shop-muted mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={shippingData.city}
                      onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                      className={`w-full bg-shop-bg border rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-shop-accent/20 focus:border-shop-accent transition-all ${
                        errors.city ? 'border-shop-sale' : 'border-shop-border'
                      }`}
                      placeholder="San Francisco"
                    />
                    {errors.city && <p className="text-shop-sale text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-shop-muted mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      value={shippingData.state}
                      onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                      className={`w-full bg-shop-bg border rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-shop-accent/20 focus:border-shop-accent transition-all ${
                        errors.state ? 'border-shop-sale' : 'border-shop-border'
                      }`}
                      placeholder="CA"
                    />
                    {errors.state && <p className="text-shop-sale text-xs mt-1">{errors.state}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-shop-muted mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      value={shippingData.zipCode}
                      onChange={(e) => setShippingData({ ...shippingData, zipCode: e.target.value })}
                      className={`w-full bg-shop-bg border rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-shop-accent/20 focus:border-shop-accent transition-all ${
                        errors.zipCode ? 'border-shop-sale' : 'border-shop-border'
                      }`}
                      placeholder="94102"
                    />
                    {errors.zipCode && <p className="text-shop-sale text-xs mt-1">{errors.zipCode}</p>}
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-xs font-bold uppercase tracking-widest text-shop-muted mb-2">
                    Country *
                  </label>
                  <div className="relative">
                    <select
                      value={shippingData.country}
                      onChange={(e) => setShippingData({ ...shippingData, country: e.target.value })}
                      className="w-full bg-shop-bg border border-shop-border rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-shop-accent/20 focus:border-shop-accent transition-all appearance-none"
                    >
                      {COUNTRIES.map(c => (
                        <option key={c.code} value={c.code}>{c.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-shop-muted pointer-events-none" size={20} />
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer mb-8">
                  <input
                    type="checkbox"
                    checked={saveInfo}
                    onChange={(e) => setSaveInfo(e.target.checked)}
                    className="w-5 h-5 rounded border-shop-border text-shop-accent focus:ring-shop-accent"
                  />
                  <span className="text-sm font-medium">Save this information for next time</span>
                </label>

                <button
                  type="submit"
                  className="w-full btn-cta py-5 text-lg font-bold uppercase tracking-widest flex items-center justify-center gap-3"
                >
                  Continue to Payment <CreditCard size={20} />
                </button>
              </motion.form>
            )}

            {/* Payment Step */}
            {step === 'payment' && (
              <motion.form 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handlePaymentSubmit}
                className="bg-white rounded-3xl p-8 shadow-sm border border-shop-border"
              >
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <CreditCard className="text-shop-accent" size={24} />
                  Payment Method
                </h2>

                {/* Express Checkout */}
                <div className="mb-8">
                  <p className="text-xs font-bold uppercase tracking-widest text-shop-muted mb-4">Express Checkout</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('applepay')}
                      className={`flex items-center justify-center gap-2 py-4 rounded-xl border-2 font-bold transition-all ${
                        paymentMethod === 'applepay' 
                          ? 'border-shop-primary bg-shop-primary text-white' 
                          : 'border-shop-border bg-white hover:border-shop-primary'
                      }`}
                    >
                      <Smartphone size={20} /> Apple Pay
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paypal')}
                      className={`flex items-center justify-center gap-2 py-4 rounded-xl border-2 font-bold transition-all ${
                        paymentMethod === 'paypal' 
                          ? 'border-shop-accent bg-shop-accent text-white' 
                          : 'border-shop-border bg-white hover:border-shop-accent'
                      }`}
                    >
                      PayPal
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 my-8">
                  <div className="flex-1 h-px bg-shop-border" />
                  <span className="text-xs font-bold uppercase tracking-widest text-shop-muted">Or pay with card</span>
                  <div className="flex-1 h-px bg-shop-border" />
                </div>

                {/* Card Payment */}
                <div 
                  className={`border-2 rounded-2xl p-6 mb-6 transition-all cursor-pointer ${
                    paymentMethod === 'card' ? 'border-shop-primary bg-shop-bg/50' : 'border-shop-border'
                  }`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'card' ? 'border-shop-primary' : 'border-shop-muted'
                    }`}>
                      {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-shop-primary" />}
                    </div>
                    <span className="font-bold">Credit / Debit Card</span>
                    <div className="ml-auto flex gap-2 opacity-50">
                      <CreditCard size={24} />
                    </div>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="space-y-4 mt-6">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-shop-muted mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardData.number}
                          onChange={(e) => setCardData({ ...cardData, number: formatCardNumber(e.target.value) })}
                          maxLength={19}
                          className={`w-full bg-white border rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-shop-accent/20 focus:border-shop-accent transition-all font-mono ${
                            errors.cardNumber ? 'border-shop-sale' : 'border-shop-border'
                          }`}
                          placeholder="4242 4242 4242 4242"
                        />
                        {errors.cardNumber && <p className="text-shop-sale text-xs mt-1">{errors.cardNumber}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-shop-muted mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            value={cardData.expiry}
                            onChange={(e) => setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })}
                            maxLength={5}
                            className={`w-full bg-white border rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-shop-accent/20 focus:border-shop-accent transition-all font-mono ${
                              errors.cardExpiry ? 'border-shop-sale' : 'border-shop-border'
                            }`}
                            placeholder="MM/YY"
                          />
                          {errors.cardExpiry && <p className="text-shop-sale text-xs mt-1">{errors.cardExpiry}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-shop-muted mb-2">
                            CVC
                          </label>
                          <input
                            type="text"
                            value={cardData.cvc}
                            onChange={(e) => setCardData({ ...cardData, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                            maxLength={4}
                            className={`w-full bg-white border rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-shop-accent/20 focus:border-shop-accent transition-all font-mono ${
                              errors.cardCvc ? 'border-shop-sale' : 'border-shop-border'
                            }`}
                            placeholder="123"
                          />
                          {errors.cardCvc && <p className="text-shop-sale text-xs mt-1">{errors.cardCvc}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-shop-muted mb-2">
                          Name on Card
                        </label>
                        <input
                          type="text"
                          value={cardData.name}
                          onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                          className={`w-full bg-white border rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-shop-accent/20 focus:border-shop-accent transition-all ${
                            errors.cardName ? 'border-shop-sale' : 'border-shop-border'
                          }`}
                          placeholder="JOHN DOE"
                        />
                        {errors.cardName && <p className="text-shop-sale text-xs mt-1">{errors.cardName}</p>}
                      </div>
                    </div>
                  )}
                </div>

                {/* Terms */}
                <label className={`flex items-start gap-3 cursor-pointer mb-8 ${errors.terms ? 'text-shop-sale' : ''}`}>
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="w-5 h-5 mt-0.5 rounded border-shop-border text-shop-accent focus:ring-shop-accent"
                  />
                  <span className="text-sm">
                    I agree to the <button type="button" className="text-shop-accent underline">Terms of Service</button> and <button type="button" className="text-shop-accent underline">Privacy Policy</button>
                  </span>
                </label>
                {errors.terms && <p className="text-shop-sale text-xs -mt-6 mb-6">{errors.terms}</p>}

                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-3 p-4 bg-shop-sale/10 border border-shop-sale/30 rounded-xl mb-6 text-shop-sale">
                    <AlertCircle size={20} />
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep('shipping')}
                    className="px-8 py-5 border-2 border-shop-border rounded-xl font-bold uppercase tracking-widest hover:bg-shop-bg transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 btn-cta py-5 text-lg font-bold uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50"
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
                </div>

                {/* Security Badge */}
                <div className="mt-6 flex items-center justify-center gap-2 text-shop-muted text-xs">
                  <ShieldCheck size={16} />
                  <span>256-bit SSL encryption • Your data is secure</span>
                </div>
              </motion.form>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-3xl p-8 shadow-sm border border-shop-border">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Package size={20} className="text-shop-accent" />
                Order Summary
              </h3>

              {/* Items */}
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-xl"
                      />
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-shop-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{item.name}</p>
                      <p className="text-xs text-shop-muted">{item.category}</p>
                    </div>
                    <p className="font-mono font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-shop-border pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-shop-muted">Subtotal</span>
                  <span className="font-mono font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-shop-muted">Shipping</span>
                  <span className="font-mono font-bold">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-shop-cta">
                    <span>Discount ({appliedPromo?.code})</span>
                    <span className="font-mono font-bold">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-shop-border pt-4 mt-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xl font-bold uppercase">Total</span>
                    <span className="text-2xl font-mono font-bold text-shop-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t border-shop-border">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <ShieldCheck size={24} className="text-shop-cta" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-shop-muted">Secure</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Truck size={24} className="text-shop-accent" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-shop-muted">Free Ship $500+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

