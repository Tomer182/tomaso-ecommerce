/**
 * ADMIN BUTTON COMPONENT
 * SPARKGEAR Design Language
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-bold uppercase tracking-[0.1em]
    rounded-xl transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      bg-shop-cta text-white
      shadow-[0_4px_14px_rgba(22,163,74,0.25)]
      hover:bg-shop-cta-hover hover:-translate-y-0.5
      hover:shadow-[0_6px_20px_rgba(22,163,74,0.3)]
      active:scale-[0.98]
    `,
    secondary: `
      bg-shop-primary text-white
      hover:bg-shop-secondary
      active:scale-[0.98]
    `,
    outline: `
      bg-transparent text-shop-primary
      border border-shop-border
      hover:bg-shop-bg hover:border-shop-border-hover
    `,
    danger: `
      bg-shop-sale text-white
      hover:bg-red-700
      active:scale-[0.98]
    `,
    ghost: `
      bg-transparent text-shop-text-secondary
      hover:bg-shop-bg hover:text-shop-primary
    `,
  };

  const sizes = {
    sm: 'px-3 py-2 text-[10px]',
    md: 'px-5 py-3 text-[11px]',
    lg: 'px-8 py-4 text-xs',
  };

  return (
    <motion.button
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : icon ? (
        icon
      ) : null}
      {children}
    </motion.button>
  );
};

export default Button;

