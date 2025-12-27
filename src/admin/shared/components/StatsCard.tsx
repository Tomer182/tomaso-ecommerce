/**
 * ADMIN STATS CARD COMPONENT
 * SPARKGEAR Design Language
 */

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  iconBg?: string;
  delay?: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon,
  iconBg = 'bg-shop-cta',
  delay = 0,
}) => {
  const isPositive = change !== undefined && change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white rounded-[1.5rem] p-6 border border-shop-border shadow-subtle hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center text-white shadow-lg`}
        >
          {icon}
        </div>
        {change !== undefined && (
          <div
            className={`flex items-center gap-1 text-xs font-bold ${
              isPositive ? 'text-shop-cta' : 'text-shop-sale'
            }`}
          >
            {isPositive ? (
              <TrendingUp size={14} />
            ) : (
              <TrendingDown size={14} />
            )}
            <span>{isPositive ? '+' : ''}{change}%</span>
          </div>
        )}
      </div>
      
      <div className="font-mono font-black text-3xl text-shop-primary tracking-tight mb-1">
        {value}
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-shop-muted uppercase tracking-[0.15em]">
          {title}
        </span>
        {changeLabel && (
          <span className="text-[10px] font-medium text-shop-text-secondary">
            {changeLabel}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default StatsCard;

