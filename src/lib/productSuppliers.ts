/**
 * PRODUCT-SUPPLIER MAPPING - SPARKGEAR
 * Maps each product to its suppliers with pricing and logistics info
 */

export interface SupplierInfo {
  name: 'CJDropshipping' | 'Spocket' | 'AliExpress' | 'Printful';
  sku: string;
  cost: number;
  shipping_days: number;
  in_stock: boolean;
  priority: number;
}

export interface ProductSupplierMap {
  product_id: string;
  product_name: string;
  retail_price: number;
  suppliers: SupplierInfo[];
  preferred_supplier: string;
}

// SPARKGEAR Product Mappings
export const SPARKGEAR_PRODUCT_SUPPLIERS: ProductSupplierMap[] = [
  // TWS Earbuds - Best Sellers
  {
    product_id: 'tws-pro-earbuds',
    product_name: 'TWS Pro Earbuds',
    retail_price: 35.00,
    suppliers: [
      { name: 'CJDropshipping', sku: 'CJ-TWS-PRO', cost: 12.00, shipping_days: 10, in_stock: true, priority: 1 },
      { name: 'AliExpress', sku: 'AE-TWS-001', cost: 8.50, shipping_days: 18, in_stock: true, priority: 2 }
    ],
    preferred_supplier: 'CJDropshipping'
  },
  {
    product_id: 'anc-earbuds',
    product_name: 'ANC Noise Cancelling Buds',
    retail_price: 65.00,
    suppliers: [
      { name: 'CJDropshipping', sku: 'CJ-ANC-001', cost: 22.00, shipping_days: 10, in_stock: true, priority: 1 },
      { name: 'AliExpress', sku: 'AE-ANC-PRO', cost: 18.00, shipping_days: 20, in_stock: true, priority: 2 }
    ],
    preferred_supplier: 'CJDropshipping'
  },
  
  // Wireless Chargers
  {
    product_id: 'wireless-3in1',
    product_name: 'Wireless Charger 3-in-1',
    retail_price: 35.00,
    suppliers: [
      { name: 'CJDropshipping', sku: 'CJ-WC-3IN1', cost: 12.00, shipping_days: 10, in_stock: true, priority: 1 },
      { name: 'AliExpress', sku: 'AE-WC-3IN1', cost: 9.50, shipping_days: 18, in_stock: true, priority: 2 }
    ],
    preferred_supplier: 'CJDropshipping'
  },
  {
    product_id: 'magsafe-charger',
    product_name: 'MagSafe Style Charger',
    retail_price: 25.00,
    suppliers: [
      { name: 'CJDropshipping', sku: 'CJ-MAG-CHG', cost: 8.50, shipping_days: 10, in_stock: true, priority: 1 }
    ],
    preferred_supplier: 'CJDropshipping'
  },
  
  // Power Banks
  {
    product_id: 'powerbank-20k',
    product_name: 'Power Bank 20,000mAh',
    retail_price: 29.00,
    suppliers: [
      { name: 'CJDropshipping', sku: 'CJ-PB-20K', cost: 10.00, shipping_days: 10, in_stock: true, priority: 1 },
      { name: 'AliExpress', sku: 'AE-PB-20K', cost: 7.50, shipping_days: 18, in_stock: true, priority: 2 }
    ],
    preferred_supplier: 'CJDropshipping'
  },
  {
    product_id: 'powerbank-magsafe',
    product_name: 'Power Bank MagSafe',
    retail_price: 35.00,
    suppliers: [
      { name: 'CJDropshipping', sku: 'CJ-PB-MAG', cost: 14.00, shipping_days: 10, in_stock: true, priority: 1 }
    ],
    preferred_supplier: 'CJDropshipping'
  },
  
  // LED Lighting
  {
    product_id: 'led-strip-rgb',
    product_name: 'LED Strip RGB 5M',
    retail_price: 15.00,
    suppliers: [
      { name: 'CJDropshipping', sku: 'CJ-LED-5M', cost: 5.00, shipping_days: 10, in_stock: true, priority: 1 },
      { name: 'AliExpress', sku: 'AE-LED-5M', cost: 3.50, shipping_days: 18, in_stock: true, priority: 2 }
    ],
    preferred_supplier: 'CJDropshipping'
  },
  {
    product_id: 'galaxy-projector',
    product_name: 'Galaxy Star Projector',
    retail_price: 25.00,
    suppliers: [
      { name: 'CJDropshipping', sku: 'CJ-PROJ-GAL', cost: 10.00, shipping_days: 10, in_stock: true, priority: 1 }
    ],
    preferred_supplier: 'CJDropshipping'
  },
  {
    product_id: 'sunset-lamp',
    product_name: 'Sunset Projection Lamp',
    retail_price: 19.00,
    suppliers: [
      { name: 'CJDropshipping', sku: 'CJ-LAMP-SUN', cost: 7.50, shipping_days: 10, in_stock: true, priority: 1 }
    ],
    preferred_supplier: 'CJDropshipping'
  },
  
  // Smart Home
  {
    product_id: 'smart-plug-wifi',
    product_name: 'Smart Plug WiFi',
    retail_price: 12.00,
    suppliers: [
      { name: 'CJDropshipping', sku: 'CJ-PLUG-WIFI', cost: 4.00, shipping_days: 10, in_stock: true, priority: 1 },
      { name: 'AliExpress', sku: 'AE-PLUG-001', cost: 2.80, shipping_days: 18, in_stock: true, priority: 2 }
    ],
    preferred_supplier: 'CJDropshipping'
  },
  {
    product_id: 'smart-bulb-rgb',
    product_name: 'Smart Bulb WiFi RGB',
    retail_price: 12.00,
    suppliers: [
      { name: 'CJDropshipping', sku: 'CJ-BULB-RGB', cost: 4.50, shipping_days: 10, in_stock: true, priority: 1 }
    ],
    preferred_supplier: 'CJDropshipping'
  },
  
  // Fitness & Massage
  {
    product_id: 'massage-gun',
    product_name: 'Massage Gun Pro',
    retail_price: 59.00,
    suppliers: [
      { name: 'CJDropshipping', sku: 'CJ-MSG-PRO', cost: 22.00, shipping_days: 10, in_stock: true, priority: 1 },
      { name: 'AliExpress', sku: 'AE-MSG-001', cost: 18.00, shipping_days: 20, in_stock: true, priority: 2 }
    ],
    preferred_supplier: 'CJDropshipping'
  },
  {
    product_id: 'massage-gun-mini',
    product_name: 'Mini Massage Gun',
    retail_price: 35.00,
    suppliers: [
      { name: 'CJDropshipping', sku: 'CJ-MSG-MINI', cost: 14.00, shipping_days: 10, in_stock: true, priority: 1 }
    ],
    preferred_supplier: 'CJDropshipping'
  },
  
  // Phone Accessories
  {
    product_id: 'phone-stand-magsafe',
    product_name: 'MagSafe Car Mount',
    retail_price: 19.00,
    suppliers: [
      { name: 'CJDropshipping', sku: 'CJ-CAR-MAG', cost: 7.00, shipping_days: 10, in_stock: true, priority: 1 }
    ],
    preferred_supplier: 'CJDropshipping'
  },
  {
    product_id: 'ring-light-10',
    product_name: 'Ring Light 10"',
    retail_price: 25.00,
    suppliers: [
      { name: 'CJDropshipping', sku: 'CJ-RING-10', cost: 10.00, shipping_days: 10, in_stock: true, priority: 1 }
    ],
    preferred_supplier: 'CJDropshipping'
  }
];

// Helper functions
export function getProductSuppliers(productId: string): ProductSupplierMap | undefined {
  return SPARKGEAR_PRODUCT_SUPPLIERS.find(p => p.product_id === productId);
}

export function getPreferredSupplier(productId: string): SupplierInfo | undefined {
  const product = getProductSuppliers(productId);
  if (!product) return undefined;
  
  const preferred = product.suppliers.find(s => s.name === product.preferred_supplier);
  return preferred || product.suppliers[0];
}

export function getCheapestSupplier(productId: string): SupplierInfo | undefined {
  const product = getProductSuppliers(productId);
  if (!product) return undefined;
  
  return product.suppliers.reduce((cheapest, current) => 
    current.cost < cheapest.cost ? current : cheapest
  );
}

export function getFastestSupplier(productId: string): SupplierInfo | undefined {
  const product = getProductSuppliers(productId);
  if (!product) return undefined;
  
  return product.suppliers.reduce((fastest, current) => 
    current.shipping_days < fastest.shipping_days ? current : fastest
  );
}

