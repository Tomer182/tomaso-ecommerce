import { Product } from '../types';
import { getProducts as getSupabaseProducts, getCategories as getSupabaseCategories } from '../lib/supabase';

// Fallback products for when Supabase is unavailable
export const FALLBACK_PRODUCTS: Product[] = [
  { 
    id: 'tws-1', 
    name: 'TWS Pro Earbuds', 
    price: 35.00, 
    description: 'Crystal clear audio with seamless Bluetooth 5.3 connectivity. Touch controls, 30-hour battery life with case.', 
    category: 'Headphones & Audio', 
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800',
    rating: 4.6, 
    reviews: 234, 
    stock: 45, 
    isBestSeller: true 
  },
  { 
    id: 'anc-1', 
    name: 'ANC Noise Cancelling Buds', 
    price: 65.00, 
    originalPrice: 79.00,
    description: 'Block out the world with advanced Active Noise Cancellation. Perfect for commutes and focused work.', 
    category: 'Headphones & Audio', 
    image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&q=80&w=800',
    rating: 4.8, 
    reviews: 189, 
    stock: 28, 
    isBestSeller: true,
    isSale: true
  },
  { 
    id: 'charger-1', 
    name: '3-in-1 Charging Station', 
    price: 52.00, 
    originalPrice: 65.00,
    description: 'Charge your phone, watch, and earbuds simultaneously. MagSafe compatible, 15W fast charge.', 
    category: 'Chargers & Power Banks', 
    image: 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?auto=format&fit=crop&q=80&w=800',
    rating: 4.7, 
    reviews: 287, 
    stock: 1, 
    isBestSeller: true,
    isSale: true
  },
  { 
    id: 'gan-1', 
    name: 'GaN Charger 65W', 
    price: 39.00, 
    description: 'Compact GaN technology delivers 65W in a pocket-sized design. Charges laptops, phones, and tablets.', 
    category: 'Chargers & Power Banks', 
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=800',
    rating: 4.8, 
    reviews: 623, 
    stock: 48, 
    isBestSeller: true 
  },
  { 
    id: 'led-1', 
    name: 'LED Strip RGB 5M', 
    price: 25.00, 
    description: '16 million colors with app control. Music sync mode, timer function, and easy peel-and-stick installation.', 
    category: 'LED Lighting', 
    image: 'https://images.unsplash.com/photo-1558470598-a5dda9640f68?auto=format&fit=crop&q=80&w=800',
    rating: 4.5, 
    reviews: 1234, 
    stock: 156, 
    isBestSeller: true 
  },
  { 
    id: 'star-1', 
    name: 'Galaxy Star Projector', 
    price: 42.00, 
    originalPrice: 55.00,
    description: 'Project a stunning nebula and star field on your ceiling. Rotating clouds, adjustable brightness. TikTok famous!', 
    category: 'LED Lighting', 
    image: 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?auto=format&fit=crop&q=80&w=800',
    rating: 4.8, 
    reviews: 2156, 
    stock: 2, 
    isBestSeller: true,
    isSale: true
  },
  { 
    id: 'sunset-1', 
    name: 'Sunset Projection Lamp', 
    price: 32.00, 
    description: 'Create that golden hour glow anytime. 180° rotation, multiple color options. Perfect for photos.', 
    category: 'LED Lighting', 
    image: 'https://images.unsplash.com/photo-1614850715649-1d0106293bd1?auto=format&fit=crop&q=80&w=800',
    rating: 4.6, 
    reviews: 892, 
    stock: 47, 
    isBestSeller: true 
  },
  { 
    id: 'magsafe-1', 
    name: 'MagSafe Power Bank', 
    price: 52.00, 
    description: 'Magnetic wireless charging on-the-go. Snaps onto iPhone 12+ for cable-free power. Ultra-slim design.', 
    category: 'Chargers & Power Banks', 
    image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=800',
    rating: 4.7, 
    reviews: 334, 
    stock: 31, 
    isNew: true,
    isBestSeller: true 
  },
  { 
    id: 'massage-1', 
    name: 'Massage Gun Pro', 
    price: 95.00, 
    originalPrice: 129.00,
    description: 'Deep tissue percussion therapy with 30 speed levels. 6 interchangeable heads, ultra-quiet motor.', 
    category: 'Fitness & Health', 
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
    rating: 4.8, 
    reviews: 1234, 
    stock: 38, 
    isBestSeller: true,
    isSale: true
  },
  { 
    id: 'ring-1', 
    name: 'Ring Light 10 Inch', 
    price: 42.00, 
    description: 'Perfect lighting for video calls and content. 3 color modes, 10 brightness levels, phone holder included.', 
    category: 'LED Lighting', 
    image: 'https://images.unsplash.com/photo-1616763355603-9755a640a287?auto=format&fit=crop&q=80&w=800',
    rating: 4.6, 
    reviews: 1123, 
    stock: 78, 
    isBestSeller: true 
  },
  { 
    id: 'smart-1', 
    name: 'Smart Plug WiFi', 
    price: 18.00, 
    description: 'Control any device from your phone. Energy monitoring, schedules, and voice control with Alexa and Google.', 
    category: 'Smart Home', 
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800',
    rating: 4.5, 
    reviews: 1234, 
    stock: 156, 
    isBestSeller: true 
  },
  { 
    id: 'gaming-1', 
    name: 'RGB Gaming Mouse', 
    price: 35.00, 
    description: '16000 DPI sensor with 7 programmable buttons. Customizable RGB lighting and ergonomic design.', 
    category: 'Computer & Gaming', 
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&q=80&w=800',
    rating: 4.6, 
    reviews: 678, 
    stock: 67, 
    isBestSeller: true 
  }
];

// Categories for fallback
export const FALLBACK_CATEGORIES = [
  'All',
  'Headphones & Audio',
  'Chargers & Power Banks',
  'LED Lighting',
  'Phone Accessories',
  'Smart Home',
  'Fitness & Health',
  'Computer & Gaming',
  'Car Accessories'
];

// Current products state (populated from Supabase or fallback)
let cachedProducts: Product[] | null = null;
let cachedCategories: string[] | null = null;

// Fetch products from Supabase with fallback
export const fetchProducts = async (): Promise<Product[]> => {
  if (cachedProducts) return cachedProducts;
  
  try {
    const products = await getSupabaseProducts();
    if (products && products.length > 0) {
      cachedProducts = products;
      return products;
    }
  } catch (error) {
    console.error('Failed to fetch from Supabase, using fallback:', error);
  }
  
  cachedProducts = FALLBACK_PRODUCTS;
  return FALLBACK_PRODUCTS;
};

// Fetch categories from Supabase with fallback
export const fetchCategories = async (): Promise<string[]> => {
  if (cachedCategories) return cachedCategories;
  
  try {
    const categories = await getSupabaseCategories();
    if (categories && categories.length > 1) {
      cachedCategories = categories;
      return categories;
    }
  } catch (error) {
    console.error('Failed to fetch categories from Supabase, using fallback:', error);
  }
  
  cachedCategories = FALLBACK_CATEGORIES;
  return FALLBACK_CATEGORIES;
};

// Clear cache (useful for refreshing data)
export const clearProductCache = () => {
  cachedProducts = null;
  cachedCategories = null;
};

// Get stock urgency message
export const getStockUrgencyMessage = (stock: number): { message: string; urgent: boolean } | null => {
  if (stock <= 0) {
    return { message: 'Out of stock', urgent: true };
  }
  if (stock === 1) {
    return { message: 'Hurry! Only 1 left in stock', urgent: true };
  }
  if (stock === 2) {
    return { message: 'Only 2 left in stock', urgent: true };
  }
  if (stock === 3) {
    return { message: 'Only 3 left in stock', urgent: true };
  }
  return null;
};

// Legacy exports for backward compatibility
export const INITIAL_PRODUCTS = FALLBACK_PRODUCTS;
export const CATEGORIES = FALLBACK_CATEGORIES;

// Impulse items for cart upsells
export const IMPULSE_ITEMS: Product[] = [
  { 
    id: 'imp-1', 
    name: 'Microfiber Tech Cloth', 
    price: 9.00, 
    description: 'Ultra-soft lens and screen cleaning cloth.', 
    category: 'Accessories', 
    image: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?auto=format&fit=crop&q=80&w=400', 
    rating: 4.9, 
    reviews: 1520, 
    stock: 500 
  },
  { 
    id: 'imp-2', 
    name: 'USB-C Cable 2-Pack', 
    price: 12.00, 
    description: 'Braided 6ft cables with fast charging support.', 
    category: 'Accessories', 
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=400', 
    rating: 4.8, 
    reviews: 840, 
    stock: 200 
  },
  { 
    id: 'imp-3', 
    name: 'Phone Stand Mini', 
    price: 15.00, 
    description: 'Compact aluminum stand for desk use.', 
    category: 'Accessories', 
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400', 
    rating: 4.7, 
    reviews: 412, 
    stock: 150 
  }
];
