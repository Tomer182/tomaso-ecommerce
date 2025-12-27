/**
 * ALL ORDERS PAGE - Connected to Real Data
 * View and manage orders from all stores
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, XCircle, Eye, Send, RefreshCw } from 'lucide-react';
import { DataTable } from '../../shared/components/DataTable';
import { Button } from '../../shared/components/Button';
import { Modal } from '../../shared/components/Modal';
import { Select } from '../../shared/components/Input';
import { Store, fetchOrders, formatOrder, updateOrder, fetchOrderDetails, AdminOrder } from '../../lib/adminApi';

interface AllOrdersProps {
  currentStore: Store | null;
}

export const AllOrders: React.FC<AllOrdersProps> = ({ currentStore }) => {
  const [filter, setFilter] = useState('all');
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await fetchOrders();
      const formatted = data.map(formatOrder);
      
      // Filter by current store if selected
      const filtered = currentStore 
        ? formatted.filter(o => o.storeId === currentStore.id)
        : formatted;
      
      setOrders(filtered);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [currentStore]);

  // Filter orders by status
  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const filters = [
    { label: 'הכל', value: 'all' },
    { label: 'ממתינות', value: 'pending' },
    { label: 'בטיפול', value: 'processing' },
    { label: 'נשלחו', value: 'shipped' },
    { label: 'הושלמו', value: 'delivered' },
    { label: 'בוטלו', value: 'cancelled' },
  ];

  const handleUpdateStatus = async (orderId: string, newStatus: string, tracking?: string) => {
    setIsUpdating(true);
    try {
      const success = await updateOrder(orderId, newStatus, tracking);
      if (success) {
        await loadOrders();
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error('Error updating order:', error);
    } finally {
      setIsUpdating(false);
    }
  };

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
        <span className="font-mono font-bold text-shop-primary">{order.orderNumber || order.id.slice(0, 8)}</span>
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
      key: 'tracking',
      header: 'מעקב',
      render: (order: any) => (
        <span className={order.tracking ? 'font-mono text-shop-primary text-xs' : 'text-shop-muted'}>
          {order.tracking || '-'}
        </span>
      ),
    },
    {
      key: 'date',
      header: 'תאריך',
      render: (order: any) => (
        <span className="text-shop-muted text-sm">
          {new Date(order.date).toLocaleDateString('he-IL')}
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
        
        <Button
          variant="outline"
          icon={<RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />}
          onClick={loadOrders}
          disabled={isLoading}
        >
          רענן
        </Button>
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
        emptyMessage={isLoading ? "טוען נתונים..." : "אין הזמנות להצגה"}
        emptyIcon={<Package size={48} className="text-shop-border" />}
        isLoading={isLoading}
        onRowClick={(order) => setSelectedOrder(order)}
      />

      {/* Order Detail Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`הזמנה ${selectedOrder?.orderNumber || selectedOrder?.id?.slice(0, 8)}`}
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
                <p className="text-xs font-bold text-shop-muted uppercase mb-1">תאריך</p>
                <p className="font-bold text-shop-primary">
                  {new Date(selectedOrder.date).toLocaleDateString('he-IL')}
                </p>
              </div>
            </div>

            {/* Customer Info */}
            <div>
              <h4 className="text-sm font-black text-shop-primary uppercase mb-3">פרטי לקוח</h4>
              <div className="p-4 bg-shop-bg rounded-xl space-y-1">
                <p className="font-bold text-shop-primary">{selectedOrder.customer}</p>
                <p className="text-sm text-shop-muted">{selectedOrder.email}</p>
                {selectedOrder.phone && <p className="text-sm text-shop-muted">{selectedOrder.phone}</p>}
                {selectedOrder.address && <p className="text-sm text-shop-muted">{selectedOrder.address}</p>}
              </div>
            </div>

            {/* Tracking */}
            <div>
              <h4 className="text-sm font-black text-shop-primary uppercase mb-3">מעקב משלוח</h4>
              <div className="p-4 bg-shop-bg rounded-xl">
                {selectedOrder.tracking ? (
                  <p className="font-mono font-bold text-shop-primary">{selectedOrder.tracking}</p>
                ) : (
                  <p className="text-shop-muted">לא הוזן מספר מעקב</p>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <h4 className="text-sm font-black text-shop-primary uppercase mb-3">סיכום</h4>
              <div className="p-4 bg-shop-cta/10 rounded-xl border border-shop-cta/20">
                <div className="flex justify-between items-center">
                  <span className="text-shop-primary font-bold">סה״כ</span>
                  <span className="font-mono font-black text-2xl text-shop-cta">
                    ${selectedOrder.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Update Status */}
            <div>
              <h4 className="text-sm font-black text-shop-primary uppercase mb-3">עדכון סטטוס</h4>
              <div className="flex gap-2 flex-wrap">
                {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                    disabled={isUpdating || selectedOrder.status === status}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50 ${
                      selectedOrder.status === status
                        ? 'bg-shop-primary text-white'
                        : 'bg-shop-bg text-shop-text-secondary hover:bg-shop-border'
                    }`}
                  >
                    {filters.find(f => f.value === status)?.label || status}
                  </button>
                ))}
              </div>
            </div>

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

export default AllOrders;
