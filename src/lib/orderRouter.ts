/**
 * MULTI-SUPPLIER ORDER ROUTER
 * Smart routing logic for choosing the best supplier for each order
 */

import { CartItem } from '../types';
import { getPreferredSupplier, getCheapestSupplier, getFastestSupplier, SupplierInfo } from './productSuppliers';
import { createCJOrder, CJOrderRequest, isCJConfigured } from './cjdropshipping';

export type RoutingStrategy = 'preferred' | 'cheapest' | 'fastest' | 'available';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
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

export interface SupplierOrder {
  supplier: string;
  items: OrderItem[];
  totalCost: number;
  estimatedDays: number;
}

export interface OrderRouteResult {
  orderId: string;
  supplierOrders: SupplierOrder[];
  totalSupplierCost: number;
  profit: number;
  status: 'success' | 'partial' | 'failed';
  errors: string[];
}

/**
 * Route order to suppliers based on strategy
 */
export function routeOrderToSuppliers(
  orderItems: CartItem[],
  strategy: RoutingStrategy = 'preferred'
): SupplierOrder[] {
  const supplierOrders = new Map<string, SupplierOrder>();

  for (const item of orderItems) {
    let supplierInfo: SupplierInfo | undefined;

    // Choose supplier based on strategy
    switch (strategy) {
      case 'cheapest':
        supplierInfo = getCheapestSupplier(item.id);
        break;
      case 'fastest':
        supplierInfo = getFastestSupplier(item.id);
        break;
      case 'preferred':
      case 'available':
      default:
        supplierInfo = getPreferredSupplier(item.id);
        break;
    }

    if (!supplierInfo) {
      console.warn(`No supplier found for product: ${item.name}`);
      continue;
    }

    // Group items by supplier
    const supplierName = supplierInfo.name;
    if (!supplierOrders.has(supplierName)) {
      supplierOrders.set(supplierName, {
        supplier: supplierName,
        items: [],
        totalCost: 0,
        estimatedDays: supplierInfo.shipping_days
      });
    }

    const supplierOrder = supplierOrders.get(supplierName)!;
    supplierOrder.items.push({
      productId: item.id,
      productName: item.name,
      quantity: item.quantity,
      price: item.price
    });
    supplierOrder.totalCost += supplierInfo.cost * item.quantity;
  }

  return Array.from(supplierOrders.values());
}

/**
 * Submit order to CJDropshipping
 */
async function submitToCJ(
  orderNum: string,
  items: OrderItem[],
  shippingAddress: ShippingAddress
): Promise<{ success: boolean; error?: string; orderId?: string }> {
  if (!isCJConfigured()) {
    return { success: false, error: 'CJ API not configured' };
  }

  try {
    const cjOrder: CJOrderRequest = {
      orderNum,
      shippingMethod: 'CJPacket Ordinary',
      shippingAddress: {
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName,
        email: shippingAddress.email,
        phone: shippingAddress.phone,
        address: shippingAddress.address,
        apartment: shippingAddress.apartment,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zipCode: shippingAddress.zipCode,
        country: shippingAddress.country
      },
      products: items.map(item => ({
        productId: item.productId,
        productSku: item.productId, // Will be mapped from productSuppliers
        productNameEn: item.productName,
        quantity: item.quantity,
        price: item.price
      }))
    };

    const response = await createCJOrder(cjOrder);

    if (response.result) {
      return { success: true, orderId: response.data.orderId };
    } else {
      return { success: false, error: response.message };
    }
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

/**
 * Submit order to appropriate suppliers (Auto or Manual)
 */
export async function submitOrderToSuppliers(
  orderNum: string,
  cart: CartItem[],
  shippingAddress: ShippingAddress,
  strategy: RoutingStrategy = 'preferred',
  autoSubmit: boolean = true
): Promise<OrderRouteResult> {
  const supplierOrders = routeOrderToSuppliers(cart, strategy);
  const errors: string[] = [];
  let successCount = 0;

  const result: OrderRouteResult = {
    orderId: orderNum,
    supplierOrders,
    totalSupplierCost: 0,
    profit: 0,
    status: 'success',
    errors: []
  };

  // Calculate costs
  result.totalSupplierCost = supplierOrders.reduce((sum, order) => sum + order.totalCost, 0);
  const retailTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  result.profit = retailTotal - result.totalSupplierCost;

  if (!autoSubmit) {
    // Manual mode - just return routing info
    return result;
  }

  // Auto-submit to suppliers
  for (const supplierOrder of supplierOrders) {
    if (supplierOrder.supplier === 'CJDropshipping') {
      const cjResult = await submitToCJ(orderNum, supplierOrder.items, shippingAddress);
      if (cjResult.success) {
        successCount++;
      } else {
        errors.push(`CJ: ${cjResult.error}`);
      }
    } else {
      // For other suppliers (Spocket, AliExpress, Printful)
      // Will be manual for now - admin will see in dashboard
      errors.push(`${supplierOrder.supplier}: Manual order required (not yet integrated)`);
    }
  }

  // Determine overall status
  if (successCount === supplierOrders.length) {
    result.status = 'success';
  } else if (successCount > 0) {
    result.status = 'partial';
  } else {
    result.status = 'failed';
  }

  result.errors = errors;
  return result;
}

/**
 * Get supplier breakdown for an order (for admin display)
 */
export function getSupplierBreakdown(cart: CartItem[]): {
  [supplier: string]: {
    items: string[];
    cost: number;
    days: number;
  };
} {
  const supplierOrders = routeOrderToSuppliers(cart, 'preferred');
  const breakdown: any = {};

  for (const order of supplierOrders) {
    breakdown[order.supplier] = {
      items: order.items.map(i => `${i.productName} (x${i.quantity})`),
      cost: order.totalCost,
      days: order.estimatedDays
    };
  }

  return breakdown;
}

