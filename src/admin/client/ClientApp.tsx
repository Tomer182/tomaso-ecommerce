/**
 * CLIENT APP - Main Entry Point
 * Store owner's dashboard (limited access)
 */

import React, { useState, useEffect } from 'react';
import { AdminLayout, AdminPage } from '../shared/layouts/AdminLayout';
import { getSession, logout, AdminUser } from '../lib/auth';
import { ClientLogin } from './pages/ClientLogin';
import { ClientDashboard } from './pages/ClientDashboard';
import { MyOrders } from './pages/MyOrders';
import { MyProducts } from './pages/MyProducts';
import { MyCustomers } from './pages/MyCustomers';
import { MyCoupons } from './pages/MyCoupons';
import { MyAnalytics } from './pages/MyAnalytics';
import { StoreSettings } from './pages/StoreSettings';

// Import admin styles
import '../shared/styles/admin.css';

export const ClientApp: React.FC = () => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<AdminPage>('dashboard');

  // Check authentication on mount
  useEffect(() => {
    const session = getSession();
    if (session && session.role === 'client') {
      setUser(session);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    const session = getSession();
    if (session) {
      setUser(session);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    const storeName = user?.storeName || 'החנות שלי';
    
    switch (currentPage) {
      case 'dashboard':
        return <ClientDashboard storeName={storeName} />;
      case 'orders':
        return <MyOrders />;
      case 'products':
        return <MyProducts />;
      case 'customers':
        return <MyCustomers />;
      case 'coupons':
        return <MyCoupons />;
      case 'analytics':
        return <MyAnalytics />;
      case 'settings':
        return <StoreSettings storeName={storeName} />;
      default:
        return <ClientDashboard storeName={storeName} />;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-shop-bg flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-shop-border border-t-shop-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Not authenticated - show login
  if (!user) {
    return <ClientLogin onSuccess={handleLogin} />;
  }

  // Authenticated - show admin
  return (
    <AdminLayout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      onLogout={handleLogout}
      userType="client"
      userName={user.username}
    >
      {renderPage()}
    </AdminLayout>
  );
};

export default ClientApp;

