/**
 * OWNER DASHBOARD
 * Global Command Center with stats from all stores
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  DollarSign,
  Users,
  ShoppingBag,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle,
  Store as StoreIcon,
} from 'lucide-react';
import { StatsCard } from '../../shared/components/StatsCard';
import { LineChart, DonutChart } from '../../shared/components/Chart';
import { DataTable } from '../../shared/components/DataTable';
import { Store, getGlobalStats } from '../../lib/stores';

interface OwnerDashboardProps {
  stores: Store[];
  currentStore: Store | null;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  stores,
  currentStore,
}) => {
  const globalStats = getGlobalStats();

  // Mock data for charts
  const salesData = [
    { label: 'א׳', value: 1200 },
    { label: 'ב׳', value: 1900 },
    { label: 'ג׳', value: 1500 },
    { label: 'ד׳', value: 2100 },
    { label: 'ה׳', value: 1800 },
    { label: 'ו׳', value: 2400 },
    { label: 'ש׳', value: 2800 },
  ];

  const orderStatusData = [
    { label: 'ממתינות', value: 12, color: '#F59E0B' },
    { label: 'בטיפול', value: 8, color: '#3B82F6' },
    { label: 'נשלחו', value: 24, color: '#22C55E' },
    { label: 'בוטלו', value: 3, color: '#EF4444' },
  ];

  // Mock recent orders
  const recentOrders = [
    {
      id: 'ORD-001',
      customer: 'דניאל כהן',
      store: 'SparkGear',
      total: 249.99,
      status: 'pending',
      date: '2024-12-27',
    },
    {
      id: 'ORD-002',
      customer: 'מיכל לוי',
      store: 'FunHouse',
      total: 89.99,
      status: 'shipped',
      date: '2024-12-27',
    },
    {
      id: 'ORD-003',
      customer: 'יוסי אברהם',
      store: 'SparkGear',
      total: 159.99,
      status: 'processing',
      date: '2024-12-26',
    },
  ];

  const orderColumns = [
    { key: 'id', header: 'מספר הזמנה', sortable: true },
    { key: 'customer', header: 'לקוח' },
    { key: 'store', header: 'חנות' },
    {
      key: 'total',
      header: 'סכום',
      render: (order: any) => (
        <span className="font-mono font-bold">${order.total.toFixed(2)}</span>
      ),
    },
    {
      key: 'status',
      header: 'סטטוס',
      render: (order: any) => {
        const statusStyles: any = {
          pending: 'bg-amber-100 text-amber-700',
          processing: 'bg-blue-100 text-blue-700',
          shipped: 'bg-green-100 text-green-700',
          cancelled: 'bg-red-100 text-red-700',
        };
        const statusLabels: any = {
          pending: 'ממתין',
          processing: 'בטיפול',
          shipped: 'נשלח',
          cancelled: 'בוטל',
        };
        return (
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${statusStyles[order.status]}`}
          >
            {statusLabels[order.status]}
          </span>
        );
      },
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
          {currentStore ? currentStore.name : 'מרכז פיקוד גלובלי'}
        </motion.h1>
        <p className="text-shop-muted font-bold text-sm">
          {currentStore
            ? `סטטיסטיקות עבור ${currentStore.domain}`
            : `סטטיסטיקות מצטברות מ-${stores.length} חנויות`}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="סה״כ הזמנות"
          value={globalStats.totalOrders.toLocaleString()}
          change={12.5}
          changeLabel="vs אתמול"
          icon={<Package size={24} />}
          iconBg="bg-shop-accent"
          delay={0}
        />
        <StatsCard
          title="הכנסות"
          value={`$${globalStats.totalRevenue.toLocaleString()}`}
          change={8.2}
          changeLabel="vs אתמול"
          icon={<DollarSign size={24} />}
          iconBg="bg-shop-cta"
          delay={0.1}
        />
        <StatsCard
          title="לקוחות"
          value={globalStats.totalCustomers.toLocaleString()}
          change={5.1}
          changeLabel="חדשים השבוע"
          icon={<Users size={24} />}
          iconBg="bg-purple-500"
          delay={0.2}
        />
        <StatsCard
          title="מוצרים"
          value={globalStats.totalProducts.toLocaleString()}
          icon={<ShoppingBag size={24} />}
          iconBg="bg-amber-500"
          delay={0.3}
        />
      </div>

      {/* Stores Overview (if no specific store selected) */}
      {!currentStore && stores.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[1.5rem] border border-shop-border p-6 mb-8"
        >
          <h3 className="text-lg font-black text-shop-primary uppercase tracking-tight mb-4">
            סקירת חנויות
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stores.map((store) => (
              <div
                key={store.id}
                className="flex items-center gap-4 p-4 bg-shop-bg rounded-xl border border-shop-border"
              >
                <div className="w-12 h-12 bg-shop-primary rounded-xl flex items-center justify-center">
                  <StoreIcon className="text-white" size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-shop-primary">{store.name}</h4>
                  <p className="text-xs text-shop-muted">{store.domain}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-shop-primary">
                    {store.stats?.totalOrders || 0}
                  </p>
                  <p className="text-xs text-shop-muted">הזמנות</p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    store.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {store.status === 'active' ? 'פעיל' : 'לא פעיל'}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

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

      {/* Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-[1.5rem] border border-shop-border p-6 mb-8"
      >
        <h3 className="text-lg font-black text-shop-primary uppercase tracking-tight mb-4">
          התראות מערכת
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <AlertCircle className="text-amber-600 flex-shrink-0" size={20} />
            <div className="flex-1">
              <p className="text-sm font-bold text-amber-800">
                12 הזמנות ממתינות לטיפול
              </p>
              <p className="text-xs text-amber-600">יש לטפל בהזמנות בהקדם</p>
            </div>
            <button className="px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition-colors">
              צפה
            </button>
          </div>

          <div className="flex items-center gap-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <div className="flex-1">
              <p className="text-sm font-bold text-red-800">
                3 מוצרים עם מלאי נמוך
              </p>
              <p className="text-xs text-red-600">כדאי להזמין מלאי נוסף</p>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors">
              צפה
            </button>
          </div>

          <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-xl">
            <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
            <div className="flex-1">
              <p className="text-sm font-bold text-green-800">
                כל הספקים מחוברים
              </p>
              <p className="text-xs text-green-600">CJDropshipping פעיל</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
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

export default OwnerDashboard;

