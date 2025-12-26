# ChaiBari - Premium Tea E-commerce Website

A modern, production-ready e-commerce frontend for a premium tea brand built with Next.js 15, TypeScript, and Tailwind CSS.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-teal)

## ✨ Features

- **Premium Design**: Clean, elegant tea-brand aesthetic with smooth animations
- **Responsive**: Mobile-first design, works on all devices
- **Accessible**: ARIA labels, keyboard navigation, semantic HTML
- **SEO Optimized**: Proper metadata, semantic structure
- **Cart Persistence**: Cart state saved in localStorage
- **Type-Safe**: Full TypeScript throughout

## 📦 Pages

| Page | Path | Description |
|------|------|-------------|
| Homepage | `/` | Hero, featured collections, best sellers, testimonials |
| Collections | `/collections` | All tea collection categories |
| Collection Detail | `/collections/[slug]` | Products with filters & sorting |
| Product Detail | `/products/[slug]` | Gallery, variants, brewing instructions |
| Cart | `/cart` | Cart items, quantity controls, summary |
| Checkout | `/checkout` | Multi-step checkout form |
| Order Success | `/order-success` | Order confirmation |
| About | `/about` | Company story & team |
| Shipping | `/shipping` | Delivery info & zones |
| Returns | `/returns` | Return policy |
| Privacy | `/privacy` | Privacy policy |
| Contact | `/contact` | Contact form |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Navigate to project
cd tea-store

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── about/
│   ├── cart/
│   ├── checkout/
│   ├── collections/
│   ├── contact/
│   ├── order-success/
│   ├── privacy/
│   ├── products/
│   ├── returns/
│   ├── shipping/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── home/               # Homepage sections
│   ├── layout/             # Navbar, Footer, CartDrawer
│   ├── product/            # ProductCard, ProductGallery
│   └── ui/                 # Button, Input, Select, Modal, etc.
├── context/
│   └── CartContext.tsx     # Cart state management
├── data/
│   ├── products.ts         # Mock product data
│   ├── collections.ts      # Mock collections
│   └── testimonials.ts     # Mock testimonials
├── lib/
│   ├── services/           # Data fetching (with backend placeholders)
│   └── utils.ts            # Utility functions
└── types/
    └── index.ts            # TypeScript types
```

## 🔌 Backend Integration Guide

This frontend is designed for easy backend integration. Look for `// TODO:` comments in the code.

### Connecting Supabase

1. **Install Supabase client:**
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Create `.env.local`:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Create Supabase client (`lib/supabase.ts`):**
   ```typescript
   import { createClient } from '@supabase/supabase-js'
   
   export const supabase = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
   )
   ```

4. **Update service functions** in `lib/services/`:
   ```typescript
   // Before (mock)
   export async function getProducts() {
     return products;
   }
   
   // After (Supabase)
   export async function getProducts() {
     const { data } = await supabase.from('products').select('*');
     return data;
   }
   ```

### Database Tables

Create these tables in Supabase:

- `products` - Product catalog
- `collections` - Product categories
- `orders` - Customer orders
- `order_items` - Order line items

### Payment Integration

Look for `// TODO: Replace with payment gateway integration` comments:

- **bKash**: Use bKash Payment Gateway API
- **SSLCommerz**: Popular BD payment gateway
- **Stripe**: For international cards

## 🎨 Customization

### Colors

Edit colors in `src/app/globals.css` under the `@theme` block:

```css
@theme {
  --color-primary-700: #1a4d2e;  /* Main brand green */
  --color-secondary-500: #c9a227; /* Accent gold */
  /* ... */
}
```

### Fonts

Fonts are configured in `src/app/layout.tsx`:
- **Display**: Playfair Display (headings)
- **Body**: Inter (text)

### Mock Data

Replace mock data in `src/data/` with your actual products.

## 📝 License

MIT License - Feel free to use for your tea business!

---

Built with ☕ for ChaiBari
