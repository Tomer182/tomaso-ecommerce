/**
 * ALL PRODUCTS PAGE - Connected to Real Data
 * View and manage products from all stores
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, Edit, RefreshCw, AlertCircle } from 'lucide-react';
import { DataTable } from '../../shared/components/DataTable';
import { Button } from '../../shared/components/Button';
import { Store, fetchProducts, formatProduct } from '../../lib/adminApi';

interface AllProductsProps {
  currentStore: Store | null;
}

export const AllProducts: React.FC<AllProductsProps> = ({ currentStore }) => {
  const [filter, setFilter] = useState('all');
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await fetchProducts();
      const formatted = data.map(formatProduct);
      
      // Filter by current store if selected
      const filtered = currentStore 
        ? formatted.filter(p => p.storeId === currentStore.id)
        : formatted;
      
      setProducts(filtered);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [currentStore]);

  // Filter products by status
  const filteredProducts = products.filter((product) => {
    if (filter === 'all') return true;
    return product.status === filter;
  });

  const filters = [
    { label: 'הכל', value: 'all' },
    { label: 'פעיל', value: 'active' },
    { label: 'מלאי נמוך', value: 'low_stock' },
    { label: 'אזל', value: 'out_of_stock' },
  ];

  const getStatusBadge = (status: string) => {
    const styles: any = {
      active: 'bg-green-100 text-green-700',
      low_stock: 'bg-amber-100 text-amber-700',
      out_of_stock: 'bg-red-100 text-red-700',
    };
    const labels: any = {
      active: 'פעיל',
      low_stock: 'מלאי נמוך',
      out_of_stock: 'אזל',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${styles[status] || styles.active}`}>
        {labels[status] || status}
      </span>
    );
  };

  const columns = [
    {
      key: 'image',
      header: '',
      render: (product: any) => (
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-shop-bg flex-shrink-0">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
      ),
    },
    {
      key: 'name',
      header: 'מוצר',
      sortable: true,
      render: (product: any) => (
        <div className="flex items-center gap-3">
          <div>
            <p className="font-bold text-shop-primary">{product.name}</p>
            <p className="text-xs text-shop-muted">{product.category}</p>
          </div>
          {product.isNew && (
            <span className="px-2 py-0.5 bg-shop-accent text-white text-[9px] font-bold rounded-full">NEW</span>
          )}
          {product.isBestSeller && (
            <span className="px-2 py-0.5 bg-shop-cta text-white text-[9px] font-bold rounded-full">BEST</span>
          )}
          {product.isSale && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full">SALE</span>
          )}
        </div>
      ),
    },
    {
      key: 'price',
      header: 'מחיר',
      sortable: true,
      render: (product: any) => (
        <div>
          <span className="font-mono font-bold text-shop-cta">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-xs text-shop-muted line-through ml-2">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'stock',
      header: 'מלאי',
      sortable: true,
      render: (product: any) => (
        <div className="flex items-center gap-2">
          <span className={`font-mono font-bold ${product.stock <= 5 ? 'text-red-600' : 'text-shop-primary'}`}>
            {product.stock}
          </span>
          {product.stock <= 5 && product.stock > 0 && (
            <AlertCircle size={14} className="text-amber-500" />
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'סטטוס',
      render: (product: any) => getStatusBadge(product.status),
    },
    {
      key: 'storeId',
      header: 'חנות',
      render: (product: any) => (
        <span className="text-sm text-shop-muted capitalize">{product.storeId}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (product: any) => (
        <button className="p-2 bg-shop-bg rounded-lg hover:bg-shop-border transition-colors">
          <Edit size={16} className="text-shop-primary" />
        </button>
      ),
    },
  ];

  // Stats
  const statsData = {
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    lowStock: products.filter(p => p.status === 'low_stock').length,
    outOfStock: products.filter(p => p.status === 'out_of_stock').length,
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
            {currentStore ? `מוצרים - ${currentStore.name}` : 'כל המוצרים'}
          </motion.h1>
          <p className="text-shop-muted font-bold text-sm">
            {filteredProducts.length} מוצרים
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            icon={<RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />}
            onClick={loadProducts}
            disabled={isLoading}
          >
            רענן
          </Button>
          <Button icon={<Plus size={16} />}>הוסף מוצר</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-shop-border p-4 text-center">
          <p className="font-mono font-bold text-2xl text-shop-primary">{statsData.total}</p>
          <p className="text-xs font-bold text-shop-muted">סה״כ</p>
        </div>
        <div className="bg-white rounded-xl border border-shop-border p-4 text-center">
          <p className="font-mono font-bold text-2xl text-green-600">{statsData.active}</p>
          <p className="text-xs font-bold text-shop-muted">פעיל</p>
        </div>
        <div className="bg-white rounded-xl border border-shop-border p-4 text-center">
          <p className="font-mono font-bold text-2xl text-amber-600">{statsData.lowStock}</p>
          <p className="text-xs font-bold text-shop-muted">מלאי נמוך</p>
        </div>
        <div className="bg-white rounded-xl border border-shop-border p-4 text-center">
          <p className="font-mono font-bold text-2xl text-red-600">{statsData.outOfStock}</p>
          <p className="text-xs font-bold text-shop-muted">אזל</p>
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
        emptyMessage={isLoading ? "טוען נתונים..." : "אין מוצרים להצגה"}
        emptyIcon={<Package size={48} className="text-shop-border" />}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AllProducts;
