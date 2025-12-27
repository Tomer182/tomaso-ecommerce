/**
 * ADMIN LAYOUT COMPONENT
 * SPARKGEAR Design Language - RTL Hebrew
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Store,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Zap,
} from 'lucide-react';

export type AdminPage =
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'customers'
  | 'stores'
  | 'analytics'
  | 'coupons'
  | 'suppliers'
  | 'settings';

interface Store {
  id: string;
  name: string;
  domain: string;
}

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: AdminPage;
  onNavigate: (page: AdminPage) => void;
  onLogout: () => void;
  userType: 'owner' | 'client';
  userName: string;
  stores?: Store[];
  currentStore?: Store;
  onStoreChange?: (store: Store) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  currentPage,
  onNavigate,
  onLogout,
  userType,
  userName,
  stores = [],
  currentStore,
  onStoreChange,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);

  // Owner menu items
  const ownerMenuItems = [
    { id: 'dashboard', label: 'מרכז פיקוד', icon: LayoutDashboard },
    { id: 'orders', label: 'כל ההזמנות', icon: Package },
    { id: 'products', label: 'כל המוצרים', icon: ShoppingBag },
    { id: 'customers', label: 'לקוחות', icon: Users },
    { id: 'stores', label: 'ניהול חנויות', icon: Store },
    { id: 'analytics', label: 'אנליטיקס גלובלי', icon: BarChart3 },
    { id: 'settings', label: 'הגדרות מערכת', icon: Settings },
  ];

  // Client menu items (limited)
  const clientMenuItems = [
    { id: 'dashboard', label: 'לוח בקרה', icon: LayoutDashboard },
    { id: 'orders', label: 'הזמנות', icon: Package },
    { id: 'products', label: 'מוצרים', icon: ShoppingBag },
    { id: 'customers', label: 'לקוחות', icon: Users },
    { id: 'coupons', label: 'קופונים', icon: Zap },
    { id: 'analytics', label: 'אנליטיקס', icon: BarChart3 },
    { id: 'settings', label: 'הגדרות', icon: Settings },
  ];

  const menuItems = userType === 'owner' ? ownerMenuItems : clientMenuItems;

  return (
    <div className="min-h-screen bg-shop-bg" dir="rtl">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 w-12 h-12 bg-shop-primary text-white rounded-xl flex items-center justify-center shadow-lg"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 right-0 bottom-0 w-72 z-40
          bg-gradient-to-b from-shop-primary to-shop-secondary
          transition-transform duration-300
          lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-shop-cta rounded-xl flex items-center justify-center shadow-lg shadow-shop-cta/30">
              <Zap className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-white font-black text-lg tracking-tight">
                {userType === 'owner' ? 'COMMAND CENTER' : currentStore?.name || 'החנות שלי'}
              </h1>
              <p className="text-white/50 text-xs font-bold">
                {userType === 'owner' ? 'AUTOPILOT' : 'לוח בקרה'}
              </p>
            </div>
          </div>
        </div>

        {/* Store Switcher (Owner only) */}
        {userType === 'owner' && stores.length > 0 && (
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <button
                onClick={() => setIsStoreDropdownOpen(!isStoreDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
              >
                <span className="text-sm font-bold truncate">
                  {currentStore?.name || 'בחר חנות'}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${isStoreDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {isStoreDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 left-0 mt-2 bg-shop-secondary border border-white/10 rounded-xl overflow-hidden shadow-xl z-10"
                  >
                    {stores.map((store) => (
                      <button
                        key={store.id}
                        onClick={() => {
                          onStoreChange?.(store);
                          setIsStoreDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-right transition-colors ${
                          currentStore?.id === store.id
                            ? 'bg-shop-cta/20 text-shop-cta'
                            : 'text-white/70 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <Store size={16} />
                        <span className="text-sm font-bold truncate">{store.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id as AdminPage);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-6 py-3.5
                  text-right transition-all duration-200
                  border-r-[3px]
                  ${
                    isActive
                      ? 'bg-shop-cta/10 text-shop-cta border-r-shop-cta'
                      : 'text-white/60 border-r-transparent hover:bg-white/5 hover:text-white'
                  }
                `}
              >
                <Icon size={20} />
                <span className="text-sm font-bold">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 mb-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <Users className="text-white/60" size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm truncate">{userName}</p>
              <p className="text-white/40 text-xs">
                {userType === 'owner' ? 'מנהל מערכת' : 'בעל חנות'}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm font-bold">יציאה</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:mr-72 min-h-screen">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

