/**
 * ADMIN DATA TABLE COMPONENT
 * SPARKGEAR Design Language
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronDown, ChevronUp, Package } from 'lucide-react';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  title?: string;
  columns: Column<T>[];
  data: T[];
  searchable?: boolean;
  searchPlaceholder?: string;
  filters?: { label: string; value: string }[];
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  onRowClick?: (item: T) => void;
  actions?: React.ReactNode;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  isLoading?: boolean;
}

export function DataTable<T extends { id: string | number }>({
  title,
  columns,
  data,
  searchable = true,
  searchPlaceholder = 'חיפוש...',
  filters,
  activeFilter = 'all',
  onFilterChange,
  onRowClick,
  actions,
  emptyMessage = 'אין נתונים להצגה',
  emptyIcon,
  isLoading = false,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // Filter data by search
  const filteredData = data.filter((item) => {
    if (!searchQuery) return true;
    return Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = (a as any)[sortKey];
    const bVal = (b as any)[sortKey];
    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  return (
    <div className="bg-white rounded-[1.5rem] border border-shop-border shadow-subtle overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-shop-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            {title && (
              <h3 className="text-lg font-black text-shop-primary uppercase tracking-tight">
                {title}
              </h3>
            )}
            {actions}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            {searchable && (
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-shop-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full sm:w-64 pr-10 pl-4 py-2.5 bg-shop-bg border border-shop-border rounded-xl text-sm text-shop-primary placeholder:text-shop-muted focus:outline-none focus:border-shop-accent transition-colors"
                />
              </div>
            )}

            {/* Filters */}
            {filters && (
              <div className="flex gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => onFilterChange?.(filter.value)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      activeFilter === filter.value
                        ? 'bg-shop-primary text-white'
                        : 'bg-shop-bg text-shop-text-secondary hover:bg-shop-border'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-shop-bg">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  onClick={() => col.sortable && handleSort(String(col.key))}
                  className={`px-5 py-4 text-right text-[10px] font-bold text-shop-text-secondary uppercase tracking-[0.1em] border-b border-shop-border ${
                    col.sortable ? 'cursor-pointer hover:text-shop-primary' : ''
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && sortKey === String(col.key) && (
                      sortDir === 'asc' ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      )
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-3 border-shop-border border-t-shop-cta rounded-full animate-spin" />
                      <span className="text-sm text-shop-muted">טוען נתונים...</span>
                    </div>
                  </td>
                </tr>
              ) : sortedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      {emptyIcon || <Package className="w-12 h-12 text-shop-border" />}
                      <span className="text-sm font-bold text-shop-muted">{emptyMessage}</span>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedData.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => onRowClick?.(item)}
                    className={`border-b border-shop-border/50 last:border-b-0 transition-colors ${
                      onRowClick ? 'cursor-pointer hover:bg-shop-bg' : ''
                    }`}
                  >
                    {columns.map((col) => (
                      <td
                        key={String(col.key)}
                        className="px-5 py-4 text-sm text-shop-primary"
                      >
                        {col.render
                          ? col.render(item)
                          : String((item as any)[col.key] ?? '')}
                      </td>
                    ))}
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;

