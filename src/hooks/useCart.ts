import { useState, useEffect, useCallback } from 'react';
import { Product, CartItem, PromoCode } from '../types';

const CART_STORAGE_KEY = 'autopilot_cart';
const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_COST = 15;

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  });
  
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // Add item to cart
  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setIsAddingToCart(product.id);
    
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });

    setTimeout(() => setIsAddingToCart(null), 400);
  }, []);

  // Update quantity
  const updateQuantity = useCallback((id: string, delta: number) => {
    setCart(prev => 
      prev
        .map(item => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item)
        .filter(item => item.quantity > 0)
    );
  }, []);

  // Set specific quantity
  const setQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.id !== id));
    } else {
      setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
    }
  }, []);

  // Remove item
  const removeFromCart = useCallback((id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);

  // Clear cart
  const clearCart = useCallback(() => {
    setCart([]);
    setAppliedPromo(null);
  }, []);

  // Apply promo code
  const applyPromoCode = useCallback((code: string): boolean => {
    const normalizedCode = code.toUpperCase().trim();
    
    // Valid promo codes
    const validCodes: Record<string, PromoCode> = {
      'AUTOPILOT15': { code: 'AUTOPILOT15', discount: 0.15, type: 'percentage' },
      'WELCOME10': { code: 'WELCOME10', discount: 0.10, type: 'percentage' },
      'PILOT20': { code: 'PILOT20', discount: 0.20, type: 'percentage' },
    };

    if (validCodes[normalizedCode]) {
      setAppliedPromo(validCodes[normalizedCode]);
      return true;
    }
    return false;
  }, []);

  // Remove promo code
  const removePromoCode = useCallback(() => {
    setAppliedPromo(null);
  }, []);

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : (cart.length > 0 ? SHIPPING_COST : 0);
  const discount = appliedPromo 
    ? appliedPromo.type === 'percentage' 
      ? subtotal * appliedPromo.discount 
      : appliedPromo.discount
    : 0;
  const total = subtotal + shipping - discount;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const freeShippingProgress = Math.min(subtotal / FREE_SHIPPING_THRESHOLD * 100, 100);
  const amountToFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  return {
    cart,
    addToCart,
    updateQuantity,
    setQuantity,
    removeFromCart,
    clearCart,
    applyPromoCode,
    removePromoCode,
    appliedPromo,
    subtotal,
    shipping,
    discount,
    total,
    itemCount,
    freeShippingProgress,
    amountToFreeShipping,
    isAddingToCart,
    FREE_SHIPPING_THRESHOLD,
  };
};

