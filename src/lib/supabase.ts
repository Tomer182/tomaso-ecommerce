import { createClient } from '@supabase/supabase-js';
import { Product } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Store ID for SparkGear
const STORE_ID = 'sparkgear';

// Database Types (for when Supabase is connected)
export interface DbProduct {
  id: string;
  store_id: string;
  name: string;
  price: number;
  original_price?: number;
  description: string;
  category: string;
  subcategory?: string;
  image_url: string;
  images?: string[];
  rating: number;
  reviews_count: number;
  stock: number;
  sold_today?: number;
  is_new?: boolean;
  is_best_seller?: boolean;
  is_featured?: boolean;
  is_sale?: boolean;
  trend_score?: number;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

// Transform database product to frontend Product type
export const transformDbProduct = (dbProduct: DbProduct): Product => ({
  id: dbProduct.id,
  name: dbProduct.name,
  price: Number(dbProduct.price),
  originalPrice: dbProduct.original_price ? Number(dbProduct.original_price) : undefined,
  description: dbProduct.description || '',
  category: dbProduct.category,
  subcategory: dbProduct.subcategory,
  image: dbProduct.image_url,
  images: dbProduct.images,
  rating: Number(dbProduct.rating) || 4.5,
  reviews: dbProduct.reviews_count || 0,
  stock: dbProduct.stock || 0,
  soldToday: dbProduct.sold_today,
  isNew: dbProduct.is_new,
  isBestSeller: dbProduct.is_best_seller,
  isSale: dbProduct.is_sale,
  isFeatured: dbProduct.is_featured,
  trendScore: dbProduct.trend_score,
  tags: dbProduct.tags,
});

export interface DbOrder {
  id: string;
  user_id?: string;
  items: any;
  shipping_address: any;
  subtotal: number;
  shipping_cost: number;
  discount: number;
  total: number;
  payment_method: string;
  payment_intent_id?: string;
  status: string;
  created_at: string;
}

// Supabase helper functions
export const getProducts = async (): Promise<Product[] | null> => {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', STORE_ID)
    .order('trend_score', { ascending: false });
  if (error) {
    console.error('Error fetching products:', error);
    return null;
  }
  return data ? data.map(transformDbProduct) : null;
};

export const getProductsByCategory = async (category: string): Promise<Product[] | null> => {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', STORE_ID)
    .eq('category', category)
    .order('trend_score', { ascending: false });
  if (error) {
    console.error('Error fetching products by category:', error);
    return null;
  }
  return data ? data.map(transformDbProduct) : null;
};

export const getProductById = async (id: string): Promise<Product | null> => {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('store_id', STORE_ID)
    .single();
  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }
  return data ? transformDbProduct(data) : null;
};

export const getCategories = async (): Promise<string[] | null> => {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('products')
    .select('category')
    .eq('store_id', STORE_ID);
  if (error) {
    console.error('Error fetching categories:', error);
    return null;
  }
  const categories = [...new Set(data?.map(p => p.category) || [])];
  return ['All', ...categories.sort()];
};

export const createOrder = async (orderData: Omit<DbOrder, 'id' | 'created_at'>) => {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getOrderById = async (id: string) => {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

// SQL for creating tables (run this in Supabase SQL editor)
export const SUPABASE_SCHEMA = `
-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  description TEXT,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  images TEXT[],
  rating DECIMAL(2,1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  stock INTEGER DEFAULT 0,
  sold_today INTEGER DEFAULT 0,
  is_new BOOLEAN DEFAULT false,
  is_best_seller BOOLEAN DEFAULT false,
  is_sale BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  items JSONB NOT NULL,
  shipping_address JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_intent_id TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Products are readable by everyone
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

-- Orders are only viewable by the user who created them
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create orders" ON orders
  FOR INSERT WITH CHECK (true);
`;

