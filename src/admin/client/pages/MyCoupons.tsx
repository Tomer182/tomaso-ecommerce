/**
 * MY COUPONS PAGE
 * Client's coupons management
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Ticket, Plus, Copy, Check, Trash2 } from 'lucide-react';
import { Button } from '../../shared/components/Button';
import { Modal, ConfirmModal } from '../../shared/components/Modal';
import { Input, Select } from '../../shared/components/Input';

// Mock coupons
const MOCK_COUPONS = [
  {
    id: 'coup-001',
    code: 'WELCOME10',
    discount: 10,
    type: 'percentage',
    uses: 15,
    maxUses: 100,
    active: true,
    expiresAt: '2025-01-31',
  },
  {
    id: 'coup-002',
    code: 'SUMMER20',
    discount: 20,
    type: 'percentage',
    uses: 42,
    maxUses: 50,
    active: true,
    expiresAt: '2025-03-31',
  },
  {
    id: 'coup-003',
    code: 'FLAT5',
    discount: 5,
    type: 'fixed',
    uses: 8,
    maxUses: null,
    active: false,
    expiresAt: null,
  },
];

export const MyCoupons: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteCoupon, setDeleteCoupon] = useState<any>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-black text-shop-primary tracking-tight mb-2"
          >
            קופונים
          </motion.h1>
          <p className="text-shop-muted font-bold text-sm">
            {MOCK_COUPONS.filter((c) => c.active).length} קופונים פעילים
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus size={18} />}
          onClick={() => setIsAddModalOpen(true)}
        >
          קופון חדש
        </Button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_COUPONS.map((coupon, index) => (
          <motion.div
            key={coupon.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white rounded-[1.5rem] border p-6 relative overflow-hidden ${
              coupon.active ? 'border-shop-border' : 'border-gray-200 opacity-60'
            }`}
          >
            {/* Decorative ticket edge */}
            <div className="absolute top-0 bottom-0 right-0 w-4 flex flex-col justify-between py-2">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-full bg-shop-bg -mr-2"
                />
              ))}
            </div>

            {/* Content */}
            <div className="pr-4">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    coupon.active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {coupon.active ? 'פעיל' : 'לא פעיל'}
                </div>
                <button
                  onClick={() => setDeleteCoupon(coupon)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>

              {/* Code */}
              <div className="flex items-center gap-2 mb-4">
                <code className="font-mono font-black text-xl text-shop-primary tracking-wider">
                  {coupon.code}
                </code>
                <button
                  onClick={() => copyCode(coupon.code)}
                  className="p-2 hover:bg-shop-bg rounded-lg transition-colors"
                  title="העתק קוד"
                >
                  {copiedCode === coupon.code ? (
                    <Check size={16} className="text-shop-cta" />
                  ) : (
                    <Copy size={16} className="text-shop-muted" />
                  )}
                </button>
              </div>

              {/* Discount */}
              <div className="mb-4">
                <span className="font-mono font-black text-3xl text-shop-cta">
                  {coupon.type === 'percentage' ? `${coupon.discount}%` : `$${coupon.discount}`}
                </span>
                <span className="text-shop-muted text-sm mr-2">הנחה</span>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-shop-muted">שימושים: </span>
                  <span className="font-bold text-shop-primary">
                    {coupon.uses}
                    {coupon.maxUses && ` / ${coupon.maxUses}`}
                  </span>
                </div>
                {coupon.expiresAt && (
                  <div className="text-shop-muted text-xs">
                    עד {new Date(coupon.expiresAt).toLocaleDateString('he-IL')}
                  </div>
                )}
              </div>

              {/* Usage bar */}
              {coupon.maxUses && (
                <div className="mt-3">
                  <div className="w-full h-2 bg-shop-bg rounded-full overflow-hidden">
                    <div
                      className="h-full bg-shop-cta rounded-full transition-all"
                      style={{ width: `${(coupon.uses / coupon.maxUses) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Coupon Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="יצירת קופון חדש"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              ביטול
            </Button>
            <Button variant="primary">צור קופון</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="קוד קופון"
            placeholder="לדוגמה: SUMMER20"
            style={{ textTransform: 'uppercase' }}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="סוג הנחה"
              options={[
                { value: 'percentage', label: 'אחוזים (%)' },
                { value: 'fixed', label: 'סכום קבוע ($)' },
              ]}
            />
            <Input
              label="גובה הנחה"
              type="number"
              placeholder="10"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="מקסימום שימושים"
              type="number"
              placeholder="ללא הגבלה"
            />
            <Input
              label="תאריך תפוגה"
              type="date"
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteCoupon}
        onClose={() => setDeleteCoupon(null)}
        onConfirm={() => {
          console.log('Delete coupon:', deleteCoupon?.id);
          setDeleteCoupon(null);
        }}
        title="מחיקת קופון"
        message={`האם אתה בטוח שברצונך למחוק את הקופון "${deleteCoupon?.code}"?`}
        confirmText="מחק"
        cancelText="ביטול"
        variant="danger"
      />
    </div>
  );
};

export default MyCoupons;

