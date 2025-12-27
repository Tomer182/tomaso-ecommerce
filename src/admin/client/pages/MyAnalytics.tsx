/**
 * MY ANALYTICS PAGE
 * Client's store analytics
 */

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, ShoppingBag, Users } from 'lucide-react';
import { StatsCard } from '../../shared/components/StatsCard';
import { LineChart, BarChart, DonutChart } from '../../shared/components/Chart';

export const MyAnalytics: React.FC = () => {
  // Mock data
  const revenueData = [
    { label: 'שבוע 1', value: 1250 },
    { label: 'שבוע 2', value: 1580 },
    { label: 'שבוע 3', value: 1420 },
    { label: 'שבוע 4', value: 1850 },
  ];

  const categoryData = [
    { label: 'אוזניות', value: 450 },
    { label: 'מטענים', value: 320 },
    { label: 'תאורה', value: 280 },
    { label: 'אחר', value: 120 },
  ];

  const orderSourceData = [
    { label: 'אורגני', value: 45, color: '#16A34A' },
    { label: 'ישיר', value: 30, color: '#2563EB' },
    { label: 'רשתות חברתיות', value: 15, color: '#8B5CF6' },
    { label: 'אחר', value: 10, color: '#94A3B8' },
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
          אנליטיקס
        </motion.h1>
        <p className="text-shop-muted font-bold text-sm">
          נתוני ביצועים של החנות שלך
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="הכנסות החודש"
          value="$6,100"
          change={15.3}
          changeLabel="vs חודש קודם"
          icon={<DollarSign size={24} />}
          iconBg="bg-shop-cta"
          delay={0}
        />
        <StatsCard
          title="הזמנות"
          value="48"
          change={8.7}
          changeLabel="vs חודש קודם"
          icon={<ShoppingBag size={24} />}
          iconBg="bg-shop-accent"
          delay={0.1}
        />
        <StatsCard
          title="לקוחות חדשים"
          value="12"
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <LineChart
            data={revenueData}
            title="הכנסות שבועיות"
            color="#16A34A"
            height={200}
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
            height={200}
          />
        </motion.div>
      </div>

      {/* Traffic Sources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <DonutChart
          data={orderSourceData}
          title="מקורות תנועה"
          size={160}
        />
      </motion.div>

      {/* Top Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 bg-white rounded-[1.5rem] border border-shop-border p-6"
      >
        <h3 className="text-lg font-black text-shop-primary uppercase tracking-tight mb-6">
          מוצרים מובילים
        </h3>
        <div className="space-y-4">
          {[
            { name: 'TWS Pro Earbuds', sales: 24, revenue: 840 },
            { name: 'Wireless Charger 3-in-1', sales: 18, revenue: 630 },
            { name: 'Smart LED Strip', sales: 15, revenue: 225 },
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

export default MyAnalytics;

