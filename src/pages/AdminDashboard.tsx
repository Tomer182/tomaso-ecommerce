/**
 * ADMIN DASHBOARD - Order Management
 * 🔐 SECRET ADMIN PANEL - Password Protected
 * Access URL: /autopilot-mission-control-2025
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  ArrowLeft,
  Search,
  Filter,
  Download,
  ExternalLink,
  Lock,
  Eye,
  EyeOff,
  Shield
} from 'lucide-react';

// 🔐 ADMIN PASSWORD - Set in .env file: VITE_ADMIN_PASSWORD
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'autopilot2025';

interface SupplierInfo {
  name: string;
  items: string[];
  cost: number;
  days: number;
}

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
  customerEmail: string;
  customerName: string;
  supplierBreakdown?: { [key: string]: SupplierInfo };
  autoSubmitted?: boolean;
  trackingNumber?: string;
}

interface AdminDashboardProps {
  onExit?: () => void;
}

// 🔐 Login Screen Component
const AdminLogin: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      // Save session
      sessionStorage.setItem('admin_authenticated', 'true');
      onSuccess();
    } else {
      setAttempts(prev => prev + 1);
      setError(attempts >= 2 ? 'Access denied. Too many attempts.' : 'Invalid password');
      setPassword('');
    }
  };

  if (attempts >= 5) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500 text-center">
          <Shield size={64} className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold">ACCESS BLOCKED</h1>
          <p className="text-sm mt-2 opacity-60">Too many failed attempts. Refresh to try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 w-full max-w-md shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
            <Lock className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">MISSION CONTROL</h1>
          <p className="text-gray-500 text-sm mt-1">Administrator Access Required</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="Enter access code..."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 font-mono text-center tracking-widest"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm text-center font-bold"
            >
              ⚠️ {error}
            </motion.p>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/30 active:scale-[0.98]"
          >
            Authenticate
          </button>
        </form>

        <p className="text-center text-gray-600 text-xs mt-6">
          🔒 Encrypted Session • Auto-logout on close
        </p>
      </motion.div>
    </div>
  );
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExit }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'shipped'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Check if already authenticated this session
  useEffect(() => {
    const auth = sessionStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  // Mock data - will be replaced with real API
  useEffect(() => {
    // TODO: Fetch real orders from Supabase
    setOrders([]);
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length
  };

  return (
    <div className="min-h-screen bg-shop-bg py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-black text-shop-dark tracking-tight uppercase mb-2">Mission Control</h1>
            <p className="text-shop-muted font-bold uppercase text-xs tracking-widest">Order Management & Supplier Tracking</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Orders', value: stats.total, icon: Package, color: 'bg-retro-blue' },
            { label: 'Pending', value: stats.pending, icon: Clock, color: 'bg-retro-yellow' },
            { label: 'Processing', value: stats.processing, icon: Truck, color: 'bg-retro-pink' },
            { label: 'Shipped', value: stats.shipped, icon: CheckCircle, color: 'bg-retro-green' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`${stat.color} rounded-[2rem] p-8 shadow-lg border border-shop-border`}
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="text-white" size={32} />
                <span className="text-5xl font-black text-white">{stat.value}</span>
              </div>
              <p className="text-white font-bold uppercase text-xs tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-[2rem] p-6 shadow-lg border border-shop-border mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 flex items-center gap-2 bg-shop-bg px-4 py-3 rounded-xl border border-shop-border">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders..."
                className="flex-1 bg-transparent outline-none font-bold"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {['all', 'pending', 'processing', 'shipped'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status as any)}
                  className={`px-4 py-2 rounded-xl font-bold border border-shop-border transition-all ${
                    filter === status
                      ? 'bg-shop-primary text-white'
                      : 'bg-white hover:bg-shop-bg'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-12 shadow-lg border border-shop-border text-center">
            <Package size={64} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">No Orders Yet</h3>
            <p className="text-shop-muted font-bold">Orders will appear here once customers start purchasing!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={() => setSelectedOrder(order)}
              />
            ))}
          </div>
        )}

        {/* Order Detail Modal */}
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </div>
    </div>
  );
};

// Order Card Component
const OrderCard: React.FC<{ order: Order; onClick: () => void }> = ({ order, onClick }) => {
  const statusColors = {
    pending: 'bg-amber-500',
    processing: 'bg-blue-500',
    shipped: 'bg-shop-primary',
    delivered: 'bg-green-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="bg-white rounded-[2rem] p-6 shadow-lg border border-shop-border hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-black text-xl mb-1 uppercase tracking-tight">{order.id}</h3>
          <p className="text-sm text-shop-muted font-bold">{order.customerName} • {order.customerEmail}</p>
          <p className="text-xs text-gray-500 font-bold mt-1">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <div className="text-right">
          <span className={`${statusColors[order.status as keyof typeof statusColors]} text-white px-3 py-1 rounded-full text-sm font-black`}>
            {order.status.toUpperCase()}
          </span>
          <p className="text-2xl font-black mt-2">${order.total.toFixed(2)}</p>
        </div>
      </div>

      {/* Supplier Breakdown */}
      {order.supplierBreakdown && (
        <div className="bg-shop-bg border border-shop-border rounded-xl p-4 mb-4">
          <p className="font-black text-sm mb-2 uppercase tracking-widest">📦 Supplier Breakdown:</p>
          {Object.entries(order.supplierBreakdown).map(([supplier, info]) => (
            <div key={supplier} className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm">{supplier}</span>
              <span className="text-xs bg-white px-2 py-1 rounded-full border border-shop-border">
                {info.items.length} items • ${info.cost.toFixed(2)} • {info.days} days
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Items */}
      <div className="flex items-center gap-2 overflow-x-auto">
        {order.items.map((item, i) => (
          <div key={i} className="flex-shrink-0 w-16 h-16 rounded-lg border border-shop-border overflow-hidden bg-shop-bg">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          </div>
        ))}
        {order.items.length > 4 && (
          <span className="text-sm font-bold text-shop-muted">+{order.items.length - 4} more</span>
        )}
      </div>
    </motion.div>
  );
};

// Order Detail Modal (simplified)
const OrderDetailModal: React.FC<{ order: Order; onClose: () => void }> = ({ order, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[3rem] p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-shop-border"
      >
        <h2 className="text-4xl font-black mb-6 uppercase tracking-tight">Order Details</h2>
        <pre className="text-sm bg-shop-bg p-4 rounded-xl overflow-auto border border-shop-border">
          {JSON.stringify(order, null, 2)}
        </pre>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-shop-primary text-white py-4 rounded-xl font-black border border-shop-border shadow-lg hover:shadow-none transition-all uppercase tracking-widest"
        >
          Close
        </button>
      </motion.div>
    </div>
  );
};

