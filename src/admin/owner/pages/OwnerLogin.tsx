/**
 * OWNER LOGIN PAGE
 * SPARKGEAR Design Language - Hebrew
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Eye, EyeOff, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { login } from '../../lib/auth';

interface OwnerLoginProps {
  onSuccess: () => void;
}

export const OwnerLogin: React.FC<OwnerLoginProps> = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login({ username, password });
      
      if (result.success) {
        onSuccess();
      } else {
        setError(result.error || 'שגיאה בהתחברות');
      }
    } catch (err) {
      setError('שגיאה לא צפויה. נסה שוב.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-shop-primary via-shop-secondary to-shop-primary flex items-center justify-center p-4" dir="rtl">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-shop-primary to-shop-secondary p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-16 h-16 bg-shop-cta rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-shop-cta/30"
          >
            <Zap className="text-white" size={32} />
          </motion.div>
          <h1 className="text-2xl font-black text-white tracking-tight mb-1">
            COMMAND CENTER
          </h1>
          <p className="text-white/60 text-sm font-bold">
            מערכת ניהול AUTOPILOT
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 bg-shop-sale/10 border border-shop-sale/20 rounded-xl mb-6"
            >
              <AlertCircle className="text-shop-sale flex-shrink-0" size={20} />
              <p className="text-sm text-shop-sale font-bold">{error}</p>
            </motion.div>
          )}

          {/* Username */}
          <div className="mb-5">
            <label className="block text-[11px] font-bold text-shop-primary uppercase tracking-[0.1em] mb-2">
              שם משתמש
            </label>
            <div className="relative">
              <User className="absolute right-4 top-1/2 -translate-y-1/2 text-shop-muted" size={18} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="הזן שם משתמש"
                className="w-full pr-12 pl-4 py-4 bg-shop-bg border border-shop-border rounded-xl text-shop-primary placeholder:text-shop-muted focus:outline-none focus:border-shop-accent focus:ring-2 focus:ring-shop-accent/10 transition-all"
                required
                autoFocus
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="block text-[11px] font-bold text-shop-primary uppercase tracking-[0.1em] mb-2">
              סיסמה
            </label>
            <div className="relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-shop-muted" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="הזן סיסמה"
                className="w-full pr-12 pl-12 py-4 bg-shop-bg border border-shop-border rounded-xl text-shop-primary placeholder:text-shop-muted focus:outline-none focus:border-shop-accent focus:ring-2 focus:ring-shop-accent/10 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-shop-muted hover:text-shop-primary transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <label className="flex items-center gap-3 mb-6 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-5 h-5 rounded border-shop-border text-shop-cta focus:ring-shop-cta/20"
            />
            <span className="text-sm font-medium text-shop-text-secondary">
              זכור אותי
            </span>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !username || !password}
            className="w-full py-4 bg-shop-cta text-white rounded-xl text-sm font-black uppercase tracking-widest shadow-lg shadow-shop-cta/30 hover:bg-shop-cta-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                מתחבר...
              </>
            ) : (
              'כניסה למערכת'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="px-8 pb-8 text-center">
          <p className="text-xs text-shop-muted">
            🔒 חיבור מאובטח • Session נמחק בסגירת הדפדפן
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default OwnerLogin;

