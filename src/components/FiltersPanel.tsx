import React, { useState } from 'react';
import { 
  X, Flame, Tag, Star, Package, 
  DollarSign, RefreshCw, ChevronDown, ChevronUp,
  Sparkles, TrendingUp, ArrowUpDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FilterState {
  priceRange: [number, number];
  minRating: number;
  stockStatus: ('in_stock' | 'low_stock' | 'out_of_stock')[];
  badges: ('isNew' | 'isBestSeller' | 'isSale')[];
  sortBy: 'trending' | 'price-low' | 'price-high' | 'newest' | 'rating';
}

interface FiltersPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  maxPrice: number;
  productCount: number;
  mode?: 'sidebar' | 'drawer'; // sidebar = always visible, drawer = mobile overlay
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  maxPrice,
  productCount,
  mode = 'drawer'
}) => {
  const [expandedSections, setExpandedSections] = useState({
    sort: true,
    price: true,
    rating: true,
    badges: true,
    stock: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleBadge = (badge: 'isNew' | 'isBestSeller' | 'isSale') => {
    const current = filters.badges;
    const newBadges = current.includes(badge) 
      ? current.filter(b => b !== badge)
      : [...current, badge];
    updateFilter('badges', newBadges);
  };

  const toggleStock = (status: 'in_stock' | 'low_stock' | 'out_of_stock') => {
    const current = filters.stockStatus;
    const newStatus = current.includes(status)
      ? current.filter(s => s !== status)
      : [...current, status];
    updateFilter('stockStatus', newStatus);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      priceRange: [0, maxPrice],
      minRating: 0,
      stockStatus: [],
      badges: [],
      sortBy: 'trending',
    });
  };

  const hasActiveFilters = 
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < maxPrice ||
    filters.minRating > 0 ||
    filters.stockStatus.length > 0 ||
    filters.badges.length > 0;

  const activeFiltersCount = 
    (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    filters.stockStatus.length +
    filters.badges.length;

  // Section Header Component
  const SectionHeader = ({ 
    title, 
    icon: Icon, 
    section 
  }: { 
    title: string; 
    icon: React.ElementType; 
    section: keyof typeof expandedSections;
  }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between py-3 text-left group"
    >
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-shop-accent" />
        <span className="text-xs font-bold uppercase tracking-widest text-shop-primary">{title}</span>
      </div>
      <div className="w-6 h-6 rounded-lg bg-shop-bg flex items-center justify-center group-hover:bg-shop-border transition-colors">
        {expandedSections[section] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </div>
    </button>
  );

  // Filter Content
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-shop-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight">Refine Results</h2>
          <span className="text-xs font-medium text-shop-muted">{productCount} products</span>
        </div>
        {activeFiltersCount > 0 && (
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-shop-accent font-medium">
              {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active
            </span>
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 text-xs font-medium text-shop-muted hover:text-shop-primary transition-colors"
            >
              <RefreshCw size={12} />
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Sort */}
      <div className="border-b border-shop-border pb-4">
        <SectionHeader title="Sort By" icon={ArrowUpDown} section="sort" />
        <AnimatePresence>
          {expandedSections.sort && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-2 space-y-1">
                {[
                  { value: 'trending', label: 'Trending', icon: TrendingUp },
                  { value: 'newest', label: 'New Arrivals', icon: Sparkles },
                  { value: 'price-low', label: 'Price: Low to High', icon: DollarSign },
                  { value: 'price-high', label: 'Price: High to Low', icon: DollarSign },
                  { value: 'rating', label: 'Top Rated', icon: Star },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => updateFilter('sortBy', opt.value as FilterState['sortBy'])}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      filters.sortBy === opt.value
                        ? 'bg-shop-accent/10 text-shop-accent'
                        : 'text-shop-text-secondary hover:bg-shop-bg'
                    }`}
                  >
                    <opt.icon size={14} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Price Range */}
      <div className="border-b border-shop-border pb-4">
        <SectionHeader title="Price Range" icon={DollarSign} section="price" />
        <AnimatePresence>
          {expandedSections.price && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-3">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-shop-muted mb-1.5 block">Min</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-shop-muted text-sm">$</span>
                      <input
                        type="number"
                        min={0}
                        max={filters.priceRange[1]}
                        value={filters.priceRange[0]}
                        onChange={(e) => updateFilter('priceRange', [Number(e.target.value), filters.priceRange[1]])}
                        className="w-full bg-shop-bg border border-shop-border rounded-xl pl-7 pr-3 py-2.5 text-sm font-medium text-center focus:ring-2 focus:ring-shop-accent/20 focus:border-shop-accent outline-none transition-all"
                      />
                    </div>
                  </div>
                  <span className="text-shop-muted mt-5">—</span>
                  <div className="flex-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-shop-muted mb-1.5 block">Max</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-shop-muted text-sm">$</span>
                      <input
                        type="number"
                        min={filters.priceRange[0]}
                        max={maxPrice}
                        value={filters.priceRange[1]}
                        onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], Number(e.target.value)])}
                        className="w-full bg-shop-bg border border-shop-border rounded-xl pl-7 pr-3 py-2.5 text-sm font-medium text-center focus:ring-2 focus:ring-shop-accent/20 focus:border-shop-accent outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
                {/* Quick Price Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Under $50', range: [0, 50] },
                    { label: '$50-$100', range: [50, 100] },
                    { label: '$100+', range: [100, maxPrice] },
                  ].map(({ label, range }) => (
                    <button
                      key={label}
                      onClick={() => updateFilter('priceRange', range as [number, number])}
                      className={`py-2 px-2 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all ${
                        filters.priceRange[0] === range[0] && filters.priceRange[1] === range[1]
                          ? 'bg-shop-accent text-white'
                          : 'bg-shop-bg text-shop-text-secondary hover:bg-shop-border'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Rating */}
      <div className="border-b border-shop-border pb-4">
        <SectionHeader title="Rating" icon={Star} section="rating" />
        <AnimatePresence>
          {expandedSections.rating && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-2 space-y-1">
                {[4, 3, 2, 1, 0].map(rating => (
                  <button
                    key={rating}
                    onClick={() => updateFilter('minRating', rating)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                      filters.minRating === rating
                        ? 'bg-shop-accent/10'
                        : 'hover:bg-shop-bg'
                    }`}
                  >
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < rating ? 'text-amber-400 fill-amber-400' : 'text-shop-border fill-none'}
                        />
                      ))}
                    </div>
                    <span className={`text-sm font-medium ${
                      filters.minRating === rating ? 'text-shop-accent' : 'text-shop-text-secondary'
                    }`}>
                      {rating === 0 ? 'All ratings' : `${rating}+ stars`}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Badges / Tags */}
      <div className="border-b border-shop-border pb-4">
        <SectionHeader title="Product Type" icon={Tag} section="badges" />
        <AnimatePresence>
          {expandedSections.badges && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-2 space-y-2">
                {[
                  { key: 'isNew', label: 'New Arrivals', color: 'bg-shop-primary' },
                  { key: 'isBestSeller', label: 'Best Sellers', color: 'bg-[#F59E0B]' },
                  { key: 'isSale', label: 'On Sale', color: 'bg-shop-sale' },
                ].map(({ key, label, color }) => (
                  <button
                    key={key}
                    onClick={() => toggleBadge(key as 'isNew' | 'isBestSeller' | 'isSale')}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-xl border transition-all ${
                      filters.badges.includes(key as any)
                        ? 'border-shop-accent bg-shop-accent/5'
                        : 'border-shop-border hover:border-shop-border-hover'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${color}`} />
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                    {filters.badges.includes(key as any) && (
                      <div className="w-5 h-5 bg-shop-accent rounded-md flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stock Status */}
      <div className="pb-4">
        <SectionHeader title="Availability" icon={Package} section="stock" />
        <AnimatePresence>
          {expandedSections.stock && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-2 space-y-2">
                {[
                  { key: 'in_stock', label: 'In Stock', dotColor: 'bg-shop-cta' },
                  { key: 'low_stock', label: 'Low Stock', dotColor: 'bg-[#F59E0B]' },
                  { key: 'out_of_stock', label: 'Out of Stock', dotColor: 'bg-shop-sale' },
                ].map(({ key, label, dotColor }) => (
                  <label
                    key={key}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                      filters.stockStatus.includes(key as any)
                        ? 'bg-shop-bg'
                        : 'hover:bg-shop-bg'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={filters.stockStatus.includes(key as any)}
                      onChange={() => toggleStock(key as any)}
                      className="w-4 h-4 rounded border-shop-border text-shop-accent focus:ring-shop-accent/20"
                    />
                    <div className={`w-2 h-2 rounded-full ${dotColor}`} />
                    <span className="text-sm font-medium text-shop-text-secondary">{label}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Clear All Button */}
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="w-full py-3 bg-shop-bg hover:bg-shop-border text-shop-primary font-medium rounded-xl flex items-center justify-center gap-2 transition-all"
        >
          <RefreshCw size={16} />
          Clear All Filters
        </button>
      )}
    </div>
  );

  // Sidebar mode - always visible with scroll
  if (mode === 'sidebar') {
    return (
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-2 -mr-2 scrollbar-thin">
        <FilterContent />
      </div>
    );
  }

  // Drawer mode - only show when open
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-80 bg-white z-[110] shadow-2xl overflow-y-auto"
          >
            {/* Mobile Header */}
            <div className="sticky top-0 bg-white border-b border-shop-border p-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold">Filters</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-shop-bg rounded-xl flex items-center justify-center hover:bg-shop-border transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <FilterContent />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FiltersPanel;

