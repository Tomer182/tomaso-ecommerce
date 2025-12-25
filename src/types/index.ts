// Product Types
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  image: string;
  images?: string[];
  rating: number;
  reviews: number;
  stock: number;
  soldToday?: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  isSale?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

// Order Types
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  shipping: ShippingAddress;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentIntentId?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

// View State
export type ViewState = 
  | 'home' 
  | 'shop' 
  | 'product-detail' 
  | 'cart-page' 
  | 'checkout' 
  | 'success' 
  | 'wishlist-page' 
  | '404';

// AI Types
export interface AISearchResult {
  ids: string[];
  reason: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

// Promo Code
export interface PromoCode {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
}

