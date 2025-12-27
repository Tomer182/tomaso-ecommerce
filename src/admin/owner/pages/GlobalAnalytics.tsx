/**
 * GLOBAL ANALYTICS PAGE
 * Analytics across all stores
 */

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, ShoppingBag, Users } from 'lucide-react';
import { StatsCard } from '../../shared/components/StatsCard';
import { LineChart, BarChart, DonutChart } from '../../shared/components/Chart';
import { Store, getGlobalStats } from '../../lib/stores';

interface GlobalAnalyticsProps {
  stores: Store[];
  currentStore: Store | null;
}

export const GlobalAnalytics: React.FC<GlobalAnalyticsProps> = ({
  stores,
  currentStore,
}) => {
  const stats = getGlobalStats();

  // Mock data
  const revenueData = [
    { label: 'ינואר', value: 12500 },
    { label: 'פברואר', value: 15800 },
    { label: 'מרץ', value: 14200 },
    { label: 'אפריל', value: 18500 },
    { label: 'מאי', value: 21000 },
    { label: 'יוני', value: 19800 },
  ];

  const categoryData = [
    { label: 'אוזניות', value: 4500 },
    { label: 'מטענים', value: 3200 },
    { label: 'תאורה', value: 2800 },
    { label: 'גאדג׳טים', value: 2100 },
    { label: 'אחר', value: 1200 },
  ];

  const storeRevenueData = stores.map((store) => ({
    label: store.name,
    value: Math.random() * 10000 + 5000,
    color: store.id === 'sparkgear' ? '#16A34A' : '#F59E0B',
  }));

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-black text-shop-primary tracking-tight mb-2"
        >
          {currentStore ? `אנליטיקס - ${currentStore.name}` : 'אנליטיקס גלובלי'}
        </motion.h1>
        <p className="text-shop-muted font-bold text-sm">
          נתונים מצטברים מכל החנויות
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="הכנסות החודש"
          value="$24,580"
          change={15.3}
          changeLabel="vs חודש קודם"
          icon={<DollarSign size={24} />}
          iconBg="bg-shop-cta"
          delay={0}
        />
        <StatsCard
          title="הזמנות החודש"
          value="186"
          change={8.7}
          changeLabel="vs חודש קודם"
          icon={<ShoppingBag size={24} />}
          iconBg="bg-shop-accent"
          delay={0.1}
        />
        <StatsCard
          title="לקוחות חדשים"
          value="42"
          change={12.5}
          changeLabel="השבוע"
          icon={<Users size={24} />}
          iconBg="bg-purple-500"
          delay={0.2}
        />
        <StatsCard
          title="שיעור המרה"
          value="3.2%"
          change={0.5}
          changeLabel="vs חודש קודם"
          icon={<TrendingUp size={24} />}
          iconBg="bg-amber-500"
          delay={0.3}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <LineChart
            data={revenueData}
            title="הכנסות חודשיות"
            color="#16A34A"
            height={220}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <BarChart
            data={categoryData}
            title="מכירות לפי קטגוריה"
            color="#2563EB"
            height={220}
          />
        </motion.div>
      </div>

      {/* Store Comparison */}
      {!currentStore && stores.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <DonutChart
            data={storeRevenueData}
            title="הכנסות לפי חנות"
            size={180}
          />
        </motion.div>
      )}

      {/* Top Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-[1.5rem] border border-shop-border p-6"
      >
        <h3 className="text-lg font-black text-shop-primary uppercase tracking-tight mb-6">
          מוצרים מובילים
        </h3>
        <div className="space-y-4">
          {[
            { name: 'TWS Pro Earbuds', sales: 45, revenue: 1575 },
            { name: 'Wireless Charger 3-in-1', sales: 38, revenue: 1330 },
            { name: 'Disco Ball Light', sales: 32, revenue: 800 },
            { name: 'Smart LED Strip', sales: 28, revenue: 420 },
            { name: 'Lava Lamp XL', sales: 24, revenue: 840 },
          ].map((product, index) => (
            <div
              key={product.name}
              className="flex items-center gap-4 p-4 bg-shop-bg rounded-xl"
            >
              <div className="w-8 h-8 bg-shop-primary text-white rounded-lg flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="font-bold text-shop-primary">{product.name}</p>
                <p className="text-xs text-shop-muted">{product.sales} מכירות</p>
              </div>
              <div className="text-left">
                <p className="font-mono font-bold text-shop-cta">
                  ${product.revenue}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default GlobalAnalytics;

