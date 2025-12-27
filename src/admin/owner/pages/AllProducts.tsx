/**
 * ALL PRODUCTS PAGE
 * Manage products from all stores
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Plus, Edit, Trash2, Eye, Package } from 'lucide-react';
import { DataTable } from '../../shared/components/DataTable';
import { Button } from '../../shared/components/Button';
import { Modal, ConfirmModal } from '../../shared/components/Modal';
import { Input, Textarea, Select } from '../../shared/components/Input';
import { Store } from '../../lib/stores';

interface AllProductsProps {
  currentStore: Store | null;
}

// Mock products data
const MOCK_PRODUCTS = [
  {
    id: 'prod-001',
    name: 'TWS Pro Earbuds',
    category: 'אוזניות',
    store: 'SparkGear',
    price: 35.00,
    cost: 12.00,
    stock: 50,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100',
  },
  {
    id: 'prod-002',
    name: 'Wireless Charger 3-in-1',
    category: 'מטענים',
    store: 'SparkGear',
    price: 35.00,
    cost: 12.00,
    stock: 25,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?w=100',
  },
  {
    id: 'prod-003',
    name: 'Disco Ball Light',
    category: 'תאורה',
    store: 'FunHouse',
    price: 24.99,
    cost: 11.50,
    stock: 30,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=100',
  },
  {
    id: 'prod-004',
    name: 'Lava Lamp XL',
    category: 'רטרו',
    store: 'FunHouse',
    price: 34.99,
    cost: 19.00,
    stock: 5,
    status: 'low_stock',
    image: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=100',
  },
  {
    id: 'prod-005',
    name: 'Smart LED Strip',
    category: 'תאורה',
    store: 'SparkGear',
    price: 15.00,
    cost: 5.00,
    stock: 0,
    status: 'out_of_stock',
    image: 'https://images.unsplash.com/photo-1615764447392-bd0929b5ebaf?w=100',
  },
];

export const AllProducts: React.FC<AllProductsProps> = ({ currentStore }) => {
  const [filter, setFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [deleteProduct, setDeleteProduct] = useState<any>(null);

  // Filter products
  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    if (currentStore && product.store !== currentStore.name) return false;
    if (filter === 'low_stock') return product.stock <= 5 && product.stock > 0;
    if (filter === 'out_of_stock') return product.stock === 0;
    if (filter !== 'all' && product.status !== filter) return false;
    return true;
  });

  const filters = [
    { label: 'הכל', value: 'all' },
    { label: 'פעילים', value: 'active' },
    { label: 'מלאי נמוך', value: 'low_stock' },
    { label: 'אזל המלאי', value: 'out_of_stock' },
  ];

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-bold">אזל</span>;
    }
    if (stock <= 5) {
      return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold">{stock} יח׳</span>;
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
    { key: 'store', header: 'חנות' },
    {
      key: 'price',
      header: 'מחיר',
      sortable: true,
      render: (product: any) => (
        <span className="font-mono font-bold text-shop-primary">${product.price.toFixed(2)}</span>
      ),
    },
    {
      key: 'cost',
      header: 'עלות',
      render: (product: any) => (
        <span className="font-mono text-shop-muted">${product.cost.toFixed(2)}</span>
      ),
    },
    {
      key: 'profit',
      header: 'רווח',
      render: (product: any) => {
        const profit = product.price - product.cost;
        const margin = ((profit / product.price) * 100).toFixed(0);
        return (
          <div>
            <span className="font-mono font-bold text-shop-cta">${profit.toFixed(2)}</span>
            <span className="text-xs text-shop-muted mr-1">({margin}%)</span>
          </div>
        );
      },
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
        <div className="flex gap-2">
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteProduct(product);
            }}
            className="p-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            title="מחיקה"
          >
            <Trash2 size={16} className="text-red-600" />
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
            {currentStore ? `מוצרים - ${currentStore.name}` : 'כל המוצרים'}
          </motion.h1>
          <p className="text-shop-muted font-bold text-sm">
            {filteredProducts.length} מוצרים
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus size={18} />}
          onClick={() => setIsAddModalOpen(true)}
        >
          הוסף מוצר
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

      {/* Products Table */}
      <DataTable
        columns={columns}
        data={filteredProducts}
        searchPlaceholder="חפש מוצר..."
        emptyMessage="אין מוצרים להצגה"
        emptyIcon={<ShoppingBag size={48} className="text-shop-border" />}
      />

      {/* Add/Edit Product Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editProduct}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditProduct(null);
        }}
        title={editProduct ? 'עריכת מוצר' : 'הוספת מוצר חדש'}
        size="lg"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditProduct(null);
              }}
            >
              ביטול
            </Button>
            <Button variant="primary">
              {editProduct ? 'שמור שינויים' : 'הוסף מוצר'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="שם מוצר"
            placeholder="הזן שם מוצר"
            defaultValue={editProduct?.name}
          />
          <Textarea
            label="תיאור"
            placeholder="הזן תיאור מוצר"
            rows={3}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="מחיר"
              type="number"
              placeholder="0.00"
              defaultValue={editProduct?.price}
            />
            <Input
              label="עלות"
              type="number"
              placeholder="0.00"
              defaultValue={editProduct?.cost}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="קטגוריה"
              options={[
                { value: 'אוזניות', label: 'אוזניות' },
                { value: 'מטענים', label: 'מטענים' },
                { value: 'תאורה', label: 'תאורה' },
                { value: 'רטרו', label: 'רטרו' },
              ]}
              defaultValue={editProduct?.category}
            />
            <Input
              label="מלאי"
              type="number"
              placeholder="0"
              defaultValue={editProduct?.stock}
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteProduct}
        onClose={() => setDeleteProduct(null)}
        onConfirm={() => {
          console.log('Delete product:', deleteProduct?.id);
          setDeleteProduct(null);
        }}
        title="מחיקת מוצר"
        message={`האם אתה בטוח שברצונך למחוק את המוצר "${deleteProduct?.name}"? פעולה זו לא ניתנת לביטול.`}
        confirmText="מחק"
        cancelText="ביטול"
        variant="danger"
      />
    </div>
  );
};

export default AllProducts;

