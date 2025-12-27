/**
 * OWNER APP - Main Entry Point
 * Command Center for Store Owner - Connected to Real Data
 */

import React, { useState, useEffect } from 'react';
import { AdminLayout, AdminPage } from '../shared/layouts/AdminLayout';
import { getSession, logout, AdminUser } from '../lib/auth';
import { fetchStores, setCurrentStore, getCurrentStoreId, Store, isConnected } from '../lib/adminApi';
import { OwnerLogin } from './pages/OwnerLogin';
import { OwnerDashboard } from './pages/OwnerDashboard';
import { AllOrders } from './pages/AllOrders';
import { AllProducts } from './pages/AllProducts';
import { AllCustomers } from './pages/AllCustomers';
import { StoreManagement } from './pages/StoreManagement';
import { GlobalAnalytics } from './pages/GlobalAnalytics';
import { SystemSettings } from './pages/SystemSettings';

// Import admin styles
import '../shared/styles/admin.css';

export const OwnerApp: React.FC = () => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<AdminPage>('dashboard');
  const [stores, setStores] = useState<Store[]>([]);
  const [currentStore, setCurrentStoreState] = useState<Store | null>(null);
  const [dataConnected, setDataConnected] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const session = getSession();
    if (session && session.role === 'owner') {
      setUser(session);
      loadStores();
    }
    setIsLoading(false);
    setDataConnected(isConnected());
  }, []);

  const loadStores = async () => {
    try {
      const allStores = await fetchStores();
      setStores(allStores);
      
      // Get current store from localStorage or default to first
      const savedStoreId = getCurrentStoreId();
      const current = savedStoreId 
        ? allStores.find(s => s.id === savedStoreId) || allStores[0]
        : null;
      
      setCurrentStoreState(current || null);
    } catch (error) {
      console.error('Error loading stores:', error);
    }
  };

  const handleLogin = () => {
    const session = getSession();
    if (session) {
      setUser(session);
      loadStores();
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setCurrentPage('dashboard');
  };

  const handleStoreChange = (store: Store) => {
    setCurrentStore(store.id);
    setCurrentStoreState(store);
  };

  const handleClearStoreFilter = () => {
    setCurrentStore(null as any);
    setCurrentStoreState(null);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <OwnerDashboard stores={stores} currentStore={currentStore} onClearFilter={handleClearStoreFilter} />;
      case 'orders':
        return <AllOrders currentStore={currentStore} />;
      case 'products':
        return <AllProducts currentStore={currentStore} />;
      case 'customers':
        return <AllCustomers currentStore={currentStore} />;
      case 'stores':
        return <StoreManagement stores={stores} onRefresh={loadStores} />;
      case 'analytics':
        return <GlobalAnalytics stores={stores} currentStore={currentStore} />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <OwnerDashboard stores={stores} currentStore={currentStore} onClearFilter={handleClearStoreFilter} />;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-shop-bg flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-shop-border border-t-shop-cta rounded-full animate-spin" />
      </div>
    );
  }

  // Not authenticated - show login
  if (!user) {
    return <OwnerLogin onSuccess={handleLogin} />;
  }

  // Authenticated - show admin
  return (
    <AdminLayout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      onLogout={handleLogout}
      userType="owner"
      userName={user.username}
      stores={stores}
      currentStore={currentStore || undefined}
      onStoreChange={handleStoreChange}
    >
      {/* Connection Status Banner */}
      {!dataConnected && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
          <div>
            <p className="text-sm font-bold text-amber-800">לא מחובר ל-Supabase</p>
            <p className="text-xs text-amber-600">הנתונים המוצגים הם לדוגמה בלבד. הגדר את משתני הסביבה VITE_SUPABASE_URL ו-VITE_SUPABASE_ANON_KEY</p>
          </div>
        </div>
      )}
      
      {renderPage()}
    </AdminLayout>
  );
};

export default OwnerApp;
