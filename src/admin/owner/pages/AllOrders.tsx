/**
 * ALL ORDERS PAGE
 * View and manage orders from all stores
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, XCircle, Eye, Send } from 'lucide-react';
import { DataTable } from '../../shared/components/DataTable';
import { Button } from '../../shared/components/Button';
import { Modal } from '../../shared/components/Modal';
import { Store } from '../../lib/stores';

interface AllOrdersProps {
  currentStore: Store | null;
}

// Mock orders data
const MOCK_ORDERS = [
  {
    id: 'ORD-001',
    orderNumber: 'SG-2024-001',
    customer: 'דניאל כהן',
    email: 'daniel@email.com',
    store: 'SparkGear',
    items: 3,
    total: 249.99,
    status: 'pending',
    supplier: 'CJDropshipping',
    tracking: null,
    date: '2024-12-27T10:30:00',
  },
  {
    id: 'ORD-002',
    orderNumber: 'FH-2024-015',
    customer: 'מיכל לוי',
    email: 'michal@email.com',
    store: 'FunHouse',
    items: 1,
    total: 89.99,
    status: 'shipped',
    supplier: 'CJDropshipping',
    tracking: 'CJ1234567890',
    date: '2024-12-26T14:20:00',
  },
  {
    id: 'ORD-003',
    orderNumber: 'SG-2024-002',
    customer: 'יוסי אברהם',
    email: 'yossi@email.com',
    store: 'SparkGear',
    items: 2,
    total: 159.99,
    status: 'processing',
    supplier: 'CJDropshipping',
    tracking: null,
    date: '2024-12-26T09:15:00',
  },
  {
    id: 'ORD-004',
    orderNumber: 'FH-2024-016',
    customer: 'רונית שמעון',
    email: 'ronit@email.com',
    store: 'FunHouse',
    items: 4,
    total: 199.99,
    status: 'delivered',
    supplier: 'Spocket',
    tracking: 'SP9876543210',
    date: '2024-12-25T16:45:00',
  },
  {
    id: 'ORD-005',
    orderNumber: 'SG-2024-003',
    customer: 'אבי ישראלי',
    email: 'avi@email.com',
    store: 'SparkGear',
    items: 1,
    total: 49.99,
    status: 'cancelled',
    supplier: null,
    tracking: null,
    date: '2024-12-24T11:00:00',
  },
];

export const AllOrders: React.FC<AllOrdersProps> = ({ currentStore }) => {
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Filter orders by store if selected
  const filteredOrders = MOCK_ORDERS.filter((order) => {
    if (currentStore && order.store !== currentStore.name) return false;
    if (filter !== 'all' && order.status !== filter) return false;
    return true;
  });

  const filters = [
    { label: 'הכל', value: 'all' },
    { label: 'ממתינות', value: 'pending' },
    { label: 'בטיפול', value: 'processing' },
    { label: 'נשלחו', value: 'shipped' },
    { label: 'הושלמו', value: 'delivered' },
    { label: 'בוטלו', value: 'cancelled' },
  ];

  const getStatusBadge = (status: string) => {
    const styles: any = {
      pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'ממתין', icon: Clock },
      processing: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'בטיפול', icon: Package },
      shipped: { bg: 'bg-green-100', text: 'text-green-700', label: 'נשלח', icon: Truck },
      delivered: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'הושלם', icon: CheckCircle },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'בוטל', icon: XCircle },
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
          <p className="text-xs text-shop-muted">{order.email}</p>
        </div>
      ),
    },
    { key: 'store', header: 'חנות' },
    { key: 'items', header: 'פריטים' },
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
      key: 'supplier',
      header: 'ספק',
      render: (order: any) => (
        <span className={order.supplier ? 'text-shop-primary' : 'text-shop-muted'}>
          {order.supplier || '-'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'פעולות',
      render: (order: any) => (
        <div className="flex gap-2">
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
          {order.status === 'pending' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log('Send to supplier:', order.id);
              }}
              className="p-2 bg-shop-cta/10 rounded-lg hover:bg-shop-cta/20 transition-colors"
              title="שלח לספק"
            >
              <Send size={16} className="text-shop-cta" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-black text-shop-primary tracking-tight mb-2"
          >
            {currentStore ? `הזמנות - ${currentStore.name}` : 'כל ההזמנות'}
          </motion.h1>
          <p className="text-shop-muted font-bold text-sm">
            {filteredOrders.length} הזמנות
          </p>
        </div>
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
        emptyIcon={<Package size={48} className="text-shop-border" />}
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
            {/* Order Status */}
            <div className="flex items-center justify-between p-4 bg-shop-bg rounded-xl">
              <div>
                <p className="text-xs font-bold text-shop-muted uppercase mb-1">סטטוס</p>
                {getStatusBadge(selectedOrder.status)}
              </div>
              <div>
                <p className="text-xs font-bold text-shop-muted uppercase mb-1">חנות</p>
                <p className="font-bold text-shop-primary">{selectedOrder.store}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-shop-muted uppercase mb-1">תאריך</p>
                <p className="font-bold text-shop-primary">
                  {new Date(selectedOrder.date).toLocaleDateString('he-IL')}
                </p>
              </div>
            </div>

            {/* Customer Info */}
            <div>
              <h4 className="text-sm font-black text-shop-primary uppercase mb-3">פרטי לקוח</h4>
              <div className="p-4 bg-shop-bg rounded-xl">
                <p className="font-bold text-shop-primary">{selectedOrder.customer}</p>
                <p className="text-sm text-shop-muted">{selectedOrder.email}</p>
              </div>
            </div>

            {/* Supplier Info */}
            <div>
              <h4 className="text-sm font-black text-shop-primary uppercase mb-3">ספק</h4>
              <div className="p-4 bg-shop-bg rounded-xl">
                <p className="font-bold text-shop-primary">
                  {selectedOrder.supplier || 'לא נשלח לספק'}
                </p>
                {selectedOrder.tracking && (
                  <p className="text-sm text-shop-muted mt-1">
                    מעקב: <span className="font-mono">{selectedOrder.tracking}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <h4 className="text-sm font-black text-shop-primary uppercase mb-3">סיכום</h4>
              <div className="p-4 bg-shop-bg rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-shop-muted">{selectedOrder.items} פריטים</span>
                  <span className="font-mono font-black text-xl text-shop-cta">
                    ${selectedOrder.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {selectedOrder.status === 'pending' && (
                <Button variant="primary" icon={<Send size={16} />}>
                  שלח לספק
                </Button>
              )}
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

export default AllOrders;

