# EternGift - Premium Valentine's E-commerce

A beautiful, romantic e-commerce website for premium Valentine's Day gifts including eternal roses, jewelry, and gift sets.

## 🌹 Features

- **Modern Design** - Romantic theme with elegant animations
- **Multi-Currency** - Display prices in local currency, charge in USD
- **Payment Integration** - Stripe & PayPal via modal (no redirects)
- **Admin Dashboard** - Manage products, orders, and analytics
- **Discord Notifications** - Real-time order alerts
- **Responsive** - Mobile-first design

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL/Neon with Prisma
- **State**: Zustand
- **Payments**: Stripe, PayPal
- **Analytics**: Vercel Analytics + Speed Insights

## 🚀 Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Set up database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── api/            # API routes
│   ├── cart/           # Shopping cart
│   ├── checkout/       # Checkout flow
│   ├── dashboard/      # Admin dashboard
│   ├── products/       # Product pages
│   └── order-confirmation/
├── components/         # React components
│   ├── checkout/       # Payment modal
│   ├── home/           # Homepage sections
│   ├── layout/         # Header, Footer
│   ├── products/       # Product cards
│   └── ui/             # Reusable UI components
├── lib/                # Utilities
│   ├── currency.ts     # Currency conversion
│   ├── prisma.ts       # Database client
│   ├── types.ts        # TypeScript types
│   └── utils.ts        # Helper functions
└── store/              # Zustand stores
    ├── cart.ts         # Cart state
    └── currency.ts     # Currency state
```

## 🎨 Design System

- **Primary**: Deep Red (#B71C1C)
- **Accent**: Rose Gold (#D4AF88)
- **Background**: Pure White, Pale Pink (#FFE5E5)
- **Typography**: Playfair Display (headings), Inter (body)

## 📧 Contact

For support: support@eterngift.com
