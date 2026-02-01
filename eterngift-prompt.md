# 🌹 Prompt Complet - Site E-Commerce EternGift (Roses Éternelles)

## 📋 VISION GLOBALE

Tu dois créer un **site e-commerce Saint-Valentin premium en anglais** appelé **"EternGift"**, inspiré de Sparkly Roses mais avec une touche plus moderne et raffinée. C'est un site de vente de cadeaux romantiques (roses éternelles, bijoux, peluches de roses, coffrets premium, etc.).

**Stack Technologique :**
- Framework: Next.js 14+ (App Router)
- Paiement: Stripe + PayPal (intégration complète)
- UI/Design: Tailwind CSS (design system propre et cohérent)
- Base de données: PostgreSQL/Neon (déjà configuré)
- Authentification: JWT ou simple (email/password pour admin)
- État global: Zustand ou Context API
- Analytics: Vercel Analytics + Speed Insights
- TypeScript (optionnel mais recommandé)

---

## 🎨 DESIGN - ESPRIT ROMANTIQUE (CRITIQUE)

Le design doit être **magnifique et romantique**. C'est la clé du succès:

### Palette de Couleurs Romantique:
- **Primaire:** Rouge profond (#B71C1C), Rose gold (#D4AF88), Blanc pur (#FFFFFF)
- **Secondaire:** Rose pâle (#FFE5E5), Beige crème (#F5F1ED), Gris subtil (#F0F0F0)
- **Accents:** Or rose pour le hover/focus, Ombre douce, Cœurs délicats

### Typographie:
- **Heading:** Police élégante (ex: "Poppins" ou "Playfair Display" - serif pour prestige)
- **Body:** Police lisible (ex: "Inter" ou "Geist")
- **Decoration:** Petits éléments visuels (cœurs, points dorés, séparateurs subtils)

### Éléments Visuels:
- Animations douces au scroll (fade-in, slide subtils)
- Cartes de produit avec effet hover (légère élévation, border doré)
- Gradient doux en arrière-plan (blanc → rose très pâle)
- Cœurs décoratifs placés stratégiquement
- Images premium (produits doivent être magnifiques, bien éclairés)
- Boutons avec effet ripple ou glow subtil
- Témoignages avec cœurs et citations romantiques

---

## 💱 **GESTION DES DEVISES (CRITIQUE)**

**Configuration multi-devises:**
- ✅ Afficher les prix dans la devise du client (USD, EUR, GBP, CAD, etc.)
- ✅ Les tarifs sont affichés dans la devise locale du utilisateur partout (Hero, produits, panier, checkout)
- ✅ **Facturation en USD toujours** (backend conversion)
- ✅ Taux de change **en temps réel** via API (ex: exchangerate-api.com ou openexchangerates.com)
- ✅ Stockage du taux actuel en cache (10 min validity)
- ✅ Affichage "Converted from USD: $XX.XX" subtil

**Implémentation:**
```
Frontend: Détecte la devise du client → Affiche prix converti
Backend: Stocke tous les prix en USD → Convertit au checkout
Stripe/PayPal: Facture en USD → Client voit devise locale
```

---

## 📧 **CONFIGURATION EMAIL & SUPPORT**

**Email Support:** `support@eterngift.com` (remplacer PARTOUT)

**Emails Transactionnels:**
- ✅ Confirmation de commande au client (toutes les infos)
- ✅ Notification admin (Discord Webhook + Email)
- ✅ Confirmation d'expédition
- ✅ Service email: SendGrid ou Resend

**Email Confirmation Structure:**
```
Subject: Order Confirmation #[ORDER_NUMBER]
Content:
- Thank you message
- Order Number & Date
- Client Name & Email
- Shipping Address
- Items Ordered (table format)
- Subtotal, Taxes, Total
- Expected Delivery
- Support contact: support@eterngift.com
- Unsubscribe link
```

---

## 🎮 **PAIEMENTS - STRIPE + PAYPAL**

### **Payment Modal (pas redirection):**
- ✅ Modal overlay au checkout
- ✅ Onglets: "Credit Card" | "PayPal"
- ✅ Reste sur la page (pas de page séparée)
- ✅ Fermeture avec X ou Escape
- ✅ Logos visibles: Visa, Mastercard, PayPal

### **Stripe Integration:**
- ✅ Secret Key: `STRIPE_SECRET_KEY` (Vercel env)
- ✅ Publishable Key: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (Vercel env)
- ✅ Payment dans modal (Stripe Payment Element)
- ✅ NE PAS mentionner "Stripe" → Dire "Credit Card"
- ✅ Webhook pour événements: `checkout.session.completed`

### **PayPal Integration:**
- ✅ Client ID & Secret (from PayPal Developer)
- ✅ Modal avec PayPal button
- ✅ Même UX que Stripe
- ✅ Webhook pour validation

### **Logos Payment:**
```
Credit Card tab:
- Visa, Mastercard, American Express logos
- Stripe branding HIDDEN (dire juste "Credit Card")

PayPal tab:
- PayPal logo officiel
- Express Checkout button
```

---

## 📦 **CONFIGURATION VARIABLES D'ENVIRONNEMENT**

**Vercel Env Vars (déjà configurés):**
```
# Stripe
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...

# PayPal (à ajouter)
PAYPAL_CLIENT_ID=xxx
PAYPAL_CLIENT_SECRET=xxx

# Database (Neon PostgreSQL)
POSTGRES_URL=postgresql://...
POSTGRES_URL_NO_SSL=postgresql://...
POSTGRES_USER=...
POSTGRES_HOST=...
POSTGRES_DATABASE=...
PGHOST_UNPOOLED=...

# Email & Notifications
SENDGRID_API_KEY=SG...
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...

# Devise & Exchange
NEXT_PUBLIC_EXCHANGE_RATE_API_KEY=...
NEXT_PUBLIC_BASE_CURRENCY=USD

# Site
NEXT_PUBLIC_SITE_URL=https://eterngift.com
NEXT_PUBLIC_SITE_EMAIL=support@eterngift.com

# Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=... (auto)
```

---

## 🔔 **WEBHOOK DISCORD - NOTIFICATIONS COMMANDES**

**Au chaque nouvelle commande:**
- ✅ Webhook Discord envoie embed avec:
  - ✅ Order Number (en gras)
  - ✅ Client Name
  - ✅ Client Email
  - ✅ Montant total (devise USD)
  - ✅ Items commandés (liste)
  - ✅ Shipping Address
  - ✅ Payment Method (Stripe/PayPal)
  - ✅ Timestamp
  - ✅ Status: "Pending" (jaune)

**Format Discord Embed:**
```
Title: 🎉 New Order: #ORDER123
Fields:
- Customer: John Doe (john@email.com)
- Total: $125.99 USD
- Items: Rose Eternal Box x1, Diamond Ring x1
- Address: 123 Main St, Paris, FR
- Payment: Credit Card
- Status: ⏳ Pending
- Time: 2026-02-02 01:15 UTC
```

**Implémentation:**
```
POST /api/webhooks/discord
→ Axios/fetch to Discord Webhook URL
→ Embed payload
→ Send on checkout.session.completed
```

---

## 📱 STRUCTURE DES PAGES

### 1️⃣ **Page d'Accueil (/)**
- **Hero Section:** 
  - Titre accrocheur: "Express Your Love with Perfect Gifts"
  - Sous-titre romantique
  - CTA principal: "Shop Now" (bouton premium)
  - Arrière-plan: Image héroïque (ou gradient) avec légère animation
  - **Prix en devise locale du client** (ex: €45.99 pour EU, £35.99 pour UK)
  - Afficher 3-4 catégories de produits en avant

- **Galerie de Produits Destacados:**
  - Grid de 6-8 produits bestsellers
  - Chaque carte: image, nom, prix (devise locale), bouton "Quick Add to Cart"
  - Au hover: badge "Popular" ou "Limited Edition", affichage du bouton plus visible

- **Section Testimonials:**
  - 3-4 avis clients avec cœurs et notes ⭐
  - Citation + Prénom/Date
  - Effet carousel si possible (slide automatique)

- **Newsletter Signup:**
  - "Get 10% off your first order"
  - Email input simple + bouton
  - Message de validation/confirmation subtil
  - Contact: support@eterngift.com

- **Footer:**
  - Links (About, Contact, Returns, FAQ)
  - Support email: **support@eterngift.com**
  - Social media icons
  - Copyright

### 2️⃣ **Page Produits (/products)**
- **Grid de tous les produits** (12 par page minimum, pagination ou infinite scroll)
- **Filtres/Recherche:** 
  - Par catégorie (Roses, Jewelry, Gift Sets, etc.)
  - Par prix (range slider, devise locale)
  - Par rating
  - Recherche textuelle
- **Tri:** Par nouveauté, prix (asc/desc), popularité
- **Affichage:** Mini-cartes avec image, nom, prix (devise locale), rating

### 3️⃣ **Page Détail Produit (/products/[id])**
- **Layout:**
  - Colonne gauche: Galerie d'images (grande image + thumbnails)
  - Colonne droite: Infos produit
  
- **Infos Produit:**
  - Titre + Rating ⭐ (x avis)
  - Prix (devise locale) + Badge (New, Limited, Bestseller)
  - Description courte + détaillée
  - "Specifications" (si applicable)
  - Quantité selector (input + boutons +/-)
  - "Add to Cart" (bouton principal)
  - "Add to Wishlist" (cœur icon)
  - Témoignages liés au produit (3-4)
  - "Livraison rapide garantie" + "Retours 30j"
  - Support: support@eterngift.com

### 4️⃣ **Panier (/cart)**
- **Très simple et épuré:**
  - Tableau avec: Image | Nom | Prix (devise locale) | Quantité | Total (devise locale) | Supprimer (X)
  - Total général (sous-total, frais, total final) en devise locale
  - Bouton "Checkout" DOMINANT (red/gold)
  - Bouton "Continue Shopping"
  - Message si panier vide
  - Validation en temps réel

### 5️⃣ **Checkout (Payment Modal - /checkout)**
- **Ultra-court et simple** (2 étapes):
  
  **Étape 1: Coordonnées de Livraison (Page normale)**
  - Prénom, Nom, Email
  - Adresse, Code Postal, Ville
  - Pays (dropdown)
  - Total affiché en devise locale
  - Bouton "Continue to Payment" → Ouvre Modal

  **Étape 2: Paiement (MODAL OVERLAY)**
  - Onglets: "Credit Card" | "PayPal"
  - **Credit Card Tab:**
    - Stripe Payment Element
    - Logos: Visa, Mastercard, Amex
    - Montant total en USD + devise locale (ex: $125.99 USD ≈ €118.50)
    - Bouton "Pay Now"
    - Mention: "Secure payment" (SANS mention Stripe)
  
  - **PayPal Tab:**
    - PayPal logo
    - PayPal button officiel
    - Même montant affiché
  
  - **Modal Controls:**
    - Close button (X)
    - Escape key closes modal
    - Reste sur page même après paiement réussi

  **Étape 3: Confirmation (Modal close)**
  - Page de succès avec:
    - "Thank you for your order!"
    - Numéro de commande
    - Email de confirmation envoyé à [email client]
    - Lien vers "Track Your Order" (optionnel)
    - Bouton "Back to Shop"
    - Support: support@eterngift.com

- **Design:** Modal centered, semi-transparent backdrop, formulaires épurés, logos visibles

### 6️⃣ **Dashboard Admin (/dashboard)**
- **Authentification:** Login simple (email/password)
- **Design:** Correspond à l'ergonomie du site (romantique, épuré, rose/gold)
- **Navigation Sidebar:**
  - Overview
  - Products
  - Orders
  - Analytics (basique)
  - Settings

#### **Overview Dashboard:**
- Cartes de stats: Total Orders, Revenue (USD), Pending, New Customers
- Graphique simple (Chart.js ou Recharts) avec orders/revenue trend (derniers 30j)
- Tableau des 5 dernières commandes avec status

#### **Gestion des Produits (/dashboard/products):**
- **Tableau des produits:**
  - Colonnes: Image | Nom | Prix (USD) | Stock | Status | Actions
  - Bouton "Add Product" (vert/principal)
  - Actions par produit: Edit | Delete | View
  - Pagination

- **Créer/Éditer Produit:**
  - Formulaire simple:
    - Titre
    - Description (textarea)
    - Prix (input numérique, en USD)
    - Image (upload ou URL)
    - Stock (input numérique)
    - Catégorie (dropdown)
    - Status (Active/Inactive)
    - Tags/Keywords (optionnel)
  - Boutons: "Save" | "Cancel"
  - Messages de succès/erreur

#### **Gestion des Commandes (/dashboard/orders):**
- **Tableau des commandes:**
  - Colonnes: N° Commande | Client | Montant (USD) | Status | Date | Actions
  - Filtrer par status (Pending, Processing, Shipped, Delivered)
  - Actions: View | Mark as Shipped | Send Email | Delete
  
- **Détail d'une commande:**
  - Client info (nom, email, téléphone optionnel)
  - Adresse de livraison
  - Produits commandés (mini tableau)
  - Subtotal, Tax, Total (USD)
  - Original currency & converted amount affiché
  - Status badge (avec timestamps)
  - Historique complet (Created → Processing → Shipped → Delivered)
  - Bouton "Resend Confirmation Email"
  - Bouton "View Discord Notification"

#### **Analytics (Simple):**
- Revenus totaux (USD, MTD, All Time)
- Nombre de commandes (MTD)
- Produit plus vendu
- Payment methods breakdown (Stripe vs PayPal %)
- Graphique simple revenue trend (30 derniers jours)
- Top 5 products by revenue

#### **Settings:**
- Email de support: support@eterngift.com (read-only, affichage)
- Stripe API keys status: ✅ Connected
- PayPal API keys status: ✅ Connected
- Discord Webhook status: ✅ Connected
- Support contact (pour messages depuis le site)

---

## 🛒 FLUX UTILISATEUR COMPLET

```
Accueil (prix locale) → Browser Produits (prix locale) → Détail Produit (prix locale) 
→ Add to Cart → Voir Panier (prix locale) → Checkout (formulaire + modal paiement) 
→ Modal Stripe/PayPal (USD affiché) → Paiement réussi → Email confirmation 
→ Discord notification (admin) → Order created en BDD → Back to Shop
```

```
Admin Login → Dashboard Overview → Manage Products (Add/Edit/Delete) 
→ Manage Orders (View/Update Status) → View Analytics
```

---

## ⚙️ FONCTIONNALITÉS TECHNIQUES REQUISES

### Frontend (Client-Side):
✅ Next.js 14+ avec App Router
✅ Tailwind CSS (design responsive, mobile-first)
✅ Zustand ou Context API (cart state management)
✅ Stripe.js + PayPal SDK pour le checkout modal
✅ Responsive design (mobile, tablet, desktop)
✅ Animations douces (Framer Motion optionnel)
✅ Forms validation (react-hook-form optionnel)
✅ Vercel Analytics: `import { Analytics } from "@vercel/analytics/next"`
✅ Vercel Speed Insights: `import { SpeedInsights } from "@vercel/speed-insights/next"`
✅ Currency conversion library (dinero.js ou dinero-js)

### Backend (API Routes):
✅ API route pour créer Stripe Checkout Session (`/api/checkout`)
✅ API route pour PayPal payment (`/api/paypal/checkout`)
✅ API route pour Stripe Webhooks (`/api/webhooks/stripe`)
✅ API route pour PayPal Webhooks (`/api/webhooks/paypal`)
✅ API route pour Discord notifications (`/api/webhooks/discord`)
✅ API CRUD pour produits (`/api/products`, `/api/products/[id]`)
✅ API CRUD pour commandes (`/api/orders`, `/api/orders/[id]`)
✅ API pour admin authentication (`/api/auth/login`)
✅ API pour taux de change (`/api/currency/rates`)
✅ API pour envoi emails (`/api/email/send-confirmation`)
✅ Gestion des variables d'environnement (tous les .env)

### Base de Données (PostgreSQL/Neon):
- **Tables:**
  - `users` (admin accounts)
  - `products` (tous les prix en USD)
  - `orders` (order history, devise du client stockée)
  - `order_items` (items dans chaque commande)
  - `currencies` (cache taux de change, updated 10min)

**Neon Connection:**
```
POSTGRES_URL (with SSL)
POSTGRES_URL_NO_SSL
PGHOST_UNPOOLED (pour Prisma)
```

### Paiements:
✅ **Stripe:**
  - API Key: STRIPE_SECRET_KEY
  - Publishable Key: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  - Checkout Session creation avec metadata
  - Webhook handling pour `checkout.session.completed`
  - Order creation après paiement succès
  - Test mode (utilisable en dev/prod)

✅ **PayPal:**
  - Client ID: PAYPAL_CLIENT_ID
  - Client Secret: PAYPAL_CLIENT_SECRET
  - Order creation & approval
  - Webhook handling pour validations
  - Same user experience que Stripe

### Email (SendGrid/Resend):
✅ Confirmation email au client
✅ Admin notification via email + Discord
✅ Templates avec branding EternGift
✅ API Key stocké en env

### Discord Webhooks:
✅ New order notifications
✅ Payment confirmation
✅ Shipping updates
✅ Rich embed format

### Analytics:
✅ Vercel Analytics component importé en root layout
✅ Vercel Speed Insights component importé en root layout
✅ Track page views, events, conversions
✅ Dashboard analytics (30-day trends)

---

## 📦 STRUCTURE DES DONNÉES

### Schema Produit:
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price_usd DECIMAL(10, 2) NOT NULL, -- ALWAYS in USD
  image_url VARCHAR(255),
  images_url TEXT[], -- gallery
  category VARCHAR(100),
  stock INT DEFAULT 0,
  rating DECIMAL(3, 2),
  status ENUM('active', 'inactive'),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Schema Commande:
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id INT,
  customer_email VARCHAR(255),
  customer_name VARCHAR(255),
  customer_currency VARCHAR(3), -- Client's original currency (EUR, GBP, etc.)
  subtotal_usd DECIMAL(10, 2), -- in USD
  tax_usd DECIMAL(10, 2), -- in USD
  total_usd DECIMAL(10, 2), -- in USD (what we charge)
  total_displayed DECIMAL(10, 2), -- What client saw (local currency)
  exchange_rate DECIMAL(10, 6), -- Applied conversion rate
  shipping_address_street VARCHAR(255),
  shipping_address_city VARCHAR(100),
  shipping_address_postal VARCHAR(20),
  shipping_address_country VARCHAR(100),
  payment_method ENUM('stripe', 'paypal'),
  payment_id VARCHAR(255), -- Stripe Session ID or PayPal Order ID
  status ENUM('pending', 'processing', 'shipped', 'delivered') DEFAULT 'pending',
  email_sent BOOLEAN DEFAULT FALSE,
  discord_notified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id),
  product_id INT REFERENCES products(id),
  product_name VARCHAR(255),
  price_usd DECIMAL(10, 2),
  quantity INT,
  total_usd DECIMAL(10, 2)
);
```

---

## 🗂️ **STRUCTURE FICHIERS ASSETS**

**Favicons:**
```
/public/favicon/
  ├── favicon.ico
  ├── apple-touch-icon.png
  ├── favicon-16x16.png
  ├── favicon-32x32.png
  └── site.webmanifest
```

**Logos & Images:**
```
/public/logos/
  ├── eterngift-logo.svg
  ├── payment-methods/
  │   ├── visa.svg
  │   ├── mastercard.svg
  │   ├── amex.svg
  │   └── paypal.svg
  └── icons/
      ├── heart.svg
      ├── rose.svg
      └── star.svg
```

---

## 🔐 VERCEL ENV VARS (FINAL CHECKLIST)

```
# Payment Methods
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
PAYPAL_CLIENT_ID=xxx
PAYPAL_CLIENT_SECRET=xxx

# Database (Neon)
POSTGRES_URL=postgresql://...
POSTGRES_URL_NO_SSL=postgresql://...
POSTGRES_USER=...
POSTGRES_HOST=...
POSTGRES_DATABASE=...
PGHOST_UNPOOLED=...

# Email
SENDGRID_API_KEY=SG...
NEXT_PUBLIC_SITE_EMAIL=support@eterngift.com

# Notifications
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...

# Currency Exchange
NEXT_PUBLIC_EXCHANGE_RATE_API_KEY=xxx (optional, use free API if needed)
NEXT_PUBLIC_BASE_CURRENCY=USD

# Site Config
NEXT_PUBLIC_SITE_URL=https://eterngift.com
NEXT_PUBLIC_SITE_NAME=EternGift

# Analytics (auto-generated)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=... (Vercel sets this)
```

---

## 🎯 PRIORITÉS D'IMPLÉMENTATION

**Phase 1 (MVP):**
1. Setup Neon PostgreSQL + Prisma schema
2. Créer la structure Next.js de base avec layouts
3. Implémenter pages principales avec devise locale affichage
4. Intégrer Tailwind CSS avec design romantique
5. Ajouter produits en BDD
6. Stripe checkout modal (payment method tab 1)
7. Order création en BDD après paiement
8. Page de succès avec info commande
9. Email confirmation basique
10. Vercel Analytics + Speed Insights integration

**Phase 2:**
11. PayPal integration (payment method tab 2)
12. Discord webhook notifications
13. Admin dashboard CRUD (matching site design)
14. Email templates professionnels
15. Taux de change temps réel
16. Analytics dashboard avancé

**Phase 3 (Optional):**
17. Wishlist functionality
18. Advanced order tracking
19. Subscription products
20. Referral program
21. SEO optimization
22. Internationalization (i18n)

---

## 📧 **EMAIL CONFIGURATION**

**Service:** SendGrid ou Resend
**From Email:** noreply@eterngift.com
**Support Email:** support@eterngift.com (mentionné partout)
**Reply-To:** support@eterngift.com

**Templates:**
- Order Confirmation (avec tous les détails)
- Shipping notification
- Support inquiry response
- Newsletter signup

---

## 🎨 **DESIGN SYSTEM - FINAL**

**Colors:**
- Primary Red: #B71C1C
- Rose Gold: #D4AF88
- White: #FFFFFF
- Light Pink: #FFE5E5
- Cream: #F5F1ED
- Gray: #F0F0F0

**Fonts:**
- Headings: Playfair Display (serif)
- Body: Inter (sans-serif)

**Components:**
- Buttons: Subtle gold glow on hover
- Cards: Shadow + border rose
- Modals: Centered, semi-transparent dark overlay
- Forms: Clean, minimal inputs
- Tables: Admin dashboard styling

---

## ✅ **CHECKLIST FINAL IMPLEMENTATION**

- [ ] Neon PostgreSQL configuré & Prisma migré
- [ ] Vercel env vars tous configurés
- [ ] HomePage avec devise locale affichage
- [ ] Products page avec filtre & tri
- [ ] Product detail page complet
- [ ] Cart avec prix locale
- [ ] Checkout formulaire + modal
- [ ] Stripe payment modal (credit card tab)
- [ ] PayPal payment modal (paypal tab)
- [ ] Order création en BDD
- [ ] Email confirmation envoyé
- [ ] Discord webhook notifié
- [ ] Admin dashboard CRUD complet
- [ ] Admin can view orders with full details
- [ ] Admin can resend confirmation emails
- [ ] All prices displayed in client's currency
- [ ] USD always charged on Stripe/PayPal
- [ ] Favicons intégrés depuis /favicon
- [ ] Logos payment methods visibles
- [ ] Support email (support@eterngift.com) everywhere
- [ ] No Stripe mention (Credit Card instead)
- [ ] Vercel Analytics integrated
- [ ] Vercel Speed Insights integrated
- [ ] Mobile responsive (all pages)
- [ ] Lighthouse score > 80
- [ ] No console errors
- [ ] SEO meta tags present
- [ ] 404 page custom
- [ ] Loading states visible
- [ ] Error handling + user feedback

---

## 🚀 DÉPLOIEMENT

- **Hosting:** Vercel (Next.js optimisé)
- **Database:** Neon PostgreSQL (connecté)
- **Domaine:** eterngift.com
- **Email:** SendGrid/Resend configured
- **Payment:** Stripe Live + PayPal Live
- **Analytics:** Vercel Analytics active
- **Webhooks:** Discord + Stripe + PayPal tous configured

---

## 💡 **FINAL NOTES**

1. **Design excellence** = 80% du succès. Chaque pixel compte.
2. **Performance** = Lighthouse >80 always
3. **Email workflow** = Confirmation rapide et professionnelle
4. **Admin dashboard** = Ergonomique, corresponde au site design
5. **Payment UX** = Modal ne quitte pas la page
6. **Multi-devise** = Client voit sa devise, mais on charge en USD
7. **Notifications** = Admin reçoit tout (Discord + Email)
8. **Support** = support@eterngift.com PARTOUT visible

**Le site doit être PRÊT POUR LA PRODUCTION. Aucun TODO, aucun placeholder.**

Bonne chance! 🌹✨
