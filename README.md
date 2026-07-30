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
├── middleware.ts       # Locale redirect + currency cookies
├── app/                 # Next.js App Router pages
│   ├── api/            # API routes (checkout, stripe, paypal, admin, products, currency)
│   ├── [lang]/         # All public pages (locale-prefixed: en/fr/es/de/it)
│   │   ├── cart/       # Shopping cart
│   │   ├── checkout/   # Checkout flow
│   │   ├── products/   # Product pages
│   │   └── order-confirmation/
│   └── admin/          # Admin login + dashboard (/admin, /admin/dashboard)
├── components/         # React components
│   ├── checkout/       # Payment modal (Stripe Payment Element + PayPal buttons)
│   ├── home/           # Homepage sections
│   ├── layout/         # Header, Footer
│   ├── products/       # Product cards
│   ├── admin/          # Dashboard tabs
│   └── ui/             # Reusable UI components
├── lib/                # Utilities
│   ├── db.ts           # All DB access (raw SQL via @vercel/postgres)
│   ├── currency.ts     # Currency conversion
│   ├── email.ts        # Resend + Discord notifications
│   ├── product-ids.ts  # Product slug <-> numeric ID mapping
│   ├── types.ts        # TypeScript types
│   └── utils.ts        # Helper functions
└── store/              # Zustand stores
    ├── cart.ts         # Cart state (persisted to localStorage)
    └── currency.ts     # Currency state
```

> Note: Prisma (`prisma/schema.prisma`) defines the DB schema, but the code queries
> the database exclusively with raw SQL through `@vercel/postgres`.
> See `AGENTS.md` for the full architecture and known pitfalls.

## 🎨 Design System

- **Primary**: Deep Red (#B71C1C)
- **Accent**: Rose Gold (#D4AF88)
- **Background**: Pure White, Pale Pink (#FFE5E5)
- **Typography**: Playfair Display (headings), Inter (body)

## 📧 Contact

For support: support@eterngift.com
