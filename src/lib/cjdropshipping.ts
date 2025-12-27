/**
 * CJDROPSHIPPING API INTEGRATION
 * Official API documentation: https://developers.cjdropshipping.com/
 */

const CJ_API_KEY = import.meta.env.VITE_CJ_API_KEY || '';
const CJ_API_BASE = 'https://developers.cjdropshipping.com/api2.0/v1';

export interface CJOrderItem {
  productId: string;
  productSku: string;
  productNameEn: string;
  quantity: number;
  price: number;
}

export interface CJShippingAddress {
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

export interface CJOrderRequest {
  orderNum: string; // Your order number
  shippingMethod: string; // e.g., "CJPacket Ordinary"
  shippingAddress: CJShippingAddress;
  products: CJOrderItem[];
  remark?: string;
}

export interface CJOrderResponse {
  code: number;
  result: boolean;
  message: string;
  data: {
    orderId: string;
    orderNum: string;
    status: string;
  };
}

export interface CJTrackingResponse {
  code: number;
  result: boolean;
  data: {
    orderId: string;
    trackingNumber: string;
    shippingStatus: string;
    carrier: string;
  };
}

/**
 * Create order in CJDropshipping
 */
export async function createCJOrder(orderRequest: CJOrderRequest): Promise<CJOrderResponse> {
  try {
    const response = await fetch(`${CJ_API_BASE}/shopping/order/createOrder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CJ-Access-Token': CJ_API_KEY
      },
      body: JSON.stringify(orderRequest)
    });

    if (!response.ok) {
      throw new Error(`CJ API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating CJ order:', error);
    throw error;
  }
}

/**
 * Get tracking information from CJ
 */
export async function getCJTracking(orderNum: string): Promise<CJTrackingResponse> {
  try {
    const response = await fetch(`${CJ_API_BASE}/shopping/order/getTrackingInfo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CJ-Access-Token': CJ_API_KEY
      },
      body: JSON.stringify({ orderNum })
    });

    if (!response.ok) {
      throw new Error(`CJ API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting CJ tracking:', error);
    throw error;
  }
}

/**
 * Check if CJ API is configured
 */
export function isCJConfigured(): boolean {
  return CJ_API_KEY.length > 0;
}

/**
 * Product search in CJ (for finding products)
 */
export async function searchCJProduct(keyword: string) {
  try {
    const response = await fetch(`${CJ_API_BASE}/product/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CJ-Access-Token': CJ_API_KEY
      },
      body: JSON.stringify({
        keyword,
        pageNum: 1,
        pageSize: 20
      })
    });

    if (!response.ok) {
      throw new Error(`CJ API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching CJ products:', error);
    throw error;
  }
}

