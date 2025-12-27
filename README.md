# ⚡ SPARKGEAR (Tomaso E-Commerce)

**AI-Powered Tech & Gadgets Store**  
**Domain:** sparkgear.net  
**Live:** https://tomaso-ecommerce.vercel.app

---

## 🌟 Features

### Core E-commerce ✅
- Product catalog with categories
- Shopping cart with localStorage persistence
- Wishlist functionality
- Multi-step checkout (Shipping → Payment → Review)
- Order success page with timeline
- Promo codes (AUTOPILOT15, WELCOME10, PILOT20)

### AI-Powered ✅
- Natural language search ("gift for dad under $100")
- Voice search (Web Speech API)
- AI chat assistant (Gemini)
- Voice responses (Gemini TTS)

### Conversion Optimization ✅
- Exit intent popup (15% off)
- Social proof notifications
- Trust badges
- Urgency indicators
- Cart drawer feedback

### Navigation ✅
- Home
- Shop (all products)
- New Arrivals (isNew filter)
- About Us (dedicated page)
- Sale (isSale filter)

### Multi-Language ✅
🇺🇸 English | 🇮🇱 עברית | 🇩🇪 Deutsch | 🇫🇷 Français | 🇷🇺 Русский | 🇺🇦 Українська | 🇪🇸 Español | 🇵🇹 Português

### Integrations ✅
- Stripe payment ready
- Supabase database ready
- Gemini AI connected
- Vercel deployed

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 19 + TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS |
| **Animation** | Framer Motion |
| **Icons** | Lucide React |
| **AI** | Google Gemini 2.0 |
| **Database** | Supabase (PostgreSQL) |
| **Payments** | Stripe |
| **Hosting** | Vercel |

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/Tomer182/tomaso-ecommerce.git
cd tomaso-ecommerce

# Install
npm install

# Set environment variables
# Create .env with:
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Run development server
npm run dev  # localhost:3000
```

---

## 📁 Project Structure

```
tomaso-ecommerce/
├── index.tsx               # Main app (multilingual)
├── src/
│   ├── App.tsx             # Alternative app version
│   ├── index.css           # Tailwind styles
│   ├── components/
│   │   └── StripePaymentForm.tsx
│   ├── data/
│   │   └── products.ts     # Product catalog
│   ├── hooks/
│   │   ├── useCart.ts
│   │   ├── useWishlist.ts
│   │   └── useRecentlyViewed.ts
│   ├── lib/
│   │   ├── ai.ts           # Gemini integration
│   │   ├── stripe.ts       # Stripe integration
│   │   └── supabase.ts     # Supabase client
│   ├── pages/
│   │   ├── CheckoutPage.tsx
│   │   └── SuccessPage.tsx
│   └── types/
│       └── index.ts
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── vercel.json
```

---

## 🎁 Promo Codes

| Code | Discount |
|------|----------|
| `AUTOPILOT15` | 15% off |
| `WELCOME10` | 10% off |
| `PILOT20` | 20% off |

---

## 🔗 Links

| Resource | URL |
|----------|-----|
| **Domain** | https://sparkgear.net |
| **Vercel** | https://tomaso-ecommerce.vercel.app |
| **GitHub** | https://github.com/Tomer182/tomaso-ecommerce |

---

## 📜 Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview build
```

---

## 📦 Deployment

```bash
# Deploy to Vercel
npx vercel --prod

# Or push to GitHub (auto-deploy)
git push
```

---

## 🎨 Design System

See [ECOMMERCE-DESIGN-SYSTEM.md](../ECOMMERCE-DESIGN-SYSTEM.md) for:
- Color palette
- Typography
- Component styles
- Spacing & layout guidelines

---

## 👤 Author

**Tomer Polat**  
December 2025

---

*Part of the Autopilot Commerce ecosystem*
