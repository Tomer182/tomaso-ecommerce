/**
 * ADMIN API - Connect to Supabase for real data
 */

import {
  getAdminOrders,
  getAdminCustomers,
  getAdminProducts,
  getAdminStats,
  updateOrderStatus,
  updateAdminProduct,
  getOrderItems,
  getStores as getSupabaseStores,
  isSupabaseConfigured,
  AdminOrder,
  AdminCustomer,
  AdminProduct,
  AdminStats,
} from '../../lib/supabase';

export type { AdminOrder, AdminCustomer, AdminProduct, AdminStats };

export interface Store {
  id: string;
  name: string;
  domain: string;
  status: 'active' | 'inactive';
  stats?: AdminStats;
}

// Current store context
let currentStoreId: string | null = null;

export const setCurrentStore = (storeId: string | null) => {
  currentStoreId = storeId;
  if (storeId) {
    localStorage.setItem('admin_current_store', storeId);
  } else {
    localStorage.removeItem('admin_current_store');
  }
};

export const getCurrentStoreId = (): string | null => {
  if (currentStoreId) return currentStoreId;
  return localStorage.getItem('admin_current_store');
};

// Get all stores
export const fetchStores = async (): Promise<Store[]> => {
  const stores = await getSupabaseStores();
  
  // Get stats for each store
  const storesWithStats = await Promise.all(
    stores.map(async (store) => {
      const stats = await getAdminStats(store.id);
      return {
        ...store,
        status: 'active' as const,
        stats,
      };
    })
  );
  
  return storesWithStats;
};

// Get global stats (all stores)
export const fetchGlobalStats = async (): Promise<AdminStats> => {
  return getAdminStats(getCurrentStoreId() || undefined);
};

// Get orders
export const fetchOrders = async (): Promise<AdminOrder[]> => {
  return getAdminOrders(getCurrentStoreId() || undefined);
};

// Get customers
export const fetchCustomers = async (): Promise<AdminCustomer[]> => {
  return getAdminCustomers(getCurrentStoreId() || undefined);
};

// Get products
export const fetchProducts = async (): Promise<AdminProduct[]> => {
  return getAdminProducts(getCurrentStoreId() || undefined);
};

// Update order
export const updateOrder = async (
  orderId: string,
  status: string,
  trackingNumber?: string
): Promise<boolean> => {
  return updateOrderStatus(orderId, status, trackingNumber);
};

// Update product
export const updateProduct = async (
  productId: string,
  updates: Partial<AdminProduct>
): Promise<boolean> => {
  return updateAdminProduct(productId, updates);
};

// Get order details with items
export const fetchOrderDetails = async (orderId: string) => {
  const items = await getOrderItems(orderId);
  return { items };
};

// Check connection
export const isConnected = (): boolean => {
  return isSupabaseConfigured();
};

// Format order for display
export const formatOrder = (order: AdminOrder) => ({
  id: order.id,
  orderNumber: order.order_number,
  customer: order.customer_name,
  email: order.customer_email,
  phone: order.shipping_phone || '',
  address: `${order.shipping_address}, ${order.shipping_city}, ${order.shipping_state} ${order.shipping_zip}`,
  items: 0, // Will be fetched separately
  total: Number(order.total),
  status: order.status,
  tracking: order.tracking_number || null,
  supplier: order.supplier_order_id ? 'CJDropshipping' : null,
  date: order.created_at,
  storeId: order.store_id,
});

// Format customer for display
export const formatCustomer = (customer: AdminCustomer) => ({
  id: customer.id,
  name: `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || customer.email.split('@')[0],
  email: customer.email,
  phone: customer.phone || '',
  orders: customer.total_orders || 0,
  totalSpent: customer.total_spent || 0,
  lastOrder: customer.created_at,
  storeId: customer.store_id,
});

// Format product for display
export const formatProduct = (product: AdminProduct) => ({
  id: product.id,
  name: product.name,
  category: product.category,
  price: Number(product.price),
  originalPrice: product.original_price ? Number(product.original_price) : undefined,
  stock: product.stock,
  status: product.stock > 0 ? (product.stock <= 5 ? 'low_stock' : 'active') : 'out_of_stock',
  image: product.image_url,
  isNew: product.is_new,
  isBestSeller: product.is_best_seller,
  isSale: product.is_sale,
  storeId: product.store_id,
});

