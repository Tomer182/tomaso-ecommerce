/**
 * STORE SETTINGS PAGE
 * Client's store settings (limited)
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Store, Globe, Bell, Lock } from 'lucide-react';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';

interface StoreSettingsProps {
  storeName: string;
}

export const StoreSettings: React.FC<StoreSettingsProps> = ({ storeName }) => {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-black text-shop-primary tracking-tight mb-2"
        >
          הגדרות
        </motion.h1>
        <p className="text-shop-muted font-bold text-sm">
          הגדרות החנות שלך
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Store Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[1.5rem] border border-shop-border p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-shop-primary/10 rounded-xl flex items-center justify-center">
              <Store className="text-shop-primary" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-shop-primary">פרטי חנות</h3>
              <p className="text-xs text-shop-muted">מידע בסיסי על החנות</p>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="שם החנות"
              defaultValue={storeName}
              disabled
            />
            <Input
              label="דומיין"
              defaultValue="sparkgear.net"
              disabled
            />
            <Input
              label="אימייל ליצירת קשר"
              type="email"
              placeholder="store@example.com"
            />
            <Input
              label="טלפון"
              type="tel"
              placeholder="050-0000000"
            />
            <Button variant="primary" className="w-full">
              שמור שינויים
            </Button>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
          transition={{ delay: 0.3 }}
          className="bg-white rounded-[1.5rem] border border-shop-border p-6 lg:col-span-2"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <Lock className="text-red-600" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-shop-primary">אבטחה</h3>
              <p className="text-xs text-shop-muted">עדכון סיסמה</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="סיסמה נוכחית"
              type="password"
              placeholder="הזן סיסמה נוכחית"
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
          </div>
          <Button variant="primary" className="mt-4">
            עדכן סיסמה
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default StoreSettings;

