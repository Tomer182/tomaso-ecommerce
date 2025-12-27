/**
 * ORDER MANAGEMENT SERVICE
 * Handles order creation, tracking, and supplier coordination
 */

import { createOrder as saveToSupabase } from './supabase';
import { submitOrderToSuppliers, getSupplierBreakdown } from './orderRouter';
import type { Order, CartItem, ShippingAddress } from '../types';

export interface OrderWithSuppliers extends Order {
  supplierBreakdown?: {
    [supplier: string]: {
      items: string[];
      cost: number;
      days: number;
    };
  };
  autoSubmitted?: boolean;
  supplierStatus?: string;
}

/**
 * Create order and route to suppliers
 */
export async function createOrderWithSuppliers(
  cart: CartItem[],
  shippingAddress: ShippingAddress,
  paymentDetails: {
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
    paymentMethod: string;
    paymentIntentId?: string;
  },
  autoSubmit: boolean = false // Set to false for manual approval
): Promise<OrderWithSuppliers> {
  // Generate order number
  const orderNumber = `FH-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  // Create base order
  const order: Order = {
    id: orderNumber,
    items: cart.map(item => ({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image
    })),
    shipping: shippingAddress,
    subtotal: paymentDetails.subtotal,
    shippingCost: paymentDetails.shipping,
    discount: paymentDetails.discount,
    total: paymentDetails.total,
    paymentMethod: paymentDetails.paymentMethod,
    paymentIntentId: paymentDetails.paymentIntentId,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  // Get supplier breakdown
  const supplierBreakdown = getSupplierBreakdown(cart);

  // Route to suppliers
  const routingResult = await submitOrderToSuppliers(
    orderNumber,
    cart,
    shippingAddress,
    'preferred',
    autoSubmit
  );

  // Save to database
  try {
    await saveToSupabase({
      items: order.items,
      shipping_address: shippingAddress,
      subtotal: order.subtotal,
      shipping_cost: order.shippingCost,
      discount: order.discount,
      total: order.total,
      payment_method: order.paymentMethod,
      payment_intent_id: order.paymentIntentId
    });
  } catch (error) {
    console.error('Error saving to Supabase:', error);
    // Continue even if Supabase fails
  }

  // Return extended order
  const orderWithSuppliers: OrderWithSuppliers = {
    ...order,
    supplierBreakdown,
    autoSubmitted: autoSubmit,
    supplierStatus: routingResult.status
  };

  // Send email notification (will be implemented next)
  try {
    await sendOrderNotification(orderWithSuppliers);
  } catch (error) {
    console.error('Error sending notification:', error);
  }

  return orderWithSuppliers;
}

/**
 * Send order notification email
 */
async function sendOrderNotification(order: OrderWithSuppliers): Promise<void> {
  // TODO: Implement email notification
  // For now, just log
  console.log('📧 Order Notification:', {
    orderId: order.id,
    total: order.total,
    suppliers: Object.keys(order.supplierBreakdown || {})
  });
}

/**
 * Get orders list (for admin)
 */
export async function getOrders(): Promise<OrderWithSuppliers[]> {
  // TODO: Fetch from Supabase
  return [];
}

/**
 * Update order tracking
 */
export async function updateOrderTracking(
  orderId: string,
  trackingNumber: string,
  carrier: string
): Promise<void> {
  // TODO: Update in Supabase and notify customer
  console.log('📦 Tracking updated:', { orderId, trackingNumber, carrier });
}

