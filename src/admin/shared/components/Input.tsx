/**
 * ADMIN INPUT COMPONENT
 * SPARKGEAR Design Language
 */

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-[11px] font-bold text-shop-primary uppercase tracking-[0.1em] mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-shop-muted">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full px-4 py-3.5 
            bg-white border border-shop-border rounded-xl
            text-sm text-shop-primary
            placeholder:text-shop-muted
            focus:outline-none focus:border-shop-accent focus:ring-2 focus:ring-shop-accent/10
            transition-all duration-200
            ${icon ? 'pr-10' : ''}
            ${error ? 'border-shop-sale focus:border-shop-sale focus:ring-shop-sale/10' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-shop-sale font-medium">{error}</p>
      )}
    </div>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-[11px] font-bold text-shop-primary uppercase tracking-[0.1em] mb-2">
          {label}
        </label>
      )}
      <textarea
        className={`
          w-full px-4 py-3.5 
          bg-white border border-shop-border rounded-xl
          text-sm text-shop-primary
          placeholder:text-shop-muted
          focus:outline-none focus:border-shop-accent focus:ring-2 focus:ring-shop-accent/10
          transition-all duration-200 resize-none
          ${error ? 'border-shop-sale focus:border-shop-sale focus:ring-shop-sale/10' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs text-shop-sale font-medium">{error}</p>
      )}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  className = '',
  ...props
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-[11px] font-bold text-shop-primary uppercase tracking-[0.1em] mb-2">
          {label}
        </label>
      )}
      <select
        className={`
          w-full px-4 py-3.5 
          bg-white border border-shop-border rounded-xl
          text-sm text-shop-primary
          focus:outline-none focus:border-shop-accent focus:ring-2 focus:ring-shop-accent/10
          transition-all duration-200 cursor-pointer
          appearance-none
          bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394A3B8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")]
          bg-no-repeat bg-[length:1rem] bg-[left_1rem_center] pl-10
          ${error ? 'border-shop-sale focus:border-shop-sale focus:ring-shop-sale/10' : ''}
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1.5 text-xs text-shop-sale font-medium">{error}</p>
      )}
    </div>
  );
};

export default Input;

