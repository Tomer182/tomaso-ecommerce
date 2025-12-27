/**
 * OWNER APP - Main Entry Point
 * Command Center for Store Owner
 */

import React, { useState, useEffect } from 'react';
import { AdminLayout, AdminPage } from '../shared/layouts/AdminLayout';
import { getSession, logout, AdminUser } from '../lib/auth';
import { getStores, getCurrentStore, setCurrentStore, Store } from '../lib/stores';
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

  // Check authentication on mount
  useEffect(() => {
    const session = getSession();
    if (session && session.role === 'owner') {
      setUser(session);
      loadStores();
    }
    setIsLoading(false);
  }, []);

  const loadStores = () => {
    const allStores = getStores();
    setStores(allStores);
    
    const current = getCurrentStore();
    setCurrentStoreState(current);
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

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <OwnerDashboard stores={stores} currentStore={currentStore} />;
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
        return <OwnerDashboard stores={stores} currentStore={currentStore} />;
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
      {renderPage()}
    </AdminLayout>
  );
};

export default OwnerApp;

