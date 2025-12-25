# 🛒 TOMASO E-COMMERCE (Autopilot Commerce)

**AI-Powered E-commerce Platform**  
**Live:** https://tomaso-ecommerce.vercel.app

---

## 🌟 Features

### Core E-commerce
- ✅ Product catalog with categories
- ✅ Shopping cart with localStorage persistence
- ✅ Wishlist functionality
- ✅ Multi-step checkout (Shipping → Payment → Review)
- ✅ Order success page with timeline
- ✅ Promo codes (AUTOPILOT15, WELCOME10, PILOT20)

### AI-Powered
- ✅ Natural language search ("gift for dad under $100")
- ✅ Voice search (Web Speech API)
- ✅ AI chat assistant (Gemini)
- ✅ Voice responses (Gemini TTS)

### Conversion Optimization
- ✅ Exit intent popup (15% off)
- ✅ Social proof notifications
- ✅ Trust badges
- ✅ Urgency indicators
- ✅ Cart drawer feedback

### Navigation
- ✅ Home
- ✅ Shop (all products)
- ✅ New Arrivals (isNew filter)
- ✅ About Us (dedicated page)
- ✅ Sale (isSale filter)

### Multi-Language Support
🇺🇸 English | 🇮🇱 עברית | 🇩🇪 Deutsch | 🇫🇷 Français | 🇷🇺 Русский | 🇺🇦 Українська | 🇪🇸 Español | 🇵🇹 Português

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
cp .env.example .env
# Add your VITE_GEMINI_API_KEY

# Run development server
npm run dev  # localhost:3000
```

---

## 🔧 Environment Variables

```env
# Required for AI features
VITE_GEMINI_API_KEY=your_gemini_api_key

# Optional - Database
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional - Payments
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 📁 Project Structure

```
tomaso-ecommerce/
├── index.tsx           # Main app (multilingual)
├── src/
│   ├── App.tsx         # Alternative app version
│   ├── index.css       # Tailwind styles
│   ├── data/
│   │   └── products.ts # Product catalog
│   ├── hooks/
│   │   ├── useCart.ts
│   │   └── useWishlist.ts
│   ├── lib/
│   │   ├── ai.ts       # Gemini integration
│   │   ├── stripe.ts   # Stripe integration
│   │   └── supabase.ts # Supabase client
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

## 🔗 Links

| Resource | URL |
|----------|-----|
| **Live Site** | https://tomaso-ecommerce.vercel.app |
| **GitHub** | https://github.com/Tomer182/tomaso-ecommerce |
| **Vercel** | https://vercel.com/tomasos-projects-a39f4e7b/tomaso-ecommerce |

---

## 📜 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## 📦 Deployment

```bash
# Deploy to Vercel
npx vercel --prod

# Or push to GitHub (auto-deploy if connected)
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
