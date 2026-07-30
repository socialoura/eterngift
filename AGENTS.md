# AGENTS.md — EternGift

> Contexte de travail pour agents IA. Généré à partir de l'analyse réelle du code (juillet 2026), mis à jour après la passe de correctifs (auth JWT, schéma DB unifié, routes nettoyées). En cas de doute, **le code fait foi**.

## 1. Vue rapide

EternGift est une boutique e-commerce mono-produit (2 SKU : « Eternal Rose Bear » et « Eternal Rose Box », ours/boîte de roses éternelles avec collier gravé personnalisable). Next.js 14 App Router, déployé sur Vercel, paiement Stripe + PayPal en modal (sans redirection), prix affichés en devise locale mais **toujours facturés en USD**, notifications de commande par email (Resend) et webhook Discord, dashboard admin maison.

## 2. Stack technique

- **Framework** : Next.js `^14.2.35` (App Router) + React 18 + TypeScript 5
- **Styling** : Tailwind CSS 3, `tailwind-merge`, `class-variance-authority`, `lucide-react`, `framer-motion`
- **État client** : Zustand 5 (`src/store/cart.ts` avec `persist` localStorage, `src/store/currency.ts`)
- **DB** : PostgreSQL (Vercel Postgres / Neon). **Accès réel = SQL brut via `@vercel/postgres` (`sql` tag)**. Prisma 7 est installé et `prisma/schema.prisma` est la source de vérité du schéma, mais **le client Prisma n'est importé nulle part** — il ne sert qu'à décrire/pousser le schéma (`db push` via `prisma.config.ts`).
- **Auth admin** : JWT signé via `jsonwebtoken` + `JWT_SECRET` ; hash de mot de passe via `bcryptjs` (table `admin_users`).
- **Paiements** : `stripe` (+ `@stripe/react-stripe-js`, Payment Element), `@paypal/react-paypal-js` + API REST PayPal v2
- **Email** : `resend` (PAS SendGrid)
- **Charts admin** : `recharts`
- **i18n** : maison, 5 locales `en/fr/es/de/it` (`src/lib/i18n/`), middleware de redirection locale + devise
- **Analytics** : `@vercel/analytics`, `@vercel/speed-insights`, Meta Pixel (`NEXT_PUBLIC_META_PIXEL_ID`, fallback en dur `1434519064736453` dans `layout.tsx` — identifiant public, pas un secret)
- **Dépendances mortes restantes** : `jose`, `dinero.js`, `zod`, `react-hook-form`, `@hookform/resolvers` — installées mais non utilisées.

## 3. Structure des dossiers

```
src/
├── middleware.ts              # Redirection vers /<locale>/… + cookies devise/locale
├── app/
│   ├── layout.tsx             # Root layout : fonts, Meta Pixel, Vercel Analytics
│   ├── page.tsx               # Racine (redirigée par le middleware)
│   ├── sitemap.ts, loading.tsx, not-found.tsx, globals.css
│   ├── [lang]/                # TOUTES les pages publiques sont sous /<locale>/
│   │   ├── page.tsx           # Homepage
│   │   ├── products/page.tsx, products/[id]/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── order-confirmation/page.tsx
│   │   ├── collections/, faq/, contact/
│   │   └── layout.tsx         # I18nProvider + Header/Footer
│   ├── admin/
│   │   ├── page.tsx           # Login admin (POST /api/admin/login)
│   │   └── dashboard/page.tsx # Dashboard, onglets: products | orders | analytics | settings | promo
│   └── api/                   # 20 routes API (voir §6)
├── components/
│   ├── checkout/              # PaymentModal, QuickBuyModal, StripeCardForm, PayPalButtonWrapper
│   ├── home/                  # Sections homepage (Hero, FeaturedProducts, Testimonials…)
│   ├── products/, layout/, ui/
│   ├── admin/                 # ProductsTab, OrdersTab, AnalyticsDashboard, SettingsTab, PromoTab
│   └── providers/             # I18nProvider, MotionProvider
├── hooks/                     # useStorefrontProducts, useProductPrices, useIsMobile
├── lib/
│   ├── db.ts                  # ⚠️ TOUT l'accès DB (SQL brut @vercel/postgres) + initDatabase()
│   ├── email.ts               # Resend (confirmation) + webhook Discord
│   ├── admin-auth.ts          # JWT signé/vérifié (jsonwebtoken + JWT_SECRET)
│   ├── product-ids.ts         # Source unique du mapping slug ↔ ID numérique produit
│   ├── products-data.ts       # Catalogue statique des 2 produits (variants, couleurs, images)
│   ├── currency.ts            # Conversion de devises côté client
│   ├── i18n/                  # config + dictionnaires JSON (en/fr/es/de/it)
│   ├── prisma.ts              # Client Prisma — INUTILISÉ
│   ├── utils.ts               # cn(), generateOrderNumber() → "EG-<base36>-<rand>"
│   └── types.ts, fonts.ts
├── store/                     # cart.ts (persisté), currency.ts
prisma/
└── schema.prisma              # Schéma de référence réel (users, products, orders, order_items, currency_rates)
public/products/               # Images produits par couleur (rouge/rose/bleu/blanc/violet)
Homepage/, Ours Rose …/        # Assets sources (PSD/JPG/PNG), pas du code
```

Fichiers racine notables : `README.md`, `ADMIN_DASHBOARD.md` (réécrit, à jour), `eterngift-prompt.md` / `eterngift-products-homepage-prompt.md` (prompts de génération initiaux, valeur historique), `ilyes-belkadi_*.json` (CV exporté, sans rapport avec l'app), `logo.png`, `product-homepage*.png`, `paypal.svg`.

## 4. Points d'entrée

- **App publique** : `src/middleware.ts` redirige `/…` → `/<locale>/…` (détection `Accept-Language`, cookie `user-selected-locale` prioritaire si choix manuel) et pose les cookies `preferred-locale` / `preferred-currency` (devise **toujours synchronisée sur la locale** : en→USD, fr/es/de/it→EUR).
- **Pages** : `src/app/[lang]/layout.tsx` → `page.tsx` et sous-pages.
- **Admin** : `/admin` (login) → `/admin/dashboard`. Le middleware exclut `/admin` de la redirection de locale.
- **API** : `src/app/api/**/route.ts`.
- **Scripts npm** : `dev` (next dev), `build` (`prisma generate && next build`), `start`, `lint` (next lint), `postinstall` (`prisma generate`).

## 5. Logique métier — flux critiques

### Catalogue & prix
- Le catalogue « riche » (couleurs, gravures, images) est **statique** dans `src/lib/products-data.ts` (2 produits : `eternal-rose-bear` 29,99 $, `eternal-rose-box` 19,99 $ — prix de fallback).
- Les prix/stocks réels viennent de la DB table `products` (schéma Prisma, IDs numériques **1 = bear, 2 = box**, mapping centralisé dans `src/lib/product-ids.ts`) via :
  - `GET /api/storefront/products` (prix + stock)
  - `GET /api/products/prices`
  - Hooks `useStorefrontProducts` / `useProductPrices`, avec fallback sur les prix statiques si la DB échoue.

### Devises
- `GET /api/currency/rates` : taux via exchangerate-api.com (clé `NEXT_PUBLIC_EXCHANGE_RATE_API_KEY`), cache mémoire 10 min, sinon `FALLBACK_RATES` en dur (EUR 0.92, GBP 0.79, …).
- Affichage en devise locale partout ; **facturation en USD** (`totalUsd` envoyé tel quel aux PSP).

### Checkout Stripe (modal)
1. `StripeCardForm` → `GET /api/stripe/publishable-key` (clé publique : env `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` sinon table `settings`).
2. `POST /api/stripe/create-payment-intent` `{ totalUsd, currency }` → PaymentIntent (clé secrète : env `STRIPE_SECRET_KEY` sinon table `settings`).
3. Confirmation carte côté client (Payment Element).
4. `POST /api/checkout` `{ items, shippingInfo, totalUsd, currency, paymentMethod:'stripe', paymentIntentId }` → le serveur **revérifie** que le PaymentIntent est `succeeded`, puis : `createOrder()` (SQL), email Resend, notification Discord. ⚠️ Si l'insert DB échoue, la commande est quand même confirmée au client (log seulement).

### Checkout PayPal (modal)
1. `PayPalButtonWrapper` → `POST /api/paypal/create-order` `{ totalUsd, items, shippingInfo }` → ordre PayPal v2 (`intent: CAPTURE`). ⚠️ Les `return_url`/`cancel_url` pointent vers `/api/paypal/capture` et `/checkout` **sans locale** — restes d'un flux redirect, mais le SDK boutons n'utilise pas ces URLs.
2. Approbation dans la popup PayPal.
3. `POST /api/paypal/capture-order` `{ paypalOrderId, items, shippingInfo, totalUsd, currency }` → capture, vérif `status === 'COMPLETED'`, puis même finalisation que Stripe (createOrder + email + Discord).

### Commande
- `generateOrderNumber()` → `EG-<timestamp base36>-<rand>` (`src/lib/utils.ts`).
- `createOrder()` (`src/lib/db.ts`) insère dans `orders` (colonnes du schéma Prisma : `order_number`, `customer_email`, `total_usd`, …, statut `'confirmed'`, `email_sent`/`discord_notified` = true) puis les `order_items` en mappant les slugs → IDs numériques via `src/lib/product-ids.ts` (slug inconnu → item ignoré + warning, plus de fallback silencieux vers l'ID 1).
- Livraison : pas de flux de livraison/fulfillment dans le code — email « Estimated delivery: 5-7 business days » en dur, livraison « FREE » en dur, pas de tracking.
- Codes promo : CRUD admin + table `promo_codes`, mais **aucune route checkout n'applique de promo** (le toggle `promo_field_enabled` n'affecte que l'affichage).

### Admin
- Login `POST /api/admin/login`. Mot de passe vérifié d'abord contre le hash bcrypt de `admin_users` (si changé via le dashboard), sinon contre `ADMIN_USERNAME`/`ADMIN_PASSWORD` (env). Token = **JWT signé** avec `JWT_SECRET` (expiration 24 h).
- Dashboard (`/admin/dashboard`) : onglets **products | orders | analytics | settings | promo**. Token lu de `localStorage.adminToken`, envoyé en `Authorization: Bearer`.
- Change password (`POST /api/admin/change-password`) : fonctionnel — hash bcrypt upserté dans `admin_users`, prend le pas sur l'env.
- Settings Stripe : clés stockées en clair dans la table `settings` (`stripe_secret_key`, `stripe_publishable_key`) ; l'env a priorité à la lecture (`getStripeSecretKey`).

## 6. Routes API (20 fichiers de route)

| Route | Méthodes | Auth admin | Rôle |
|---|---|---|---|
| `/api/checkout` | POST | non | Finalisation commande Stripe (vérif PaymentIntent + DB + email + Discord) |
| `/api/stripe/create-payment-intent` | POST | non | Crée le PaymentIntent |
| `/api/stripe/publishable-key` | GET | non | Expose la clé publique Stripe |
| `/api/paypal/create-order` | POST | non | Crée l'ordre PayPal v2 |
| `/api/paypal/capture-order` | POST | non | Capture + finalisation commande PayPal |
| `/api/products` | GET, POST | GET non / POST oui | Catalogue DB réel (GET) ; création produit (POST, admin) |
| `/api/products/prices` | GET | non | Prix DB (mapping via `product-ids.ts`) + fallback |
| `/api/storefront/products` | GET | non | Prix + stock DB + fallback |
| `/api/currency/rates` | GET | non | Taux de change (cache 10 min + fallback) |
| `/api/admin/login` | POST | — | Login admin (émet un JWT) |
| `/api/admin/change-password` | POST | oui | Change le mot de passe (bcrypt → `admin_users`) |
| `/api/admin/products` | GET | oui | Liste produits (SQL brut) |
| `/api/admin/products/[productId]` | PUT | oui | Maj prix/stock produit |
| `/api/admin/seed-products` | GET, POST | oui | Seed des 2 produits (IDs 1/2) si table vide |
| `/api/admin/orders` | GET | oui | Liste commandes |
| `/api/admin/orders/[orderId]` | PUT, DELETE | oui | Maj/suppression commande **par `order_number`** |
| `/api/admin/stripe-settings` | GET, PUT | oui | Clés Stripe en table `settings` |
| `/api/admin/stripe-settings/test` | POST | oui | Test de connexion Stripe |
| `/api/admin/promo-settings` | GET, PUT | oui | Toggle champ promo (clé `promo_field_enabled`) |
| `/api/admin/promo-codes` + `/[code]` | GET, POST, PUT, DELETE | oui | CRUD codes promo |
| `/api/admin/google-ads-expenses` + `/[month]` | GET, POST, PUT, DELETE | oui | Dépenses pubs par mois `YYYY-MM` |

Toutes les routes admin (sauf login) vérifient le JWT via `verifyAdminToken()`.
La route legacy `/api/paypal/checkout` (créait des commandes sans paiement vérifié) a été **supprimée**.

## 7. Base de données — schéma réel

**Source de vérité** : `prisma/schema.prisma` (PostgreSQL). Pas de dossier `prisma/migrations` (gitignored, jamais commité) — le schéma est poussé par `prisma db push` (URL : `POSTGRES_URL_NO_SSL` via `prisma.config.ts`).

Tables Prisma :
- `users` (id, email unique, password, name?, role='admin', timestamps) — **inutilisée** par le code (l'admin utilise `admin_users`)
- `products` (id serial, name, description?, **price_usd** Decimal(10,2), image_url?, images_url String[], category?, stock=0, rating?, review_count=0, status='active', badge?)
- `orders` (id serial, **order_number** unique, customer_email, customer_name, customer_currency='USD', subtotal_usd, tax_usd=0, total_usd, total_displayed?, exchange_rate?, shipping_address_street/city/postal/country?, payment_method, payment_id?, status='pending', **cost=0**, **notes?**, email_sent=false, discord_notified=false)
- `order_items` (id, order_id→orders **ON DELETE CASCADE**, product_id→products, product_name, price_usd, quantity, total_usd)
- `currency_rates` (currency unique, rate) — **inutilisée** (les taux viennent de l'API externe)

Tables auxiliaires créées par `initDatabase()` (`src/lib/db.ts`) — absentes du schéma Prisma :
- `admin_users` (username PK, password_hash bcrypt)
- `settings` (key-value : `stripe_secret_key`, `stripe_publishable_key`, `promo_field_enabled`)
- `promo_codes` (code PK, discount_type, discount_value, max_uses=-1, current_uses=0, expires_at, is_active)
- `google_ads_expenses` (month PK `YYYY-MM`, amount)

Historique : `initDatabase()` créait auparavant des tables legacy incompatibles (`products` id TEXT/`base_price`, `orders` `order_id` TEXT…) — **supprimées** ; si une vieille base contient encore ces tables au format legacy, il faudra la migrer manuellement vers le schéma Prisma.

## 8. Variables d'environnement

Réellement lues par le code (`grep process.env`) :

| Variable | Usage | Où |
|---|---|---|
| `POSTGRES_URL` (+ `POSTGRES_URL_NO_SSL`, `POSTGRES_*`) | Connexion DB (`@vercel/postgres` auto ; `NO_SSL` pour Prisma CLI) | implicite + `prisma.config.ts` |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe (prioritaire sur table settings) | `db.ts` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clé publique Stripe | `db.ts`, StripeCardForm |
| `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET` | OAuth PayPal serveur | routes paypal |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | SDK boutons PayPal | PayPalButtonWrapper |
| `RESEND_API_KEY` | Envoi emails (sinon skip silencieux) | `email.ts` |
| `RESEND_FROM_EMAIL` | From: (défaut `EternGift <orders@eterngift.com>`) | `email.ts` |
| `DISCORD_WEBHOOK_URL` | Notification commandes (sinon skip silencieux) | `email.ts` |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Login admin (fallback si pas de hash en DB) | routes admin |
| `JWT_SECRET` | **Requis** — signature des tokens admin | `admin-auth.ts` |
| `NEXT_PUBLIC_EXCHANGE_RATE_API_KEY` | exchangerate-api.com (sinon fallback en dur) | currency/rates |
| `NEXT_PUBLIC_SITE_URL` | URLs PayPal (défaut https://eterngift.com) | paypal/create-order |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel (fallback en dur) | layout.tsx |
| `NEXT_PUBLIC_BASE_CURRENCY` | Devise de base | `currency.ts` |

`.env.example` est à jour avec toutes ces variables.

## 9. Conventions de code & sécurité

Conventions :
- TypeScript, imports alias `@/…`, App Router avec `route.ts` ; `params` awaité (style Next 15) alors que Next est en 14 — fonctionne mais à noter.
- Composants fonctionnels, `'use client'` pour tout ce qui est interactif ; Zustand pour l'état global ; pas de tests, pas de CI, ESLint `next/core-web-vitals` (`eslint-config-next` ^14).
- Nommage : camelCase TS, snake_case colonnes DB ; prix **toujours** en USD côté serveur.
- Gestion d'erreurs : try/catch + log console, réponses `{ error }` ; les appels DB du checkout ne font **pas** échouer la commande.
- Mapping produits : **toujours** passer par `src/lib/product-ids.ts` (ne pas réintroduire de mapping en dur).

Sécurité — état actuel :
- ✅ Token admin = JWT signé (`JWT_SECRET` requis ; login et toutes les routes admin échouent sans lui).
- ✅ Mot de passe admin stocké hashé (bcrypt) après changement via le dashboard.
- ✅ Route legacy `/api/paypal/checkout` supprimée ; `/api/products` POST protégé par auth admin.
- ⚠️ Clés Stripe toujours stockables en clair dans la table `settings` via le dashboard.
- ⚠️ Pas de rate limiting ni CSRF sur l'API.
- Scan secrets : aucun secret en dur dans le code ni dans l'historique Git (45 commits vérifiés). Le Meta Pixel ID en dur est public par nature.

## 10. Pièges et incohérences connus (résiduels)

1. **`prisma db push` requis après cette passe de correctifs** : les colonnes `cost` et `notes` ont été ajoutées au modèle `Order` — sans push, les éditions coût/notes du dashboard échoueront.
2. **Anciennes bases legacy** : si la DB contient des tables au format legacy (pré-Prisma : `order_id` TEXT, `base_price`…), les requêtes actuelles échouent — migration manuelle nécessaire.
3. **Checkout tolérant aux pannes DB** : une commande est confirmée au client même si l'insert DB échoue (log seulement) — voulu pour ne pas perdre une vente, mais à surveiller dans les logs.
4. **Promo codes non appliqués** au checkout (affichage seul).
5. **`users` et `currency_rates`** : tables Prisma inutilisées par le code.
6. **`return_url`/`cancel_url` PayPal sans locale** (`/api/paypal/capture`, `/checkout`) — inutilisées par le SDK boutons, mais à nettoyer si un flux redirect est réintroduit.
7. **Devise d'affichage admin en dur** : OrdersTab/Analytics affichent « € » alors que les montants sont en USD.
8. **`eterngift-prompt.md`** mentionne « SendGrid ou Resend » → implémenté : Resend uniquement.
9. **`npm install` échoue sans `POSTGRES_URL_NO_SSL`** définie (postinstall → `prisma generate` → `prisma.config.ts` → `PrismaConfigEnvError`). Une valeur factice suffit en local (pas de connexion).

## 11. Commandes de vérification avant de terminer une tâche

```bash
npm run lint                 # ESLint (next lint)
npx tsc --noEmit             # Vérif types (pas de script npm dédié)
npm run build                # prisma generate + build complet (nécessite POSTGRES_URL_NO_SSL en env)
```

Il n'y a **aucun test** automatisé. Vérifier manuellement : parcours checkout Stripe/PayPal en mode test, `/api/storefront/products`, login admin + chaque onglet du dashboard. Après toute modif de schéma : `npx prisma db push` puis vérifier `initDatabase()` (tables auxiliaires, §7).

## 12. Résumé nouvel agent (7 points essentiels)

1. **DB = SQL brut `@vercel/postgres`** partout ; Prisma n'est que le schéma de référence (`prisma db push`), son client n'est jamais utilisé.
2. **Schéma unifié** : tables métier = Prisma ; tables auxiliaires (`admin_users`, `settings`, `promo_codes`, `google_ads_expenses`) = `initDatabase()`. Les commandes sont identifiées par `order_number`.
3. **Mapping produits centralisé** dans `src/lib/product-ids.ts` (1 = bear, 2 = box) — l'étendre pour tout nouveau produit, ne jamais le dupliquer en dur.
4. **Checkout** : Stripe via Payment Element + re-vérif serveur du PaymentIntent ; PayPal v2 create→capture ; finalisation commune = `createOrder()` + email Resend + webhook Discord. Une commande est confirmée au client même si l'insert DB échoue.
5. **Auth admin = JWT signé** (`JWT_SECRET` obligatoire) ; mot de passe en bcrypt dans `admin_users` après changement, env `ADMIN_USERNAME`/`ADMIN_PASSWORD` en fallback.
6. **Toutes les pages publiques sont sous `/[lang]/`** (5 locales, devise synchronisée sur la locale via middleware). Ne pas créer de page à la racine de `app/`.
7. **`ADMIN_DASHBOARD.md` et `README.md` sont à jour** ; seuls `eterngift-prompt.md` / `eterngift-products-homepage-prompt.md` sont des documents de génération historiques.
