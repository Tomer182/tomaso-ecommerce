/**
 * STORE MANAGEMENT PAGE
 * Manage all stores (Owner only)
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Store as StoreIcon,
  Globe,
  Package,
  DollarSign,
  Users,
  Settings,
  ExternalLink,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Button } from '../../shared/components/Button';
import { Store } from '../../lib/stores';

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

        <Button variant="primary" icon={<StoreIcon size={18} />}>
          הוסף חנות חדשה
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
            className="bg-white rounded-[1.5rem] border border-shop-border overflow-hidden shadow-subtle hover:shadow-card-hover transition-all"
          >
            {/* Store Header */}
            <div className="p-6 border-b border-shop-border">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-shop-primary to-shop-secondary rounded-xl flex items-center justify-center shadow-lg">
                    <StoreIcon className="text-white" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-shop-primary">
                      {store.name}
                    </h3>
                    <a
                      href={`https://${store.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-shop-accent hover:underline"
                    >
                      <Globe size={14} />
                      {store.domain}
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                    store.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {store.status === 'active' ? (
                    <CheckCircle size={14} />
                  ) : (
                    <XCircle size={14} />
                  )}
                  {store.status === 'active' ? 'פעיל' : 'לא פעיל'}
                </div>
              </div>
            </div>

            {/* Store Stats */}
            <div className="grid grid-cols-4 divide-x divide-x-reverse divide-shop-border">
              <div className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Package className="text-shop-muted" size={18} />
                </div>
                <p className="font-mono font-black text-lg text-shop-primary">
                  {store.stats?.totalOrders || 0}
                </p>
                <p className="text-[10px] font-bold text-shop-muted uppercase">
                  הזמנות
                </p>
              </div>
              <div className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="text-shop-muted" size={18} />
                </div>
                <p className="font-mono font-black text-lg text-shop-primary">
                  ${store.stats?.totalRevenue || 0}
                </p>
                <p className="text-[10px] font-bold text-shop-muted uppercase">
                  הכנסות
                </p>
              </div>
              <div className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="text-shop-muted" size={18} />
                </div>
                <p className="font-mono font-black text-lg text-shop-primary">
                  {store.stats?.totalCustomers || 0}
                </p>
                <p className="text-[10px] font-bold text-shop-muted uppercase">
                  לקוחות
                </p>
              </div>
              <div className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Package className="text-shop-muted" size={18} />
                </div>
                <p className="font-mono font-black text-lg text-shop-primary">
                  {store.stats?.totalProducts || 0}
                </p>
                <p className="text-[10px] font-bold text-shop-muted uppercase">
                  מוצרים
                </p>
              </div>
            </div>

            {/* Store Actions */}
            <div className="p-4 bg-shop-bg flex gap-3">
              <Button variant="outline" size="sm" className="flex-1">
                <Settings size={14} className="ml-1" />
                הגדרות
              </Button>
              <Button variant="secondary" size="sm" className="flex-1">
                <ExternalLink size={14} className="ml-1" />
                פתח חנות
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {stores.length === 0 && (
        <div className="text-center py-16">
          <StoreIcon className="w-16 h-16 text-shop-border mx-auto mb-4" />
          <h3 className="text-xl font-black text-shop-primary mb-2">
            אין חנויות עדיין
          </h3>
          <p className="text-shop-muted mb-6">
            הוסף את החנות הראשונה שלך כדי להתחיל
          </p>
          <Button variant="primary" icon={<StoreIcon size={18} />}>
            הוסף חנות חדשה
          </Button>
        </div>
      )}
    </div>
  );
};

export default StoreManagement;

