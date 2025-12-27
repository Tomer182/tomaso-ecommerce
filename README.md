# ⚡ SPARKGEAR

**AI-Powered Tech & Gadgets Store**  
**Domain:** [sparkgear.net](https://sparkgear.net)

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

### Dropshipping Automation ✅
- Product-Supplier mapping (CJ, Spocket, AliExpress)
- CJDropshipping API integration
- Smart order routing (cheapest/fastest/preferred)
- Admin dashboard for order management

### 🖥️ Autopilot Command Center ✅ NEW!
- **Owner Dashboard** - Central management for all stores
- **Store Switcher** - Filter data by store (SparkGear, FunHouse)
- **Real-time Stats** - Connected to Supabase
- **Orders Management** - View/update order status
- **Products** - Full product catalog with stock alerts
- **Customers** - Customer database
- **Hebrew UI** - Full RTL Hebrew interface
- **Access:** `/command-center` (password protected)

### Integrations ✅
- Stripe payment ready
- Supabase database ready (✅ Connected!)
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
# Clone the parent repo
git clone https://github.com/Tomer182/tomaso-ecommerce.git
cd tomaso-ecommerce/sparkgear

# Install
npm install

# Set environment variables
# Create .env with:
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_CJ_API_KEY=your_cj_api_key

# Run development server
npm run dev  # localhost:3000
```

---

## 📁 Project Structure

```
sparkgear/
├── api/
│   ├── create-payment-intent.ts  # Stripe serverless function
│   └── webhook.ts                # Stripe webhook handler
├── src/
│   ├── App.tsx                   # Main app
│   ├── index.css                 # Tailwind styles
│   ├── components/
│   │   ├── FiltersPanel.tsx      # Product filters
│   │   └── StripePaymentForm.tsx # Payment form
│   ├── data/
│   │   ├── products.ts           # Product catalog
│   │   └── articles.ts           # Blog articles
│   ├── hooks/
│   │   ├── useCart.ts
│   │   ├── useWishlist.ts
│   │   └── useRecentlyViewed.ts
│   ├── lib/
│   │   ├── ai.ts                 # Gemini integration
│   │   ├── stripe.ts             # Stripe integration
│   │   ├── supabase.ts           # Supabase client + Admin functions
│   │   ├── productSuppliers.ts   # Supplier mapping
│   │   ├── cjdropshipping.ts     # CJ API
│   │   ├── orderRouter.ts        # Smart routing
│   │   └── orderService.ts       # Order orchestration
│   ├── admin/                    # ✅ Command Center (NEW!)
│   │   ├── index.ts              # Root entry
│   │   ├── lib/
│   │   │   ├── auth.ts           # Authentication
│   │   │   ├── stores.ts         # Store management
│   │   │   └── adminApi.ts       # Supabase API layer
│   │   ├── shared/
│   │   │   ├── components/       # Button, Input, DataTable, Modal, Chart
│   │   │   ├── layouts/          # AdminLayout + Store Switcher
│   │   │   └── styles/admin.css  # RTL Hebrew styles
│   │   └── owner/
│   │       ├── OwnerApp.tsx      # Main owner app
│   │       └── pages/            # Dashboard, Orders, Products, etc.
│   ├── pages/
│   │   ├── CheckoutPage.tsx
│   │   └── SuccessPage.tsx
│   └── types/
│       └── index.ts
├── content/
│   └── articles/                 # SEO blog content (10 articles)
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   ├── sitemap.xml
│   └── site.webmanifest
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
| **Live Site** | [sparkgear.net](https://sparkgear.net) |
| **🖥️ Command Center** | [sparkgear.net/command-center](https://sparkgear.net/command-center) |
| **Vercel** | [tomaso-ecommerce.vercel.app](https://tomaso-ecommerce.vercel.app) |
| **GitHub** | [github.com/Tomer182/tomaso-ecommerce](https://github.com/Tomer182/tomaso-ecommerce) |

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

*Part of the Tomaso E-commerce ecosystem*
