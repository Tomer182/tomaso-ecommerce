/**
 * STORE MANAGEMENT
 * Multi-store support for Owner
 */

export interface Store {
  id: string;
  name: string;
  domain: string;
  logo?: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  stats?: StoreStats;
}

export interface StoreStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
}

// Current available stores
const STORES: Store[] = [
  {
    id: 'sparkgear',
    name: 'SparkGear',
    domain: 'sparkgear.net',
    status: 'active',
    createdAt: '2024-12-01',
    stats: {
      totalOrders: 0,
      totalRevenue: 0,
      totalCustomers: 0,
      totalProducts: 15,
    },
  },
  {
    id: 'funhouse',
    name: 'FunHouse',
    domain: 'funhouse.one',
    status: 'active',
    createdAt: '2024-12-01',
    stats: {
      totalOrders: 0,
      totalRevenue: 0,
      totalCustomers: 0,
      totalProducts: 10,
    },
  },
];

const CURRENT_STORE_KEY = 'autopilot_current_store';

/**
 * Get all stores
 */
export function getStores(): Store[] {
  // TODO: Fetch from Supabase
  return STORES;
}

/**
 * Get store by ID
 */
export function getStoreById(id: string): Store | undefined {
  return STORES.find((store) => store.id === id);
}

/**
 * Get current selected store
 */
export function getCurrentStore(): Store | null {
  try {
    const storeId = localStorage.getItem(CURRENT_STORE_KEY);
    if (storeId) {
      return getStoreById(storeId) || null;
    }
    // Default to first store
    return STORES[0] || null;
  } catch (error) {
    console.error('Error getting current store:', error);
    return STORES[0] || null;
  }
}

/**
 * Set current selected store
 */
export function setCurrentStore(storeId: string): void {
  localStorage.setItem(CURRENT_STORE_KEY, storeId);
}

/**
 * Get store for client user
 */
export function getClientStore(storeId: string): Store | undefined {
  return getStoreById(storeId);
}

/**
 * Get global stats (all stores combined)
 */
export function getGlobalStats(): StoreStats {
  const stores = getStores();
  
  return stores.reduce(
    (acc, store) => {
      if (store.stats) {
        acc.totalOrders += store.stats.totalOrders;
        acc.totalRevenue += store.stats.totalRevenue;
        acc.totalCustomers += store.stats.totalCustomers;
        acc.totalProducts += store.stats.totalProducts;
      }
      return acc;
    },
    {
      totalOrders: 0,
      totalRevenue: 0,
      totalCustomers: 0,
      totalProducts: 0,
    }
  );
}

