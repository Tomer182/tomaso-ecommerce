/**
 * ALL CUSTOMERS PAGE
 * View customers from all stores
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, ShoppingBag, DollarSign } from 'lucide-react';
import { DataTable } from '../../shared/components/DataTable';
import { Store } from '../../lib/stores';

interface AllCustomersProps {
  currentStore: Store | null;
}

// Mock customers data
const MOCK_CUSTOMERS = [
  {
    id: 'cust-001',
    name: 'דניאל כהן',
    email: 'daniel@email.com',
    store: 'SparkGear',
    orders: 5,
    totalSpent: 749.95,
    lastOrder: '2024-12-27',
  },
  {
    id: 'cust-002',
    name: 'מיכל לוי',
    email: 'michal@email.com',
    store: 'FunHouse',
    orders: 3,
    totalSpent: 189.97,
    lastOrder: '2024-12-26',
  },
  {
    id: 'cust-003',
    name: 'יוסי אברהם',
    email: 'yossi@email.com',
    store: 'SparkGear',
    orders: 2,
    totalSpent: 319.98,
    lastOrder: '2024-12-26',
  },
  {
    id: 'cust-004',
    name: 'רונית שמעון',
    email: 'ronit@email.com',
    store: 'FunHouse',
    orders: 8,
    totalSpent: 599.92,
    lastOrder: '2024-12-25',
  },
];

export const AllCustomers: React.FC<AllCustomersProps> = ({ currentStore }) => {
  // Filter customers by store
  const filteredCustomers = currentStore
    ? MOCK_CUSTOMERS.filter((c) => c.store === currentStore.name)
    : MOCK_CUSTOMERS;

  const columns = [
    {
      key: 'name',
      header: 'שם',
      sortable: true,
      render: (customer: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-shop-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
            {customer.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-shop-primary">{customer.name}</p>
            <p className="text-xs text-shop-muted">{customer.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'store', header: 'חנות' },
    {
      key: 'orders',
      header: 'הזמנות',
      sortable: true,
      render: (customer: any) => (
        <div className="flex items-center gap-2">
          <ShoppingBag size={14} className="text-shop-muted" />
          <span className="font-bold">{customer.orders}</span>
        </div>
      ),
    },
    {
      key: 'totalSpent',
      header: 'סה״כ קניות',
      sortable: true,
      render: (customer: any) => (
        <span className="font-mono font-bold text-shop-cta">
          ${customer.totalSpent.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'lastOrder',
      header: 'הזמנה אחרונה',
      render: (customer: any) => (
        <span className="text-shop-muted">
          {new Date(customer.lastOrder).toLocaleDateString('he-IL')}
        </span>
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
          {currentStore ? `לקוחות - ${currentStore.name}` : 'כל הלקוחות'}
        </motion.h1>
        <p className="text-shop-muted font-bold text-sm">
          {filteredCustomers.length} לקוחות
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-shop-border p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-shop-accent/10 rounded-xl flex items-center justify-center">
            <Users className="text-shop-accent" size={24} />
          </div>
          <div>
            <p className="font-mono font-black text-2xl text-shop-primary">
              {filteredCustomers.length}
            </p>
            <p className="text-xs font-bold text-shop-muted uppercase">לקוחות</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-shop-border p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-shop-cta/10 rounded-xl flex items-center justify-center">
            <DollarSign className="text-shop-cta" size={24} />
          </div>
          <div>
            <p className="font-mono font-black text-2xl text-shop-primary">
              ${filteredCustomers.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(0)}
            </p>
            <p className="text-xs font-bold text-shop-muted uppercase">סה״כ הכנסות</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-shop-border p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <ShoppingBag className="text-purple-600" size={24} />
          </div>
          <div>
            <p className="font-mono font-black text-2xl text-shop-primary">
              {(filteredCustomers.reduce((sum, c) => sum + c.orders, 0) / filteredCustomers.length || 0).toFixed(1)}
            </p>
            <p className="text-xs font-bold text-shop-muted uppercase">ממוצע הזמנות</p>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <DataTable
        columns={columns}
        data={filteredCustomers}
        searchPlaceholder="חפש לקוח..."
        emptyMessage="אין לקוחות להצגה"
        emptyIcon={<Users size={48} className="text-shop-border" />}
      />
    </div>
  );
};

export default AllCustomers;

