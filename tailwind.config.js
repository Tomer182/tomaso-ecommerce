/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'shop-bg': '#FAFAFA',
        'shop-surface': '#FFFFFF',
        'shop-primary': '#0F172A',
        'shop-secondary': '#1E293B',
        'shop-accent': '#2563EB',
        'shop-cta': '#16A34A',
        'shop-cta-hover': '#15803D',
        'shop-sale': '#DC2626',
        'shop-text': '#0F172A',
        'shop-text-secondary': '#475569',
        'shop-muted': '#94A3B8',
        'shop-inverse': '#FFFFFF',
        'shop-border': '#E2E8F0',
        'shop-border-hover': '#CBD5E1',
      },
      fontFamily: {
        'sans': ['Inter', 'Helvetica Neue', 'system-ui', 'sans-serif'],
        'display': ['Playfair Display', 'Times New Roman', 'serif'],
        'mono': ['JetBrains Mono', 'SF Mono', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(0, 0, 0, 0.05)',
        'cta': '0 4px 14px rgba(22, 163, 74, 0.25)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'cart-bounce': 'cartBounce 0.4s ease',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        cartBounce: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

