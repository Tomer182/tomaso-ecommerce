/**
 * SYSTEM SETTINGS PAGE
 * Global system settings (Owner only)
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Key,
  Bell,
  Shield,
  Database,
  Zap,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';

export const SystemSettings: React.FC = () => {
  const [showApiKey, setShowApiKey] = useState(false);

  const integrations = [
    {
      name: 'CJDropshipping',
      status: 'connected',
      description: 'ספק דרופשיפינג ראשי',
      icon: Zap,
    },
    {
      name: 'Supabase',
      status: 'connected',
      description: 'בסיס נתונים',
      icon: Database,
    },
    {
      name: 'Stripe',
      status: 'pending',
      description: 'עיבוד תשלומים',
      icon: Shield,
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-black text-shop-primary tracking-tight mb-2"
        >
          הגדרות מערכת
        </motion.h1>
        <p className="text-shop-muted font-bold text-sm">
          הגדרות גלובליות למערכת הניהול
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* API Keys */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[1.5rem] border border-shop-border p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-shop-accent/10 rounded-xl flex items-center justify-center">
              <Key className="text-shop-accent" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-shop-primary">מפתחות API</h3>
              <p className="text-xs text-shop-muted">ניהול מפתחות לאינטגרציות</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-shop-primary uppercase tracking-[0.1em] mb-2">
                CJDropshipping API Key
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value="CJ5025216@api@6312bebf..."
                    readOnly
                    className="w-full px-4 py-3 bg-shop-bg border border-shop-border rounded-xl text-sm font-mono"
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-shop-muted hover:text-shop-primary"
                  >
                    {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <Button variant="outline" size="sm">
                  עדכן
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-shop-primary uppercase tracking-[0.1em] mb-2">
                Supabase URL
              </label>
              <input
                type="text"
                value="https://xxx.supabase.co"
                readOnly
                className="w-full px-4 py-3 bg-shop-bg border border-shop-border rounded-xl text-sm font-mono"
              />
            </div>
          </div>
        </motion.div>

        {/* Integrations Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[1.5rem] border border-shop-border p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-shop-cta/10 rounded-xl flex items-center justify-center">
              <Zap className="text-shop-cta" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-shop-primary">אינטגרציות</h3>
              <p className="text-xs text-shop-muted">סטטוס חיבורים חיצוניים</p>
            </div>
          </div>

          <div className="space-y-3">
            {integrations.map((integration) => {
              const Icon = integration.icon;
              return (
                <div
                  key={integration.name}
                  className="flex items-center gap-4 p-4 bg-shop-bg rounded-xl"
                >
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-shop-border">
                    <Icon className="text-shop-primary" size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-shop-primary">{integration.name}</p>
                    <p className="text-xs text-shop-muted">{integration.description}</p>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                      integration.status === 'connected'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {integration.status === 'connected' ? (
                      <CheckCircle size={14} />
                    ) : (
                      <AlertCircle size={14} />
                    )}
                    {integration.status === 'connected' ? 'מחובר' : 'ממתין'}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-[1.5rem] border border-shop-border p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Bell className="text-purple-600" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-shop-primary">התראות</h3>
              <p className="text-xs text-shop-muted">הגדרות התראות מייל</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { label: 'הזמנה חדשה', enabled: true },
              { label: 'מלאי נמוך', enabled: true },
              { label: 'לקוח חדש', enabled: false },
              { label: 'שגיאות מערכת', enabled: true },
            ].map((notification) => (
              <div
                key={notification.label}
                className="flex items-center justify-between p-3 bg-shop-bg rounded-xl"
              >
                <span className="font-bold text-sm text-shop-primary">
                  {notification.label}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={notification.enabled}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-shop-cta"></div>
                </label>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-[1.5rem] border border-shop-border p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <Shield className="text-red-600" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-shop-primary">אבטחה</h3>
              <p className="text-xs text-shop-muted">הגדרות אבטחה וגישה</p>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="שם משתמש מנהל"
              defaultValue="admin"
              disabled
            />
            <Input
              label="סיסמה חדשה"
              type="password"
              placeholder="הזן סיסמה חדשה"
            />
            <Input
              label="אימות סיסמה"
              type="password"
              placeholder="הזן סיסמה שוב"
            />
            <Button variant="primary" className="w-full">
              עדכן סיסמה
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SystemSettings;

