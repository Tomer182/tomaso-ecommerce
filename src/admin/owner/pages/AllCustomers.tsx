/**
 * ALL CUSTOMERS PAGE - Connected to Real Data
 * View and manage customers from all stores
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, Phone, MapPin, RefreshCw, Eye } from 'lucide-react';
import { DataTable } from '../../shared/components/DataTable';
import { Button } from '../../shared/components/Button';
import { Modal } from '../../shared/components/Modal';
import { Store, fetchCustomers, formatCustomer } from '../../lib/adminApi';

interface AllCustomersProps {
  currentStore: Store | null;
}

export const AllCustomers: React.FC<AllCustomersProps> = ({ currentStore }) => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadCustomers = async () => {
    setIsLoading(true);
    try {
      const data = await fetchCustomers();
      const formatted = data.map(formatCustomer);
      
      // Filter by current store if selected
      const filtered = currentStore 
        ? formatted.filter(c => c.storeId === currentStore.id)
        : formatted;
      
      setCustomers(filtered);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [currentStore]);

  const columns = [
    {
      key: 'name',
      header: 'לקוח',
      sortable: true,
      render: (customer: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-shop-primary/10 flex items-center justify-center">
            <span className="text-shop-primary font-bold text-sm">
              {customer.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-bold text-shop-primary">{customer.name}</p>
            <p className="text-xs text-shop-muted">{customer.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'orders',
      header: 'הזמנות',
      sortable: true,
      render: (customer: any) => (
        <span className="font-mono font-bold text-shop-primary">{customer.orders}</span>
      ),
    },
    {
      key: 'totalSpent',
      header: 'סה״כ רכישות',
      sortable: true,
      render: (customer: any) => (
        <span className="font-mono font-bold text-shop-cta">${customer.totalSpent.toFixed(2)}</span>
      ),
    },
    {
      key: 'lastOrder',
      header: 'הזמנה אחרונה',
      render: (customer: any) => (
        <span className="text-shop-muted text-sm">
          {new Date(customer.lastOrder).toLocaleDateString('he-IL')}
        </span>
      ),
    },
    {
      key: 'storeId',
      header: 'חנות',
      render: (customer: any) => (
        <span className="text-sm text-shop-muted capitalize">{customer.storeId}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (customer: any) => (
        <button
          onClick={() => setSelectedCustomer(customer)}
          className="p-2 bg-shop-bg rounded-lg hover:bg-shop-border transition-colors"
        >
          <Eye size={16} className="text-shop-primary" />
        </button>
      ),
    },
  ];

  // Stats
  const statsData = {
    total: customers.length,
    totalSpent: customers.reduce((sum, c) => sum + c.totalSpent, 0),
    avgOrderValue: customers.length > 0 
      ? customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.reduce((sum, c) => sum + c.orders, 0) 
      : 0,
  };

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
            {currentStore ? `לקוחות - ${currentStore.name}` : 'כל הלקוחות'}
          </motion.h1>
          <p className="text-shop-muted font-bold text-sm">
            {customers.length} לקוחות
          </p>
        </div>
        
        <Button
          variant="outline"
          icon={<RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />}
          onClick={loadCustomers}
          disabled={isLoading}
        >
          רענן
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-shop-border p-4 text-center">
          <p className="font-mono font-bold text-2xl text-shop-primary">{statsData.total}</p>
          <p className="text-xs font-bold text-shop-muted">סה״כ לקוחות</p>
        </div>
        <div className="bg-white rounded-xl border border-shop-border p-4 text-center">
          <p className="font-mono font-bold text-2xl text-shop-cta">${statsData.totalSpent.toLocaleString()}</p>
          <p className="text-xs font-bold text-shop-muted">סה״כ רכישות</p>
        </div>
        <div className="bg-white rounded-xl border border-shop-border p-4 text-center">
          <p className="font-mono font-bold text-2xl text-purple-600">${statsData.avgOrderValue.toFixed(0)}</p>
          <p className="text-xs font-bold text-shop-muted">ממוצע להזמנה</p>
        </div>
      </div>

      {/* Customers Table */}
      <DataTable
        columns={columns}
        data={customers}
        searchPlaceholder="חפש לקוח לפי שם או אימייל..."
        emptyMessage={isLoading ? "טוען נתונים..." : "אין לקוחות להצגה"}
        emptyIcon={<Users size={48} className="text-shop-border" />}
        isLoading={isLoading}
        onRowClick={(customer) => setSelectedCustomer(customer)}
      />

      {/* Customer Detail Modal */}
      <Modal
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        title="פרטי לקוח"
        size="md"
      >
        {selectedCustomer && (
          <div className="space-y-6">
            {/* Customer Header */}
            <div className="flex items-center gap-4 p-4 bg-shop-bg rounded-xl">
              <div className="w-16 h-16 rounded-full bg-shop-primary flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {selectedCustomer.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-black text-shop-primary">{selectedCustomer.name}</h3>
                <p className="text-shop-muted">{selectedCustomer.email}</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-shop-bg/50 rounded-lg">
                <Mail size={18} className="text-shop-muted" />
                <span className="text-shop-primary">{selectedCustomer.email}</span>
              </div>
              {selectedCustomer.phone && (
                <div className="flex items-center gap-3 p-3 bg-shop-bg/50 rounded-lg">
                  <Phone size={18} className="text-shop-muted" />
                  <span className="text-shop-primary">{selectedCustomer.phone}</span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-shop-bg rounded-xl text-center">
                <p className="font-mono font-bold text-2xl text-shop-primary">{selectedCustomer.orders}</p>
                <p className="text-xs font-bold text-shop-muted">הזמנות</p>
              </div>
              <div className="p-4 bg-shop-cta/10 rounded-xl text-center">
                <p className="font-mono font-bold text-2xl text-shop-cta">
                  ${selectedCustomer.totalSpent.toFixed(2)}
                </p>
                <p className="text-xs font-bold text-shop-muted">סה״כ רכישות</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setSelectedCustomer(null)}>
                סגור
              </Button>
              <Button icon={<Mail size={16} />}>
                שלח אימייל
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AllCustomers;
