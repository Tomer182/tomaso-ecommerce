/**
 * CLIENT DASHBOARD
 * Store owner's main dashboard (limited to their store only)
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  DollarSign,
  Users,
  ShoppingBag,
  Clock,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { StatsCard } from '../../shared/components/StatsCard';
import { LineChart, DonutChart } from '../../shared/components/Chart';
import { DataTable } from '../../shared/components/DataTable';

interface ClientDashboardProps {
  storeName: string;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({ storeName }) => {
  // Mock stats for the store
  const storeStats = {
    totalOrders: 24,
    totalRevenue: 3580,
    totalCustomers: 18,
    pendingOrders: 5,
  };

  // Mock data
  const salesData = [
    { label: 'א׳', value: 320 },
    { label: 'ב׳', value: 450 },
    { label: 'ג׳', value: 380 },
    { label: 'ד׳', value: 520 },
    { label: 'ה׳', value: 410 },
    { label: 'ו׳', value: 680 },
    { label: 'ש׳', value: 820 },
  ];

  const orderStatusData = [
    { label: 'ממתינות', value: 5, color: '#F59E0B' },
    { label: 'בטיפול', value: 3, color: '#3B82F6' },
    { label: 'נשלחו', value: 12, color: '#22C55E' },
    { label: 'הושלמו', value: 4, color: '#10B981' },
  ];

  // Mock recent orders
  const recentOrders = [
    {
      id: 'ORD-001',
      customer: 'דניאל כהן',
      items: 2,
      total: 129.99,
      status: 'pending',
      date: '2024-12-27',
    },
    {
      id: 'ORD-002',
      customer: 'מיכל לוי',
      items: 1,
      total: 49.99,
      status: 'shipped',
      date: '2024-12-27',
    },
    {
      id: 'ORD-003',
      customer: 'יוסי אברהם',
      items: 3,
      total: 189.99,
      status: 'processing',
      date: '2024-12-26',
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles: any = {
      pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'ממתין' },
      processing: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'בטיפול' },
      shipped: { bg: 'bg-green-100', text: 'text-green-700', label: 'נשלח' },
      delivered: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'הושלם' },
    };
    const style = styles[status] || styles.pending;
    return (
      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  };

  const orderColumns = [
    { key: 'id', header: 'מספר', sortable: true },
    { key: 'customer', header: 'לקוח' },
    { key: 'items', header: 'פריטים' },
    {
      key: 'total',
      header: 'סכום',
      render: (order: any) => (
        <span className="font-mono font-bold text-shop-cta">${order.total.toFixed(2)}</span>
      ),
    },
    {
      key: 'status',
      header: 'סטטוס',
      render: (order: any) => getStatusBadge(order.status),
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
          שלום! 👋
        </motion.h1>
        <p className="text-shop-muted font-bold text-sm">
          ברוכים הבאים ללוח הבקרה של {storeName}
        </p>
      </div>

      {/* Alert for pending orders */}
      {storeStats.pendingOrders > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6"
        >
          <AlertCircle className="text-amber-600 flex-shrink-0" size={20} />
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-800">
              יש לך {storeStats.pendingOrders} הזמנות ממתינות לטיפול
            </p>
          </div>
          <button className="px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition-colors">
            צפה בהזמנות
          </button>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="הזמנות החודש"
          value={storeStats.totalOrders}
          change={8.5}
          changeLabel="vs חודש קודם"
          icon={<Package size={24} />}
          iconBg="bg-shop-accent"
          delay={0}
        />
        <StatsCard
          title="הכנסות"
          value={`$${storeStats.totalRevenue.toLocaleString()}`}
          change={12.3}
          changeLabel="vs חודש קודם"
          icon={<DollarSign size={24} />}
          iconBg="bg-shop-cta"
          delay={0.1}
        />
        <StatsCard
          title="לקוחות"
          value={storeStats.totalCustomers}
          change={5.2}
          changeLabel="חדשים השבוע"
          icon={<Users size={24} />}
          iconBg="bg-purple-500"
          delay={0.2}
        />
        <StatsCard
          title="ממתינות"
          value={storeStats.pendingOrders}
          icon={<Clock size={24} />}
          iconBg="bg-amber-500"
          delay={0.3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <LineChart
            data={salesData}
            title="מכירות ב-7 ימים אחרונים"
            color="#16A34A"
            height={200}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <DonutChart
            data={orderStatusData}
            title="סטטוס הזמנות"
            size={160}
          />
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <DataTable
          title="הזמנות אחרונות"
          columns={orderColumns}
          data={recentOrders}
          searchPlaceholder="חפש הזמנה..."
          emptyMessage="אין הזמנות עדיין"
          onRowClick={(order) => console.log('View order:', order)}
        />
      </motion.div>
    </div>
  );
};

export default ClientDashboard;

