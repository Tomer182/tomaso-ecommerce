/**
 * MY PRODUCTS PAGE
 * Client's products (their store only)
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Plus, Edit, Eye } from 'lucide-react';
import { DataTable } from '../../shared/components/DataTable';
import { Button } from '../../shared/components/Button';
import { Modal } from '../../shared/components/Modal';
import { Input, Textarea, Select } from '../../shared/components/Input';

// Mock products for this store only
const MOCK_PRODUCTS = [
  {
    id: 'prod-001',
    name: 'TWS Pro Earbuds',
    category: 'אוזניות',
    price: 35.00,
    stock: 50,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100',
  },
  {
    id: 'prod-002',
    name: 'Wireless Charger 3-in-1',
    category: 'מטענים',
    price: 35.00,
    stock: 25,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?w=100',
  },
  {
    id: 'prod-003',
    name: 'Smart LED Strip',
    category: 'תאורה',
    price: 15.00,
    stock: 3,
    status: 'low_stock',
    image: 'https://images.unsplash.com/photo-1615764447392-bd0929b5ebaf?w=100',
  },
];

export const MyProducts: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [editProduct, setEditProduct] = useState<any>(null);

  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    if (filter === 'all') return true;
    if (filter === 'low_stock') return product.stock <= 5;
    return product.status === filter;
  });

  const filters = [
    { label: 'הכל', value: 'all' },
    { label: 'פעילים', value: 'active' },
    { label: 'מלאי נמוך', value: 'low_stock' },
  ];

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-bold">אזל</span>;
    }
    if (stock <= 5) {
      return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold animate-pulse">{stock} יח׳</span>;
    }
    return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold">{stock} יח׳</span>;
  };

  const columns = [
    {
      key: 'image',
      header: 'תמונה',
      render: (product: any) => (
        <img
          src={product.image}
          alt={product.name}
          className="w-12 h-12 rounded-lg object-cover"
        />
      ),
    },
    {
      key: 'name',
      header: 'שם מוצר',
      sortable: true,
      render: (product: any) => (
        <div>
          <p className="font-bold text-shop-primary">{product.name}</p>
          <p className="text-xs text-shop-muted">{product.category}</p>
        </div>
      ),
    },
    {
      key: 'price',
      header: 'מחיר',
      sortable: true,
      render: (product: any) => (
        <span className="font-mono font-bold text-shop-primary">${product.price.toFixed(2)}</span>
      ),
    },
    {
      key: 'stock',
      header: 'מלאי',
      sortable: true,
      render: (product: any) => getStockBadge(product.stock),
    },
    {
      key: 'actions',
      header: 'פעולות',
      render: (product: any) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setEditProduct(product);
          }}
          className="p-2 bg-shop-bg rounded-lg hover:bg-shop-border transition-colors"
          title="עריכה"
        >
          <Edit size={16} className="text-shop-primary" />
        </button>
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
            מוצרים
          </motion.h1>
          <p className="text-shop-muted font-bold text-sm">
            {filteredProducts.length} מוצרים
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

      {/* Products Table */}
      <DataTable
        columns={columns}
        data={filteredProducts}
        searchPlaceholder="חפש מוצר..."
        emptyMessage="אין מוצרים להצגה"
        emptyIcon={<ShoppingBag size={48} className="text-shop-border" />}
      />

      {/* Edit Product Modal */}
      <Modal
        isOpen={!!editProduct}
        onClose={() => setEditProduct(null)}
        title="עריכת מוצר"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setEditProduct(null)}>
              ביטול
            </Button>
            <Button variant="primary">שמור שינויים</Button>
          </>
        }
      >
        {editProduct && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-shop-bg rounded-xl">
              <img
                src={editProduct.image}
                alt={editProduct.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <p className="font-bold text-shop-primary">{editProduct.name}</p>
                <p className="text-xs text-shop-muted">{editProduct.category}</p>
              </div>
            </div>
            <Input
              label="מחיר"
              type="number"
              defaultValue={editProduct.price}
            />
            <Input
              label="מלאי"
              type="number"
              defaultValue={editProduct.stock}
            />
            <Select
              label="סטטוס"
              options={[
                { value: 'active', label: 'פעיל' },
                { value: 'inactive', label: 'לא פעיל' },
              ]}
              defaultValue={editProduct.status}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyProducts;

