/**
 * MY ORDERS PAGE
 * Client's orders (their store only)
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, XCircle, Eye, Send } from 'lucide-react';
import { DataTable } from '../../shared/components/DataTable';
import { Button } from '../../shared/components/Button';
import { Modal } from '../../shared/components/Modal';

// Mock orders for this store only
const MOCK_ORDERS = [
  {
    id: 'ORD-001',
    orderNumber: 'SG-2024-001',
    customer: 'דניאל כהן',
    email: 'daniel@email.com',
    phone: '050-1234567',
    items: [
      { name: 'TWS Pro Earbuds', qty: 1, price: 35 },
      { name: 'Wireless Charger', qty: 1, price: 35 },
    ],
    total: 70.00,
    status: 'pending',
    tracking: null,
    date: '2024-12-27T10:30:00',
    address: 'רחוב הרצל 15, תל אביב',
  },
  {
    id: 'ORD-002',
    orderNumber: 'SG-2024-002',
    customer: 'יוסי אברהם',
    email: 'yossi@email.com',
    phone: '052-9876543',
    items: [
      { name: 'Smart LED Strip', qty: 2, price: 15 },
    ],
    total: 30.00,
    status: 'shipped',
    tracking: 'CJ1234567890',
    date: '2024-12-26T14:20:00',
    address: 'רחוב בן גוריון 42, חיפה',
  },
  {
    id: 'ORD-003',
    orderNumber: 'SG-2024-003',
    customer: 'מיכל לוי',
    email: 'michal@email.com',
    phone: '054-5555555',
    items: [
      { name: 'TWS Pro Earbuds', qty: 1, price: 35 },
    ],
    total: 35.00,
    status: 'processing',
    tracking: null,
    date: '2024-12-25T09:15:00',
    address: 'שדרות רוטשילד 80, תל אביב',
  },
];

export const MyOrders: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const filteredOrders = MOCK_ORDERS.filter((order) => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const filters = [
    { label: 'הכל', value: 'all' },
    { label: 'ממתינות', value: 'pending' },
    { label: 'בטיפול', value: 'processing' },
    { label: 'נשלחו', value: 'shipped' },
  ];

  const getStatusBadge = (status: string) => {
    const styles: any = {
      pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'ממתין', icon: Clock },
      processing: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'בטיפול', icon: Package },
      shipped: { bg: 'bg-green-100', text: 'text-green-700', label: 'נשלח', icon: Truck },
      delivered: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'הושלם', icon: CheckCircle },
    };
    const style = styles[status] || styles.pending;
    const Icon = style.icon;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${style.bg} ${style.text}`}>
        <Icon size={12} />
        {style.label}
      </span>
    );
  };

  const columns = [
    {
      key: 'orderNumber',
      header: 'מספר הזמנה',
      sortable: true,
      render: (order: any) => (
        <span className="font-mono font-bold text-shop-primary">{order.orderNumber}</span>
      ),
    },
    {
      key: 'customer',
      header: 'לקוח',
      render: (order: any) => (
        <div>
          <p className="font-bold text-shop-primary">{order.customer}</p>
          <p className="text-xs text-shop-muted">{order.phone}</p>
        </div>
      ),
    },
    {
      key: 'items',
      header: 'פריטים',
      render: (order: any) => <span>{order.items.length} פריטים</span>,
    },
    {
      key: 'total',
      header: 'סכום',
      sortable: true,
      render: (order: any) => (
        <span className="font-mono font-bold text-shop-cta">${order.total.toFixed(2)}</span>
      ),
    },
    {
      key: 'status',
      header: 'סטטוס',
      render: (order: any) => getStatusBadge(order.status),
    },
    {
      key: 'actions',
      header: 'פעולות',
      render: (order: any) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedOrder(order);
          }}
          className="p-2 bg-shop-bg rounded-lg hover:bg-shop-border transition-colors"
          title="צפייה"
        >
          <Eye size={16} className="text-shop-primary" />
        </button>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-black text-shop-primary tracking-tight mb-2"
        >
          הזמנות
        </motion.h1>
        <p className="text-shop-muted font-bold text-sm">
          {filteredOrders.length} הזמנות
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              filter === f.value
                ? 'bg-shop-primary text-white'
                : 'bg-shop-bg text-shop-text-secondary hover:bg-shop-border'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <DataTable
        columns={columns}
        data={filteredOrders}
        searchPlaceholder="חפש לפי מספר הזמנה או לקוח..."
        emptyMessage="אין הזמנות להצגה"
        onRowClick={(order) => setSelectedOrder(order)}
      />

      {/* Order Detail Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`הזמנה ${selectedOrder?.orderNumber}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Status */}
            <div className="flex items-center justify-between p-4 bg-shop-bg rounded-xl">
              <div>
                <p className="text-xs font-bold text-shop-muted uppercase mb-1">סטטוס</p>
                {getStatusBadge(selectedOrder.status)}
              </div>
              <div>
                <p className="text-xs font-bold text-shop-muted uppercase mb-1">תאריך</p>
                <p className="font-bold text-shop-primary">
                  {new Date(selectedOrder.date).toLocaleDateString('he-IL')}
                </p>
              </div>
            </div>

            {/* Customer */}
            <div>
              <h4 className="text-sm font-black text-shop-primary uppercase mb-3">פרטי לקוח</h4>
              <div className="p-4 bg-shop-bg rounded-xl space-y-2">
                <p className="font-bold text-shop-primary">{selectedOrder.customer}</p>
                <p className="text-sm text-shop-muted">{selectedOrder.email}</p>
                <p className="text-sm text-shop-muted">{selectedOrder.phone}</p>
                <p className="text-sm text-shop-muted">{selectedOrder.address}</p>
              </div>
            </div>

            {/* Items */}
            <div>
              <h4 className="text-sm font-black text-shop-primary uppercase mb-3">פריטים</h4>
              <div className="space-y-2">
                {selectedOrder.items.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-shop-bg rounded-xl"
                  >
                    <div>
                      <p className="font-bold text-shop-primary">{item.name}</p>
                      <p className="text-xs text-shop-muted">כמות: {item.qty}</p>
                    </div>
                    <span className="font-mono font-bold text-shop-primary">
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between p-4 bg-shop-cta/10 rounded-xl border border-shop-cta/20">
              <span className="font-bold text-shop-primary">סה״כ</span>
              <span className="font-mono font-black text-2xl text-shop-cta">
                ${selectedOrder.total.toFixed(2)}
              </span>
            </div>

            {/* Tracking */}
            {selectedOrder.tracking && (
              <div>
                <h4 className="text-sm font-black text-shop-primary uppercase mb-3">מעקב משלוח</h4>
                <div className="p-4 bg-shop-bg rounded-xl">
                  <p className="font-mono font-bold text-shop-primary">{selectedOrder.tracking}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                סגור
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyOrders;

