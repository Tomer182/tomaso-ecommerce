/**
 * STORE MANAGEMENT PAGE - Connected to Real Data
 * Manage all e-commerce stores
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Store as StoreIcon,
  Settings,
  ExternalLink,
  Package,
  DollarSign,
  Users,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../../shared/components/Button';
import { Store } from '../../lib/adminApi';

interface StoreManagementProps {
  stores: Store[];
  onRefresh: () => void;
}

export const StoreManagement: React.FC<StoreManagementProps> = ({
  stores,
  onRefresh,
}) => {
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
            ניהול חנויות
          </motion.h1>
          <p className="text-shop-muted font-bold text-sm">
            {stores.length} חנויות פעילות
          </p>
        </div>

        <Button
          variant="outline"
          icon={<RefreshCw size={16} />}
          onClick={onRefresh}
        >
          רענן
        </Button>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stores.map((store, index) => (
          <motion.div
            key={store.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-[1.5rem] border border-shop-border overflow-hidden"
          >
            {/* Store Header */}
            <div className="p-6 border-b border-shop-border bg-gradient-to-l from-shop-bg to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-shop-primary rounded-2xl flex items-center justify-center shadow-lg">
                    <StoreIcon className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-shop-primary">{store.name}</h3>
                    <a
                      href={`https://${store.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-shop-muted hover:text-shop-primary flex items-center gap-1 transition-colors"
                    >
                      {store.domain}
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>

                {/* Status Badge */}
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
                    store.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {store.status === 'active' ? (
                    <CheckCircle size={14} />
                  ) : (
                    <AlertCircle size={14} />
                  )}
                  <span className="text-xs font-bold uppercase">
                    {store.status === 'active' ? 'פעיל' : 'לא פעיל'}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 divide-x divide-shop-border rtl:divide-x-reverse">
              <div className="p-4 text-center">
                <Package size={18} className="mx-auto text-shop-muted mb-1" />
                <p className="font-mono font-bold text-lg text-shop-primary">
                  {store.stats?.totalOrders || 0}
                </p>
                <p className="text-[10px] font-bold text-shop-muted uppercase">הזמנות</p>
              </div>
              <div className="p-4 text-center">
                <DollarSign size={18} className="mx-auto text-shop-cta mb-1" />
                <p className="font-mono font-bold text-lg text-shop-cta">
                  ${store.stats?.totalRevenue?.toLocaleString() || 0}
                </p>
                <p className="text-[10px] font-bold text-shop-muted uppercase">הכנסות</p>
              </div>
              <div className="p-4 text-center">
                <Users size={18} className="mx-auto text-purple-500 mb-1" />
                <p className="font-mono font-bold text-lg text-shop-primary">
                  {store.stats?.totalCustomers || 0}
                </p>
                <p className="text-[10px] font-bold text-shop-muted uppercase">לקוחות</p>
              </div>
              <div className="p-4 text-center">
                <Package size={18} className="mx-auto text-amber-500 mb-1" />
                <p className="font-mono font-bold text-lg text-shop-primary">
                  {store.stats?.totalProducts || 0}
                </p>
                <p className="text-[10px] font-bold text-shop-muted uppercase">מוצרים</p>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-shop-bg/50 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={<Settings size={14} />}
                className="flex-1"
              >
                הגדרות
              </Button>
              <a
                href={`https://${store.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button
                  variant="outline"
                  size="sm"
                  icon={<ExternalLink size={14} />}
                  className="w-full"
                >
                  בקר באתר
                </Button>
              </a>
            </div>
          </motion.div>
        ))}

        {/* Add New Store Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: stores.length * 0.1 }}
          className="bg-white rounded-[1.5rem] border-2 border-dashed border-shop-border overflow-hidden flex items-center justify-center min-h-[280px] hover:border-shop-primary/30 transition-colors cursor-pointer group"
        >
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-shop-bg rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-shop-primary/10 transition-colors">
              <StoreIcon className="text-shop-muted group-hover:text-shop-primary" size={28} />
            </div>
            <h3 className="font-bold text-shop-muted group-hover:text-shop-primary transition-colors">
              הוסף חנות חדשה
            </h3>
            <p className="text-xs text-shop-muted mt-1">
              חבר אתר נוסף למערכת הניהול
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StoreManagement;
